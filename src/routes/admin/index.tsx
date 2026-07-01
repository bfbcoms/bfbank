import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const kpis = [
  { label: "Customers", value: "0" },
  { label: "Pending KYC", value: "0" },
  { label: "Open cases", value: "0" },
  { label: "Alerts (24h)", value: "0" },
];

function AdminHome() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Operations</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-institutional">Overview</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="border border-white/10 bg-black/40 p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
              {k.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-institutional text-primary">
              {k.value}
            </p>
          </div>
        ))}
      </section>

      <section className="border border-white/10 bg-black/40">
        <div className="border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
          Latest audit events
        </div>
        <div className="px-4 py-6 text-xs text-secondary-foreground/50">
          No events recorded.
        </div>
      </section>
    </div>
  );
}
