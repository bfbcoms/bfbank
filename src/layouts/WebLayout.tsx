import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Wallet, CreditCard, ArrowUpRight, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/send-money", label: "Send money", icon: ArrowUpRight },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function WebLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-secondary text-secondary-foreground md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground text-sm font-semibold">
            BFB
          </div>
          <span className="text-sm font-medium tracking-institutional uppercase">
            Bright Future
          </span>
        </div>

        <nav className="mt-4 flex-1 px-3">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-1 flex items-center gap-3 px-3 py-3 text-sm tracking-institutional transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground/70 hover:bg-white/5 hover:text-secondary-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/60 hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Personal · GBP
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex h-2 w-2 bg-primary" aria-hidden />
              All systems operational
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
