import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Gauge,
  Users,
  ShieldCheck,
  FileSearch,
  Bell,
  Mail,
  Smartphone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/admin", label: "Overview", icon: Gauge },
  { to: "/admin/users", label: "Customers", icon: Users },
  { to: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/admin/audit", label: "Audit log", icon: FileSearch },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/templates", label: "Email templates", icon: Mail },
  { to: "/admin/devices", label: "Devices", icon: Smartphone },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-white/10 bg-black md:flex">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Operations</p>
          <p className="mt-1 text-sm font-semibold tracking-institutional">BFB Console</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {nav.map((item) => {
            const active =
              item.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 border-l-2 px-4 py-2 text-xs tracking-institutional transition-colors ${
                  active
                    ? "border-primary bg-white/5 text-primary"
                    : "border-transparent text-secondary-foreground/60 hover:text-secondary-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-5 py-3">
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50 hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:pl-56">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="flex h-12 items-center justify-between px-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-secondary-foreground/60">
              Environment · Production
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Staff only</p>
          </div>
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
