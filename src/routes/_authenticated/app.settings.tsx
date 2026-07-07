import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  User,
  ShieldCheck,
  Bell,
  Fingerprint,
  Globe2,
  HelpCircle,
  FileText,
  LogOut,
  BadgeCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/settings")({
  component: SettingsPage,
});

type Row = { label: string; value?: string; icon: typeof User; to?: string; danger?: boolean };

const sections: { title: string; rows: Row[] }[] = [
  {
    title: "Account",
    rows: [
      { label: "Personal details", icon: User, value: "—" },
      { label: "Verification", icon: BadgeCheck, value: "Review", to: "/app/verification" },
      { label: "Preferred currency", icon: Globe2, value: "GBP" },
    ],
  },
  {
    title: "Security",
    rows: [
      { label: "Two-factor authentication", icon: ShieldCheck, value: "Required" },
      { label: "Biometric unlock", icon: Fingerprint, value: "Off" },
      { label: "Trusted devices", icon: ShieldCheck, value: "0 registered" },
    ],
  },
  {
    title: "Preferences",
    rows: [
      { label: "Notifications", icon: Bell, value: "Push · Email" },
      { label: "Statements & documents", icon: FileText },
      { label: "Help centre", icon: HelpCircle },
    ],
  },
];

function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Profile header */}
      <section className="flex items-center gap-4 border border-border bg-card p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center border border-primary text-lg font-semibold tracking-institutional text-primary">
          AO
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold tracking-institutional">Ade Osei</p>
          <p className="truncate text-xs text-muted-foreground">Personal · Verified</p>
        </div>
        <span className="inline-flex items-center gap-1 border border-primary/40 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">
          <BadgeCheck className="h-3 w-3" strokeWidth={1.5} /> KYC
        </span>
      </section>

      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.title}
          </h2>
          <ul className="divide-y divide-border border border-border bg-card">
            {s.rows.map((r) => {
              const Icon = r.icon;
              const inner = (
                <div className="flex items-center gap-4 px-5 py-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-border text-foreground">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">{r.label}</span>
                  {r.value && (
                    <span className="truncate text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {r.value}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                </div>
              );
              return (
                <li key={r.label}>
                  {r.to ? (
                    <Link to={r.to} className="block hover:bg-muted">
                      {inner}
                    </Link>
                  ) : (
                    <button type="button" className="block w-full text-left hover:bg-muted">
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="inline-flex h-12 w-full items-center justify-center gap-2 border border-border bg-card text-sm font-medium uppercase tracking-[0.2em] text-foreground hover:border-destructive hover:text-destructive"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
      </button>

      <p className="pb-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Bright Future Bank · v1.0
      </p>
    </div>
  );
}
