import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & FX — Bright Future Bank" },
      {
        name: "description",
        content:
          "Transparent pricing across Standard, Plus and Business plans. Real-rate FX, no hidden spread, no surprise monthly fees.",
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Standard",
    price: "£0",
    cadence: "per month",
    body: "Everything you need to hold, spend and send across borders.",
    features: [
      "Multi-currency account (GBP, USD, EUR, AED)",
      "Contactless Visa debit card",
      "Up to £2,000/mo card spend at mid-market rate",
      "0.35% transfer fee on cross-border payments",
      "Freeze / unfreeze, 2FA, biometric login",
    ],
    cta: "Open Standard",
    highlighted: false,
  },
  {
    name: "Plus",
    price: "£9.99",
    cadence: "per month",
    body: "For frequent travellers and higher spenders.",
    features: [
      "Metal card with engraved detail",
      "Unlimited fee-free FX on card spend",
      "0.20% transfer fee across all corridors",
      "Global travel & phone insurance",
      "Priority in-app support",
    ],
    cta: "Try Plus",
    highlighted: true,
  },
  {
    name: "Business",
    price: "From £25",
    cadence: "per month",
    body: "The operating account for global teams.",
    features: [
      "Multi-currency business account",
      "Unlimited team expense cards",
      "Bulk contractor payouts in 90+ countries",
      "Xero, QuickBooks and NetSuite integrations",
      "Approval workflows and SSO",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const comparison = [
  { row: "Real mid-market exchange rate", bfb: true, high: false, bank: false },
  { row: "Hidden FX spread", bfb: false, high: true, bank: true },
  { row: "Monthly account fee (baseline)", bfb: false, high: false, bank: true },
  { row: "Instant transfers on major corridors", bfb: true, high: true, bank: false },
  { row: "Freeze / unfreeze in-app", bfb: true, high: true, bank: false },
  { row: "Apple Pay & Google Pay day-one", bfb: true, high: true, bank: true },
  { row: "Transparent per-transfer fee", bfb: true, high: false, bank: false },
];

function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing & FX"
        title="Prices you can read in a single glance."
        subtitle="Standard is free forever. Plus and Business unlock higher spend limits, tighter FX and premium features. No hidden spreads. No surprise fees."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-10 ${p.highlighted ? "bg-secondary text-secondary-foreground" : "bg-background"}`}
            >
              <p
                className={`text-xs uppercase tracking-[0.3em] ${p.highlighted ? "text-primary" : "text-primary"}`}
              >
                {p.name}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-institutional">{p.price}</span>
                <span
                  className={`text-xs uppercase tracking-[0.2em] ${p.highlighted ? "text-secondary-foreground/60" : "text-muted-foreground"}`}
                >
                  {p.cadence}
                </span>
              </div>
              <p
                className={`mt-4 text-sm ${p.highlighted ? "text-secondary-foreground/70" : "text-muted-foreground"}`}
              >
                {p.body}
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`mt-10 inline-flex h-11 w-full items-center justify-center text-sm font-medium tracking-institutional uppercase ${
                  p.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-foreground text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              Bright Future vs. traditional banks
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-institutional md:text-4xl">
              What you actually pay for at a legacy bank.
            </h2>
          </div>

          <div className="mt-10 overflow-hidden border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-normal uppercase tracking-[0.2em]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Bright Future
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em]">
                    High-street bank
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em]">
                    Legacy multi-ccy bank
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.row} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{row.row}</td>
                    <Cell yes={row.bfb} />
                    <Cell yes={row.bank} />
                    <Cell yes={row.high} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Comparison is illustrative and based on publicly published fee schedules
            as of the current tax year. Individual bank fees may vary by region and
            account type.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}

function Cell({ yes }: { yes: boolean }) {
  return (
    <td className="px-6 py-4 text-center">
      {yes ? (
        <Check className="mx-auto h-4 w-4 text-primary" strokeWidth={1.75} />
      ) : (
        <Minus className="mx-auto h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      )}
    </td>
  );
}
