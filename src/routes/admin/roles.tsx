import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/roles")({
  component: RolesPage,
});

type RoleRow = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
};

function useRoles() {
  return useSuspenseQuery({
    queryKey: ["admin", "user_roles"],
    queryFn: async (): Promise<RoleRow[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RoleRow[];
    },
  });
}

const roleTone: Record<string, string> = {
  super_admin: "text-primary",
  compliance: "text-primary",
  support: "text-secondary-foreground/80",
  user: "text-secondary-foreground/50",
};

function RolesTable() {
  const { data } = useRoles();
  return (
    <table className="w-full text-xs">
      <thead className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
        <tr>
          <th className="px-4 py-3 font-normal">User</th>
          <th className="px-4 py-3 font-normal">Role</th>
          <th className="px-4 py-3 font-normal">Granted</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.length === 0 && (
          <tr>
            <td colSpan={3} className="px-4 py-10 text-center text-secondary-foreground/50">
              No role grants issued.
            </td>
          </tr>
        )}
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-white/5">
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/60">
              {r.user_id}
            </td>
            <td className="px-4 py-2.5">
              <span
                className={`text-[10px] uppercase tracking-[0.25em] ${
                  roleTone[r.role] ?? "text-secondary-foreground/60"
                }`}
              >
                {r.role.replace("_", " ")}
              </span>
            </td>
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/50">
              {new Date(r.created_at).toISOString().slice(0, 10)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RolesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">User roles</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-institutional">
          Access & privilege grants
        </h1>
        <p className="mt-1 text-xs text-secondary-foreground/60">
          Staff privileges follow the principle of least authority. Every grant is audited.
        </p>
      </header>

      <div className="border border-white/10 bg-black/40">
        <Suspense fallback={<div className="p-6 text-xs text-secondary-foreground/50">Loading…</div>}>
          <RolesTable />
        </Suspense>
      </div>
    </div>
  );
}
