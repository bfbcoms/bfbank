/**
 * Server-side helper to record a KYC notification triggered by a staff
 * manual override. Verifies the caller is staff via `is_staff()` before
 * touching notification_logs with admin privileges.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const input = z.object({
  userId: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().max(1000).nullable().optional(),
  sessionId: z.string().max(200).nullable().optional(),
});

export const notifyKycDecision = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recordKycStatusNotification } = await import("@/lib/kyc-notifications.server");
    await recordKycStatusNotification(supabaseAdmin, {
      userId: data.userId,
      decision: data.decision,
      reason: data.reason ?? null,
      source: "admin_override",
      sessionId: data.sessionId ?? null,
    });
    return { ok: true };
  });
