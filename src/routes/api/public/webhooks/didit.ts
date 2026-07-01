import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Didit KYC webhook receiver.
 *
 * Verifies an HMAC signature (header: `x-didit-signature`) against DIDIT_WEBHOOK_SECRET.
 * Updates `kyc_verifications` and flips `profiles.status` to `active` or `suspended`.
 */
export const Route = createFileRoute("/api/public/webhooks/didit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("x-didit-signature") ?? "";
        const secret = process.env.DIDIT_WEBHOOK_SECRET;

        if (!secret) return new Response("Webhook not configured", { status: 500 });

        const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: {
          session_id: string;
          status: "approved" | "declined" | "expired" | "in_review";
          vendor_data?: string;
          reason?: string;
        };
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const mapped =
          payload.status === "approved"
            ? "approved"
            : payload.status === "declined"
              ? "rejected"
              : payload.status === "expired"
                ? "expired"
                : "pending";

        const { data: verification, error: updateErr } = await supabaseAdmin
          .from("kyc_verifications")
          .update({
            didit_status: mapped,
            rejection_reason: mapped === "rejected" ? (payload.reason ?? "Not disclosed") : null,
            completed_at: mapped !== "pending" ? new Date().toISOString() : null,
            raw_payload: payload as unknown as Record<string, unknown>,
          })
          .eq("didit_session_id", payload.session_id)
          .select("user_id")
          .maybeSingle();

        if (updateErr || !verification) {
          return new Response("Verification not found", { status: 404 });
        }

        if (mapped === "approved") {
          await supabaseAdmin
            .from("profiles")
            .update({ status: "active", rejection_reason: null })
            .eq("id", verification.user_id);
        } else if (mapped === "rejected") {
          await supabaseAdmin
            .from("profiles")
            .update({
              status: "suspended",
              rejection_reason: payload.reason ?? "Verification declined",
            })
            .eq("id", verification.user_id);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
