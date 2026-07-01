import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { WebLayout } from "@/layouts/WebLayout";
import { PWALayout } from "@/layouts/PWALayout";
import { useResponsiveShell } from "@/hooks/use-responsive-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
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
