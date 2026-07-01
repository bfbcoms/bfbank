import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

type AuditRow = {
  id: string;
  created_at: string;
  action: string;
  target_entity: string | null;
  target_id: string | null;
  admin_id: string | null;
};

function useAuditLogs() {
  return useSuspenseQuery({
    queryKey: ["admin", "audit_logs"],
    queryFn: async (): Promise<AuditRow[]> => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, created_at, action, target_entity, target_id, admin_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
  });
}

function AuditTable() {
  const { data } = useAuditLogs();
  return (
    <table className="w-full text-xs">
      <thead className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
        <tr>
          <th className="px-4 py-3 font-normal">Timestamp</th>
          <th className="px-4 py-3 font-normal">Action</th>
          <th className="px-4 py-3 font-normal">Entity</th>
          <th className="px-4 py-3 font-normal">Target</th>
          <th className="px-4 py-3 font-normal">Actor</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.length === 0 && (
          <tr>
            <td colSpan={5} className="px-4 py-10 text-center text-secondary-foreground/50">
              No events recorded.
            </td>
          </tr>
        )}
        {data.map((r) => (
          <tr key={r.id} className="hover:bg-white/5">
            <td className="px-4 py-2.5 font-mono text-[11px] text-secondary-foreground/70">
              {new Date(r.created_at).toISOString().replace("T", " ").slice(0, 19)}
            </td>
            <td className="px-4 py-2.5 tracking-institutional">{r.action}</td>
            <td className="px-4 py-2.5 text-secondary-foreground/70">{r.target_entity ?? "—"}</td>
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/50">
              {r.target_id ?? "—"}
            </td>
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/50">
              {r.admin_id ?? "system"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AuditPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Audit log</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-institutional">
            Immutable event history
          </h1>
          <p className="mt-1 text-xs text-secondary-foreground/60">
            Every privileged action is recorded. Retention: 7 years.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
          Newest 200
        </span>
      </header>

      <div className="border border-white/10 bg-black/40">
        <Suspense fallback={<div className="p-6 text-xs text-secondary-foreground/50">Loading…</div>}>
          <AuditTable />
        </Suspense>
      </div>
    </div>
  );
}
