/**
 * Server-only helper that records KYC status change notifications.
 *
 * Every terminal transition (approved / rejected) writes a row to
 * `notification_logs` so downstream email/SMS workers (and the compliance
 * audit trail) have a single source of truth. When an app-email domain is
 * configured, this is the single place to trigger the send.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Admin = SupabaseClient<Database>;
type Decision = "approved" | "rejected";

export interface KycNotificationInput {
  userId: string;
  decision: Decision;
  reason?: string | null;
  source: "webhook" | "admin_override" | "mock";
  sessionId?: string | null;
}

export async function recordKycStatusNotification(
  admin: Admin,
  input: KycNotificationInput,
): Promise<void> {
  const { userId, decision, reason, source, sessionId } = input;

  // Resolve recipient email best-effort; the profile row does not carry email,
  // so we look it up from auth. Failures are non-fatal — we still log the event.
  let email: string | null = null;
  try {
    const { data } = await admin.auth.admin.getUserById(userId);
    email = data.user?.email ?? null;
  } catch {
    /* swallow — notification still recorded */
  }

  const subject =
    decision === "approved"
      ? "Your Bright Future Bank account is verified"
      : "Additional information required for your Bright Future Bank verification";

  await admin.from("notification_logs").insert({
    user_id: userId,
    channel: "email",
    provider: "internal",
    status: email ? "queued" : "failed",
    payload: {
      template: decision === "approved" ? "kyc.approved" : "kyc.rejected",
      subject,
      to: email,
      reason: reason ?? null,
      source,
      session_id: sessionId ?? null,
      queued_at: new Date().toISOString(),
    } as never,
  });

  // NOTE: Actual email delivery is picked up by the transactional-email queue
  // once the sender domain is verified (see /admin — Email settings).
}
