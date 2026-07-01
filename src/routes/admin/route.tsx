import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) throw redirect({ to: "/auth" });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);

    const isStaff = (roles ?? []).some((r) =>
      ["super_admin", "compliance", "support"].includes(r.role as string),
    );
    if (!isStaff) throw redirect({ to: "/" });
    return { user: userData.user };
  },
  component: () => <Outlet />,
});
