import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/settings")({
  component: SettingsPage,
});

const rows = [
  { label: "Legal name", value: "—" },
  { label: "Email", value: "—" },
  { label: "Phone", value: "—" },
  { label: "Two-factor authentication", value: "Required" },
  { label: "Trusted devices", value: "0 registered" },
];

function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-institutional">Account & security</h1>
      </header>

      <dl className="divide-y divide-border border-y border-border">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4">
            <dt className="text-sm text-muted-foreground">{r.label}</dt>
            <dd className="text-sm font-medium tracking-institutional">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
