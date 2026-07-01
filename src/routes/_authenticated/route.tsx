import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { WebLayout } from "@/layouts/WebLayout";
import { PWALayout } from "@/layouts/PWALayout";
import { useResponsiveShell } from "@/hooks/use-responsive-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, account_type")
      .eq("id", data.user.id)
      .maybeSingle();

    const status = profile?.status ?? "pending_kyc";
    // Gate all app routes on KYC status.
    if (status === "suspended" || status === "closed") {
      if (!location.pathname.startsWith("/account-restricted")) {
        throw redirect({ to: "/account-restricted" });
      }
    } else if (status !== "active") {
      if (!location.pathname.startsWith("/onboarding")) {
        throw redirect({ to: "/onboarding" });
      }
    }

    return { user: data.user, profile };
  },
  component: AuthenticatedShell,
});

function AuthenticatedShell() {
  const shell = useResponsiveShell();
  const Layout = shell === "pwa" ? PWALayout : WebLayout;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
