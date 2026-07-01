import { createFileRoute } from "@tanstack/react-router";
import { processDiditWebhook } from "@/lib/didit-webhook.server";

/**
 * Didit KYC webhook receiver.
 *
 * Logic lives in `didit-webhook.server.ts` (unit-tested). This file just wires
 * the HTTP surface: read raw body once, verify signature, delegate.
 */
export const Route = createFileRoute("/api/public/webhooks/didit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch {
          return Response.json({ error: "unreadable_body" }, { status: 400 });
        }

        const signature = request.headers.get("x-didit-signature");
        const secret = process.env.DIDIT_WEBHOOK_SECRET;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const result = await processDiditWebhook(rawBody, signature, secret, supabaseAdmin);
        return Response.json(result.body, { status: result.status });
      },
    },
  },
});
