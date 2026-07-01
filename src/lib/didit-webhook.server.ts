/**
 * Pure, dependency-injected Didit webhook processor.
 *
 * Extracted from the route handler so it can be unit-tested without a running
 * server. Returns an HTTP-shaped result the route file translates into a
 * `Response`. Design goals:
 *
 * 1. Validate the payload with Zod — never trust the shape.
 * 2. Verify the HMAC signature with a timing-safe compare BEFORE any DB work.
 * 3. Be idempotent — re-delivering the same terminal event returns 200 without
 *    re-writing the profile / re-sending notifications.
 * 4. Never 5xx on a transient DB failure — Didit interprets any non-2xx as a
 *    retryable error, so we return 200 with `{ ok: false, retryable: true }`
 *    for infra hiccups and only 4xx for permanently malformed input.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { recordKycStatusNotification } from "./kyc-notifications.server";

const payloadSchema = z.object({
  session_id: z.string().min(1).max(200),
  status: z.enum(["approved", "declined", "expired", "in_review", "pending"]),
  vendor_data: z.string().optional(),
  reason: z.string().max(1000).optional(),
});

export type WebhookResult = {
  status: number;
  body: unknown;
};

export function verifyDiditSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expected);
  if (sig.length !== exp.length) return false;
  try {
    return timingSafeEqual(sig, exp);
  } catch {
    return false;
  }
}

const TERMINAL: ReadonlyArray<Database["public"]["Enums"]["kyc_status"]> = [
  "approved",
  "rejected",
  "expired",
];

export async function processDiditWebhook(
  rawBody: string,
  signature: string | null,
  secret: string | undefined,
  admin: SupabaseClient<Database>,
): Promise<WebhookResult> {
  if (!secret) return { status: 500, body: { error: "webhook_not_configured" } };

  if (!verifyDiditSignature(rawBody, signature, secret)) {
    return { status: 401, body: { error: "invalid_signature" } };
  }

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

  const mapped: Database["public"]["Enums"]["kyc_status"] =
    payload.status === "approved"
      ? "approved"
      : payload.status === "declined"
        ? "rejected"
        : payload.status === "expired"
          ? "expired"
          : "pending";

  // Look up first — lets us handle idempotency without a write on replay.
  const { data: existing, error: readErr } = await admin
    .from("kyc_verifications")
    .select("id, user_id, didit_status")
    .eq("didit_session_id", payload.session_id)
    .maybeSingle();

  if (readErr) {
    // Transient — ask Didit to retry by responding 200 with retryable=true so
    // it doesn't hammer us with exponential backoff forever, but still logs.
    return { status: 200, body: { ok: false, retryable: true, reason: readErr.message } };
  }
  if (!existing) return { status: 404, body: { error: "session_not_found" } };

  // Idempotency: session already in a terminal state → no-op.
  if (TERMINAL.includes(existing.didit_status) && existing.didit_status === mapped) {
    return { status: 200, body: { ok: true, idempotent: true } };
  }
  // Refuse to move a session out of a terminal state.
  if (TERMINAL.includes(existing.didit_status) && mapped !== existing.didit_status) {
    return {
      status: 409,
      body: { error: "terminal_state", current: existing.didit_status, incoming: mapped },
    };
  }

  const { error: updateErr } = await admin
    .from("kyc_verifications")
    .update({
      didit_status: mapped,
      rejection_reason: mapped === "rejected" ? (payload.reason ?? "Not disclosed") : null,
      completed_at: mapped !== "pending" ? new Date().toISOString() : null,
      raw_payload: payload as never,
    })
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

    // Best-effort — never fail the webhook because a notification write hiccuped.
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
