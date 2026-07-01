import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const STAFF_ROLES = ["super_admin", "compliance", "support"] as const;

export function useIsStaff() {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      if (!active) return;
      setIsStaff(
        (roles ?? []).some((r) => (STAFF_ROLES as readonly string[]).includes(r.role as string)),
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  return isStaff;
}
