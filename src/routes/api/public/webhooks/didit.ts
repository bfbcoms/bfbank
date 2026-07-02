import { createFileRoute } from "@tanstack/react-router";
import { processDiditWebhook, type DiditWebhookHeaders } from "@/lib/didit-webhook.server";

/**
 * Didit V3 KYC webhook receiver.
 *
 * Handler is a thin adapter — pulls raw body + signature headers and
 * delegates to the pure processor (unit-tested in `didit-webhook.test.ts`).
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

        const headers: DiditWebhookHeaders = {
          signature:
            request.headers.get("x-signature") ?? request.headers.get("x-didit-signature"),
          signatureV2: request.headers.get("x-signature-v2"),
          timestamp: request.headers.get("x-timestamp"),
        };
        const secret = process.env.DIDIT_WEBHOOK_SECRET;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const result = await processDiditWebhook(rawBody, headers, secret, supabaseAdmin);
        return Response.json(result.body, { status: result.status });
      },
    },
  },
});
