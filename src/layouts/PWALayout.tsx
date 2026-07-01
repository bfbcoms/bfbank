import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Wallet, CreditCard, ArrowUpRight, Settings } from "lucide-react";
import { InstallAppBanner } from "@/components/InstallAppBanner";

const nav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/send-money", label: "Send", icon: ArrowUpRight },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/settings", label: "Profile", icon: Settings },
] as const;

export function PWALayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center bg-secondary text-primary text-xs font-semibold">
              BFB
            </div>
            <span className="text-xs font-medium tracking-institutional uppercase">
              Bright Future
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Personal
          </span>
        </div>
      </header>

      <main
        className="px-5 pb-32 pt-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }}
      >
        {children}
      </main>

      <InstallAppBanner />

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-secondary text-secondary-foreground"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                    active ? "text-primary" : "text-secondary-foreground/60"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
