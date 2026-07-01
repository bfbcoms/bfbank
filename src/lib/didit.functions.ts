import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createSessionInput = z.object({
  accountType: z.enum(["individual", "business"]),
  returnUrl: z.string().url(),
});

/**
 * Kicks off a Didit KYC/KYB session for the current user.
 * If DIDIT_MOCK_MODE is true (default), no external call is made — a fake session
 * is generated and the user's profile is immediately marked `active` so the
 * whole flow can be tested end-to-end.
 */
export const createDiditSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createSessionInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const mockMode = (process.env.DIDIT_MOCK_MODE ?? "true").toLowerCase() === "true";

    // Persist an in-flight verification row (RLS: user_id = auth.uid())
    const sessionId = mockMode
      ? `mock_${crypto.randomUUID()}`
      : await requestDiditSession(data.returnUrl, userId);

    const verificationUrl = mockMode
      ? `${data.returnUrl}?mock_session=${sessionId}&status=approved`
      : `${process.env.DIDIT_BASE_URL ?? "https://verification.didit.me"}/session/${sessionId}`;

    const { error: insertErr } = await supabase.from("kyc_verifications").insert({
      user_id: userId,
      account_type: data.accountType,
      provider: "didit",
      didit_session_id: sessionId,
      didit_verification_url: verificationUrl,
      didit_status: "pending",
    });
    if (insertErr) throw new Error(`Could not create verification: ${insertErr.message}`);

    if (mockMode) {
      // Simulate an instant webhook: approve the user right away.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("kyc_verifications")
        .update({
          didit_status: "approved",
          completed_at: new Date().toISOString(),
          raw_payload: { mock: true, decision: "approved" },
        })
        .eq("didit_session_id", sessionId);

      await supabaseAdmin
        .from("profiles")
        .update({ status: "active", rejection_reason: null })
        .eq("id", userId);
    }

    return { sessionId, verificationUrl, mockMode };
  });

async function requestDiditSession(returnUrl: string, userId: string): Promise<string> {
  const apiKey = process.env.DIDIT_API_KEY;
  const baseUrl = process.env.DIDIT_BASE_URL ?? "https://verification.didit.me";
  if (!apiKey) throw new Error("DIDIT_API_KEY not configured");

  const res = await fetch(`${baseUrl}/v1/session/`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({
      vendor_data: userId,
      callback: returnUrl,
    }),
  });
  if (!res.ok) throw new Error(`Didit session request failed: ${res.status}`);
  const json = (await res.json()) as { session_id: string };
  return json.session_id;
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
