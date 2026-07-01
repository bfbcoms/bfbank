import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/devices")({
  component: DevicesPage,
});

type Device = {
  id: string;
  user_id: string;
  device_type: string;
  last_active_at: string;
  created_at: string;
};

function useDevices() {
  return useSuspenseQuery({
    queryKey: ["admin", "user_devices"],
    queryFn: async (): Promise<Device[]> => {
      const { data, error } = await supabase
        .from("user_devices")
        .select("id, user_id, device_type, last_active_at, created_at")
        .order("last_active_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Device[];
    },
  });
}

function DevicesTable() {
  const { data } = useDevices();
  return (
    <table className="w-full text-xs">
      <thead className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
        <tr>
          <th className="px-4 py-3 font-normal">Customer</th>
          <th className="px-4 py-3 font-normal">Type</th>
          <th className="px-4 py-3 font-normal">Last active</th>
          <th className="px-4 py-3 font-normal">Registered</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-10 text-center text-secondary-foreground/50">
              No trusted devices registered yet.
            </td>
          </tr>
        )}
        {data.map((d) => (
          <tr key={d.id} className="hover:bg-white/5">
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/60">
              {d.user_id}
            </td>
            <td className="px-4 py-2.5 tracking-institutional uppercase text-primary">
              {d.device_type}
            </td>
            <td className="px-4 py-2.5 font-mono text-[11px]">
              {new Date(d.last_active_at).toISOString().replace("T", " ").slice(0, 19)}
            </td>
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/50">
              {new Date(d.created_at).toISOString().slice(0, 10)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DevicesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Devices</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-institutional">
          Registered end-user devices
        </h1>
        <p className="mt-1 text-xs text-secondary-foreground/60">
          Trusted devices approved for push and step-up authentication.
        </p>
      </header>

      <div className="border border-white/10 bg-black/40">
        <Suspense fallback={<div className="p-6 text-xs text-secondary-foreground/50">Loading…</div>}>
          <DevicesTable />
        </Suspense>
      </div>
    </div>
  );
}
