import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createSessionInput = z.object({
  accountType: z.enum(["individual", "business"]),
  returnUrl: z.string().url(),
});

/**
 * Didit V3 session response — we only depend on the fields we actually use.
 * See: https://docs.didit.me/api-reference/session/create-session
 */
const diditV3SessionSchema = z.object({
  session_id: z.string(),
  session_token: z.string().optional(),
  url: z.string().url().optional(),
  verification_url: z.string().url().optional(),
});

/**
 * Kicks off a Didit KYC/KYB session for the current user.
 *
 * Production path: POST https://verification.didit.me/v3/session/ with the
 * configured workflow_id and the user's internal id as vendor_data. Didit
 * returns a hosted verification URL (and session token) which we hand to the
 * browser. Terminal status arrives asynchronously via the webhook.
 *
 * Mock mode (DIDIT_MOCK_MODE=true): skip the external call, mint a fake
 * session id, and auto-approve the user so the flow is testable without
 * burning real Didit sessions.
 */
export const createDiditSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createSessionInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const mockMode = (process.env.DIDIT_MOCK_MODE ?? "true").toLowerCase() === "true";
    const workflowId = process.env.DIDIT_WORKFLOW_ID ?? null;

    let sessionId: string;
    let sessionToken: string | null = null;
    let verificationUrl: string;

    if (mockMode) {
      sessionId = `mock_${crypto.randomUUID()}`;
      verificationUrl = `${data.returnUrl}?mock_session=${sessionId}&status=approved`;
    } else {
      const created = await requestDiditSession({
        workflowId,
        callback: data.returnUrl,
        vendorData: userId,
      });
      sessionId = created.session_id;
      sessionToken = created.session_token ?? null;
      verificationUrl =
        created.url ??
        created.verification_url ??
        `${process.env.DIDIT_BASE_URL ?? "https://verify.didit.me"}/session/${sessionId}`;
    }

    const { error: insertErr } = await supabase.from("kyc_verifications").insert({
      user_id: userId,
      account_type: data.accountType,
      provider: "didit",
      didit_session_id: sessionId,
      didit_verification_url: verificationUrl,
      didit_status: "pending",
      // Newly-added columns — types file regenerates after the migration is
      // approved; cast keeps the current build green in the meantime.
      ...({ workflow_id: workflowId, session_token: sessionToken } as Record<string, unknown>),
    } as never);
    if (insertErr) throw new Error(`Could not create verification: ${insertErr.message}`);

    if (mockMode) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("kyc_verifications")
        .update({
          didit_status: "approved",
          completed_at: new Date().toISOString(),
          raw_payload: { mock: true, decision: "approved" } as never,
        })
        .eq("didit_session_id", sessionId);

      await supabaseAdmin
        .from("profiles")
        .update({ status: "active", rejection_reason: null })
        .eq("id", userId);

      const { recordKycStatusNotification } = await import("@/lib/kyc-notifications.server");
      await recordKycStatusNotification(supabaseAdmin, {
        userId,
        decision: "approved",
        source: "mock",
        sessionId,
      });
    }

    return { sessionId, sessionToken, verificationUrl, mockMode };
  });

async function requestDiditSession(input: {
  workflowId: string | null;
  callback: string;
  vendorData: string;
}): Promise<z.infer<typeof diditV3SessionSchema>> {
  const apiKey = process.env.DIDIT_API_KEY;
  const baseUrl = process.env.DIDIT_BASE_URL ?? "https://verification.didit.me";
  if (!apiKey) throw new Error("DIDIT_API_KEY not configured");
  if (!input.workflowId) throw new Error("DIDIT_WORKFLOW_ID not configured");

  const res = await fetch(`${baseUrl}/v3/session/`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      workflow_id: input.workflowId,
      callback: input.callback,
      vendor_data: input.vendorData,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Didit session request failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  return diditV3SessionSchema.parse(await res.json());
}

/** Read the current user's latest verification (used by pending screens). */
export const getMyLatestKyc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("kyc_verifications")
      .select("id, didit_status, rejection_reason, submitted_at, completed_at, account_type")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });
