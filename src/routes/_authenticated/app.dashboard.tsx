import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { CurrencyFlag } from "@/components/CurrencyFlag";


export const Route = createFileRoute("/_authenticated/app/dashboard")({
  component: DashboardHome,
});

const activity = [
  { label: "Card payment · Kaffee & Kollektiv", amount: "−£4.20", direction: "out" as const },
  { label: "Incoming transfer · Aurelia Chen", amount: "+£1,250.00", direction: "in" as const },
  { label: "FX conversion · GBP → EUR", amount: "−£500.00", direction: "out" as const },
  { label: "Salary · Northwind Ltd", amount: "+£3,842.55", direction: "in" as const },
];

function DashboardHome() {
  return (
    <div className="space-y-10">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Total balance</p>
        <p className="mt-3 text-5xl font-semibold tracking-institutional">£12,480.19</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Available to spend across 3 currency accounts.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { c: "GBP", n: "Sterling", v: "£8,204.10" },
          { c: "EUR", n: "Euro", v: "€3,110.44" },
          { c: "USD", n: "US dollar", v: "$1,384.62" },
        ].map((a) => (
          <div key={a.c} className="border border-border bg-card p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {a.n} · {a.c}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-institutional">{a.v}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Recent activity
          </h2>
          <span className="text-xs text-muted-foreground">Last 7 days</span>
        </div>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {activity.map((a) => (
            <li key={a.label} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`grid h-9 w-9 place-items-center border ${
                    a.direction === "in"
                      ? "border-primary text-primary"
                      : "border-border text-foreground"
                  }`}
                >
                  {a.direction === "in" ? (
                    <ArrowDownLeft className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </div>
                <p className="text-sm">{a.label}</p>
              </div>
              <p className="text-sm font-medium tracking-institutional">{a.amount}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
