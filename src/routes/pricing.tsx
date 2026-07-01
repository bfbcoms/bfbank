import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/pricing")({
  head: () =>
    makeRouteMeta({
      title: "Pricing & FX — Bright Future Bank",
      description:
        "Transparent pricing across Standard, Plus and Business plans. Real-rate FX, no hidden spread, no surprise monthly fees.",
      path: "/pricing",
    }),
  component: PricingPage,
});

type PlanKey = "standard" | "plus" | "business";
type Cadence = "monthly" | "annual";

const plans: {
  key: PlanKey;
  name: string;
  monthly: number;
  annual: number;
  cadence: string;
  body: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  priceLabel?: string;
}[] = [
  {
    key: "standard",
    name: "Standard",
    monthly: 0,
    annual: 0,
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
    key: "plus",
    name: "Plus",
    monthly: 9.99,
    annual: 7.99,
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
    key: "business",
    name: "Business",
    monthly: 25,
    annual: 20,
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
    priceLabel: "From",
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

// Illustrative bank fee models (per single international transfer)
const BFB_FEE_RATE = 0.0035;
const HIGHSTREET_FIXED = 25;
const HIGHSTREET_SPREAD = 0.035; // 3.5% baked into FX
const LEGACY_FIXED = 15;
const LEGACY_SPREAD = 0.015;

function PricingPage() {
  const [cadence, setCadence] = useState<Cadence>("monthly");
  const [amount, setAmount] = useState(1000);

  const savings = useMemo(() => {
    const bfb = amount * BFB_FEE_RATE;
    const highstreet = HIGHSTREET_FIXED + amount * HIGHSTREET_SPREAD;
    const legacy = LEGACY_FIXED + amount * LEGACY_SPREAD;
    return {
      bfb, highstreet, legacy,
      vsHigh: highstreet - bfb,
      vsLegacy: legacy - bfb,
    };
  }, [amount]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(v);

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Pricing & FX"
        title="Prices you can read in a single glance."
        subtitle="Standard is free forever. Plus and Business unlock higher spend limits, tighter FX and premium features. No hidden spreads. No surprise fees."
      />

      {/* Monthly / Annual toggle */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div
          role="tablist"
          aria-label="Billing cadence"
          className="mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-muted/40 p-1"
        >
          {(["monthly", "annual"] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cadence === c}
              type="button"
              onClick={() => setCadence(c)}
              className={`relative inline-flex h-9 items-center rounded-full px-5 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                cadence === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cadence === c && (
                <motion.span
                  layoutId="cadence-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{c === "monthly" ? "Monthly" : "Annual"}</span>
              {c === "annual" && (
                <span className="relative ml-2 text-[10px] font-normal tracking-normal">
                  · save 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {plans.map((p) => {
            const price = cadence === "monthly" ? p.monthly : p.annual;
            return (
              <div
                key={p.key}
                className={`p-10 ${p.highlighted ? "bg-secondary text-secondary-foreground" : "bg-background"}`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{p.name}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  {p.priceLabel && (
                    <span className={`text-xs uppercase tracking-[0.2em] ${p.highlighted ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                      {p.priceLabel}
                    </span>
                  )}
                  <motion.span
                    key={`${p.key}-${cadence}`}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-semibold tracking-institutional tabular-nums"
                  >
                    {price === 0 ? "£0" : `£${price.toFixed(2)}`}
                  </motion.span>
                  <span className={`text-xs uppercase tracking-[0.2em] ${p.highlighted ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                    {p.cadence}
                  </span>
                </div>
                <p className={`mt-4 text-sm ${p.highlighted ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                  {p.body}
                </p>
                <ul className="mt-8 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
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
            );
          })}
        </div>
      </section>

      {/* Interactive fee comparison */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              What you pay to send money abroad
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-institutional md:text-4xl">
              Slide to see what a single transfer really costs.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Illustrative comparison based on typical published high-street fees and FX
              spreads. Live rates vary by corridor.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-border bg-background p-6 md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <label htmlFor="transfer-amount" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Transfer amount
                </label>
                <div className="mt-2 text-4xl font-semibold tracking-institutional tabular-nums">
                  {fmt(amount)}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">You save vs. high-street</p>
                <motion.p
                  key={savings.vsHigh.toFixed(2)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 text-3xl font-semibold tracking-institutional text-primary tabular-nums"
                >
                  {fmt(Math.max(0, savings.vsHigh))}
                </motion.p>
              </div>
            </div>

            <input
              id="transfer-amount"
              type="range"
              min={100}
              max={20000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-valuemin={100}
              aria-valuemax={20000}
              aria-valuenow={amount}
              className="mt-6 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>£100</span>
              <span>£20,000</span>
            </div>

            <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
              <FeeCard label="Bright Future" cost={savings.bfb} highlighted />
              <FeeCard label="Legacy multi-currency bank" cost={savings.legacy} />
              <FeeCard label="High-street bank" cost={savings.highstreet} />
            </div>
          </div>

          {/* Static comparison table */}
          <div className="mt-16 overflow-hidden border border-border bg-background">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-normal uppercase tracking-[0.2em]">Feature</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-primary">Bright Future</th>
                  <th className="px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em]">High-street bank</th>
                  <th className="px-6 py-4 text-center text-xs font-normal uppercase tracking-[0.2em]">Legacy multi-ccy bank</th>
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
            as of the current tax year. Individual bank fees may vary by region and account type.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FeeCard({ label, cost, highlighted }: { label: string; cost: number; highlighted?: boolean }) {
  const fmt = (v: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(v);
  return (
    <div className={`p-6 ${highlighted ? "bg-secondary text-secondary-foreground" : "bg-background"}`}>
      <p className={`text-[11px] uppercase tracking-[0.2em] ${highlighted ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </p>
      <motion.p
        key={cost.toFixed(2)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 text-3xl font-semibold tracking-institutional tabular-nums"
      >
        {fmt(cost)}
      </motion.p>
      <p className={`mt-2 text-xs ${highlighted ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
        Total cost of one transfer
      </p>
    </div>
  );
}

function Cell({ yes }: { yes: boolean }) {
  return (
    <td className="px-6 py-4 text-center">
      {yes ? (
        <Check className="mx-auto h-4 w-4 text-primary" strokeWidth={1.75} aria-label="Included" />
      ) : (
        <Minus className="mx-auto h-4 w-4 text-muted-foreground" strokeWidth={1.5} aria-label="Not included" />
      )}
    </td>
  );
}
