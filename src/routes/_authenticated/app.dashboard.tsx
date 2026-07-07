import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Repeat2,
  CreditCard,
  Eye,
  EyeOff,
  ShoppingBag,
  Building2,
  Zap,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { CurrencyFlag } from "@/components/CurrencyFlag";

export const Route = createFileRoute("/_authenticated/app/dashboard")({
  component: DashboardHome,
});

const accounts = [
  { c: "GBP", n: "Sterling", v: "£8,204.10", delta: "+£312.40" },
  { c: "EUR", n: "Euro", v: "€3,110.44", delta: "−€48.10" },
  { c: "USD", n: "US dollar", v: "$1,384.62", delta: "+$92.00" },
];

const activity = [
  { label: "Kaffee & Kollektiv", meta: "Card · Berlin", amount: "−£4.20", icon: Utensils, dir: "out" as const },
  { label: "Aurelia Chen", meta: "Incoming transfer", amount: "+£1,250.00", icon: ArrowDownLeft, dir: "in" as const },
  { label: "GBP → EUR", meta: "FX conversion · 1.1732", amount: "−£500.00", icon: Repeat2, dir: "out" as const },
  { label: "Northwind Ltd", meta: "Salary", amount: "+£3,842.55", icon: Building2, dir: "in" as const },
  { label: "Uber", meta: "Card · London", amount: "−£11.80", icon: ShoppingBag, dir: "out" as const },
  { label: "EDF Energy", meta: "Direct debit", amount: "−£64.12", icon: Zap, dir: "out" as const },
];

const quickActions = [
  { label: "Send", icon: ArrowUpRight, to: "/app/send-money" },
  { label: "Add", icon: Plus, to: "/app/accounts" },
  { label: "Convert", icon: Repeat2, to: "/app/send-money" },
  { label: "Cards", icon: CreditCard, to: "/app/cards" },
] as const;

function DashboardHome() {
  const [hidden, setHidden] = useState(false);
  const balance = hidden ? "•••••••" : "£12,480.19";

  return (
    <div className="-mx-5 -mt-5 md:mx-0 md:mt-0">
      {/* Balance hero */}
      <section className="bg-secondary px-5 pb-8 pt-6 text-secondary-foreground md:mb-8 md:px-8 md:pt-8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Total balance</p>
          <button
            type="button"
            onClick={() => setHidden((v) => !v)}
            aria-label={hidden ? "Show balance" : "Hide balance"}
            className="grid h-8 w-8 place-items-center border border-white/15 text-secondary-foreground/70 hover:text-primary"
          >
            {hidden ? <Eye className="h-4 w-4" strokeWidth={1.5} /> : <EyeOff className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </div>
        <p className="mt-4 text-5xl font-semibold tracking-institutional md:text-6xl">{balance}</p>
        <p className="mt-2 text-xs text-secondary-foreground/60">
          Across 3 currency accounts · Updated just now
        </p>

        {/* Quick actions */}
        <div className="mt-7 grid grid-cols-4 gap-2">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                to={a.to}
                className="group flex flex-col items-center gap-2 border border-white/10 bg-white/[0.03] py-4 transition-colors hover:border-primary hover:bg-primary/10"
              >
                <span className="grid h-9 w-9 place-items-center border border-primary/50 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-secondary-foreground/80">
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="space-y-8 px-5 pt-8 md:px-0">
        {/* Currency accounts strip */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Accounts
            </h2>
            <Link to="/app/accounts" className="text-[11px] uppercase tracking-[0.2em] text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {accounts.map((a) => (
              <Link
                key={a.c}
                to="/app/accounts"
                className="min-w-[220px] snap-start border border-border bg-card p-5 transition-colors hover:border-primary md:min-w-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CurrencyFlag code={a.c} size={18} />
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {a.n} · {a.c}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-institutional">{a.v}</p>
                <p className={`mt-1 text-[11px] ${a.delta.startsWith("+") ? "text-primary" : "text-muted-foreground"}`}>
                  {a.delta} this week
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Recent activity
            </h2>
            <span className="text-[11px] text-muted-foreground">Last 7 days</span>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {activity.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.label + a.amount} className="flex items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center border ${
                        a.dir === "in"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{a.meta}</p>
                    </div>
                  </div>
                  <p className={`shrink-0 text-sm font-semibold tracking-institutional ${a.dir === "in" ? "text-primary" : ""}`}>
                    {a.amount}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
