import { createFileRoute } from "@tanstack/react-router";
import { Zap, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { SendMoneyCalculator } from "@/components/marketing/SendMoneyCalculator";
import { ClosingCta } from "./personal";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Cross-border transfers — Bright Future Bank" },
      {
        name: "description",
        content:
          "Send money to 40+ currencies at the real exchange rate. Most transfers arrive in seconds, all tracked live inside your account.",
      },
    ],
  }),
  component: TransfersPage,
});

const corridors = [
  { from: "GBP", to: "USD", speed: "Seconds", cost: "0.35%" },
  { from: "GBP", to: "EUR", speed: "Seconds", cost: "0.30%" },
  { from: "GBP", to: "NGN", speed: "Under 30 min", cost: "0.55%" },
  { from: "USD", to: "INR", speed: "Under 30 min", cost: "0.45%" },
  { from: "EUR", to: "AED", speed: "Seconds", cost: "0.40%" },
  { from: "USD", to: "PHP", speed: "Under 60 min", cost: "0.55%" },
  { from: "GBP", to: "KES", speed: "Under 30 min", cost: "0.65%" },
  { from: "AUD", to: "GBP", speed: "Seconds", cost: "0.35%" },
];

function TransfersPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Cross-border transfers"
        title="The real rate. The real speed. Every time."
        subtitle="Bright Future's FX engine settles across 40+ currencies at the mid-market rate. No hidden spread, no correspondent-bank surprises."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              { icon: Zap, title: "Instant settlement", body: "Most transfers between supported currencies settle in seconds via direct rails." },
              { icon: RouteIcon, title: "Live tracking", body: "See every hop — from initiation to recipient — in your activity feed." },
              { icon: ShieldCheck, title: "Regulated corridors", body: "All corridors operated under our EMI licences and correspondent partnerships." },
            ].map((f) => (
              <div key={f.title} className="bg-background p-6">
                <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 text-base font-semibold tracking-institutional">{f.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border border-border">
            <div className="border-b border-border px-6 py-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Popular corridors
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-normal">From</th>
                  <th className="px-6 py-3 text-left font-normal">To</th>
                  <th className="px-6 py-3 text-left font-normal">Speed</th>
                  <th className="px-6 py-3 text-right font-normal">Fee</th>
                </tr>
              </thead>
              <tbody>
                {corridors.map((c) => (
                  <tr key={c.from + c.to} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{c.from}</td>
                    <td className="px-6 py-4 font-medium">{c.to}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.speed}</td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{c.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <SendMoneyCalculator />
          <p className="mt-4 text-xs text-muted-foreground">
            Rates shown are illustrative and update every 60 seconds inside the app.
          </p>
        </div>
      </section>

      <ClosingCta />
    </MarketingLayout>
  );
}
