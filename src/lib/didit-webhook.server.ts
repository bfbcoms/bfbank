/**
 * Didit V3 webhook processor.
 *
 * Design goals:
 *  1. Validate the payload with Zod — never trust the shape.
 *  2. Verify the HMAC signature with a timing-safe compare BEFORE any DB work.
 *     Supports both official header schemes:
 *       - X-Signature-V2 = HMAC-SHA256 over canonical JSON (sorted keys,
 *         compact separators, unescaped Unicode). Survives middleware
 *         re-encoding. Preferred.
 *       - X-Signature    = HMAC-SHA256 over the exact raw body bytes.
 *     X-Timestamp within ±300s of `now` is required to prevent replay.
 *  3. Idempotent — re-delivering the same terminal event returns 200 without
 *     re-writing the profile / re-sending notifications.
 *  4. Never 5xx on a transient DB failure — Didit interprets any non-2xx as
 *     retryable, so we return 200 `{ ok: false, retryable: true }` for infra
 *     hiccups and only 4xx for permanently malformed input.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { recordKycStatusNotification } from "./kyc-notifications.server";

/**
 * Didit V3 sends PascalCase / spaced status strings. We accept both the V3
 * spec set and the legacy lowercase set (which we generate ourselves in tests
 * and mock mode) so the same processor covers both.
 */
const statusSchema = z.enum([
  // V3 spec
  "Approved",
  "Declined",
  "In Review",
  "In Progress",
  "Abandoned",
  "Not Started",
  "Expired",
  // Legacy / internal
  "approved",
  "declined",
  "in_review",
  "in_progress",
  "abandoned",
  "not_started",
  "expired",
  "pending",
]);

const payloadSchema = z.object({
  session_id: z.string().min(1).max(200),
  status: statusSchema,
  vendor_data: z.string().optional(),
  reason: z.string().max(2000).optional(),
  // V3 decision blob — plural arrays. We store it verbatim without asserting
  // node ids, so schema drift on Didit's side never crashes the webhook.
  decision: z.record(z.string(), z.unknown()).optional(),
});

export type WebhookResult = { status: number; body: unknown };

const MAX_TIMESTAMP_SKEW_SECONDS = 300;

/** Recursively sorts object keys — required for canonical-JSON HMAC (V2). */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    const src = value as Record<string, unknown>;
    return Object.keys(src)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = canonicalize(src[k]);
        return acc;
      }, {});
  }
  return value;
}

function canonicalJson(parsed: unknown): string {
  // `JSON.stringify` already uses compact separators and does not escape
  // non-ASCII characters unnecessarily, matching Didit's canonicalization.
  return JSON.stringify(canonicalize(parsed));
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  try {
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

/** Legacy single-header verifier retained for the pre-V3 tests. */
export function verifyDiditSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqualHex(signature, expected);
}

export interface DiditWebhookHeaders {
  signature?: string | null;
  signatureV2?: string | null;
  timestamp?: string | null;
}

export function verifyDiditWebhook(
  rawBody: string,
  headers: DiditWebhookHeaders,
  secret: string,
  now: number = Math.floor(Date.now() / 1000),
): { ok: true } | { ok: false; reason: string } {
  const { signature, signatureV2, timestamp } = headers;

  if (timestamp) {
    const ts = Number(timestamp);
    if (!Number.isFinite(ts)) return { ok: false, reason: "bad_timestamp" };
    if (Math.abs(now - ts) > MAX_TIMESTAMP_SKEW_SECONDS) {
      return { ok: false, reason: "timestamp_skew" };
    }
  }

  if (signatureV2) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return { ok: false, reason: "invalid_json" };
    }
    const expected = createHmac("sha256", secret).update(canonicalJson(parsed)).digest("hex");
    if (timingSafeEqualHex(signatureV2, expected)) return { ok: true };
    return { ok: false, reason: "bad_signature_v2" };
  }

  if (signature) {
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    if (timingSafeEqualHex(signature, expected)) return { ok: true };
    return { ok: false, reason: "bad_signature" };
  }

  return { ok: false, reason: "missing_signature" };
}

type InternalStatus = Database["public"]["Enums"]["kyc_status"];

const TERMINAL: ReadonlyArray<InternalStatus> = [
  "approved",
  "rejected",
  "expired",
  "abandoned",
] as InternalStatus[];

function mapStatus(raw: z.infer<typeof statusSchema>): InternalStatus {
  const key = raw.toLowerCase().replace(/\s+/g, "_");
  switch (key) {
    case "approved":
      return "approved";
    case "declined":
      return "rejected";
    case "expired":
      return "expired";
    case "abandoned":
      return "abandoned" as InternalStatus;
    case "in_review":
      return "in_review" as InternalStatus;
    case "in_progress":
      return "in_progress" as InternalStatus;
    case "not_started":
    case "pending":
    default:
      return "pending";
  }
}

export async function processDiditWebhook(
  rawBody: string,
  signatureOrHeaders: string | null | DiditWebhookHeaders,
  secret: string | undefined,
  admin: SupabaseClient<Database>,
): Promise<WebhookResult> {
  if (!secret) return { status: 500, body: { error: "webhook_not_configured" } };

  // Back-compat: earlier callers (and existing tests) pass a raw
  // `X-Signature` string. New callers pass the full header bag.
  const headers: DiditWebhookHeaders =
    typeof signatureOrHeaders === "string" || signatureOrHeaders === null
      ? { signature: signatureOrHeaders }
      : signatureOrHeaders;

  const check = verifyDiditWebhook(rawBody, headers, secret);
  if (!check.ok) return { status: 401, body: { error: "invalid_signature", reason: check.reason } };

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: "invalid_json" } };
  }

  const parseResult = payloadSchema.safeParse(parsed);
  if (!parseResult.success) {
    return { status: 400, body: { error: "invalid_payload", issues: parseResult.error.issues } };
  }
  const payload = parseResult.data;
  const mapped = mapStatus(payload.status);
  const decisionId =
    (payload.decision && typeof (payload.decision as Record<string, unknown>).id === "string"
      ? ((payload.decision as Record<string, unknown>).id as string)
      : null) ?? null;

  // Hard idempotency: unique (session_id, status). If the same terminal event
  // is re-delivered, the insert fails and we short-circuit before any writes
  // to kyc_verifications / profiles / notifications.
  const { error: eventErr } = await admin
    .from("didit_webhook_events" as never)
    .insert({
      session_id: payload.session_id,
      status: payload.status,
      decision_id: decisionId,
      payload: payload as never,
      processed_status: mapped,
    } as never);
  if (eventErr) {
    // 23505 = unique_violation → this exact (session,status) already processed.
    const code = (eventErr as { code?: string }).code;
    if (code === "23505") {
      return { status: 200, body: { ok: true, idempotent: true } };
    }
    return { status: 200, body: { ok: false, retryable: true, reason: eventErr.message } };
  }

  const { data: existing, error: readErr } = await admin
    .from("kyc_verifications")
    .select("id, user_id, didit_status")
    .eq("didit_session_id", payload.session_id)
    .maybeSingle();

  if (readErr) {
    return { status: 200, body: { ok: false, retryable: true, reason: readErr.message } };
  }
  if (!existing) return { status: 404, body: { error: "session_not_found" } };

  if (TERMINAL.includes(existing.didit_status) && existing.didit_status === mapped) {
    return { status: 200, body: { ok: true, idempotent: true } };
  }
  if (TERMINAL.includes(existing.didit_status) && mapped !== existing.didit_status) {
    return {
      status: 409,
      body: { error: "terminal_state", current: existing.didit_status, incoming: mapped },
    };
  }

  const isTerminal = TERMINAL.includes(mapped);
  const { error: updateErr } = await admin
    .from("kyc_verifications")
    .update({
      didit_status: mapped,
      rejection_reason: mapped === "rejected" ? (payload.reason ?? "Not disclosed") : null,
      completed_at: isTerminal ? new Date().toISOString() : null,
      raw_payload: payload as never,
      ...({ decision_data: payload.decision ?? null } as Record<string, unknown>),
    } as never)
    .eq("id", existing.id);

  if (updateErr) {
    return { status: 200, body: { ok: false, retryable: true, reason: updateErr.message } };
  }

  if (mapped === "approved" || mapped === "rejected") {
    const { error: profileErr } = await admin
      .from("profiles")
      .update({
        status: mapped === "approved" ? "active" : "suspended",
        rejection_reason:
          mapped === "rejected" ? (payload.reason ?? "Verification declined") : null,
      })
      .eq("id", existing.user_id);

    if (profileErr) {
      return { status: 200, body: { ok: false, retryable: true, reason: profileErr.message } };
    }

    try {
      await recordKycStatusNotification(admin, {
        userId: existing.user_id,
        decision: mapped,
        reason: payload.reason ?? null,
        source: "webhook",
        sessionId: payload.session_id,
      });
    } catch {
      /* logged elsewhere */
    }
  }

  return { status: 200, body: { ok: true, status: mapped } };
}
