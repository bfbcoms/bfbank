import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { makeRouteMeta } from "@/lib/route-meta";
import { SUPPORT_EMAIL } from "@/lib/site-config";

export const Route = createFileRoute("/account-restricted")({
  ssr: false,
  head: () =>
    makeRouteMeta({
      title: "Account restricted — Bright Future Bank",
      description: "Your Bright Future Bank account access is currently restricted.",
      path: "/account-restricted",
      noindex: true,
    }),
  component: RestrictedPage,
});

function RestrictedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center border border-primary/40 bg-primary/5">
          <ShieldAlert className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-primary">
          Bright Future Bank
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-institutional">
          Your account is under review
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Access to your account has been temporarily restricted while our compliance team
          completes a review. Your funds are safe. Please contact our support team so we can
          help resolve this quickly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex h-11 items-center justify-center bg-primary px-6 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90"
          >
            Contact support
          </a>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="inline-flex h-11 items-center justify-center border border-foreground px-6 text-xs font-medium uppercase tracking-[0.25em] text-foreground hover:bg-foreground hover:text-background"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
