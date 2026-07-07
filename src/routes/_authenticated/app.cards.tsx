import { createFileRoute } from "@tanstack/react-router";
import { Snowflake, Settings2, Eye, ShieldCheck, Plus, Wifi } from "lucide-react";
import { BRAND_LOGO_URL } from "@/components/BrandLogo";

export const Route = createFileRoute("/_authenticated/app/cards")({
  component: CardsPage,
});

const cards = [
  {
    kind: "Metal · Debit",
    tag: "Physical",
    last4: "4820",
    holder: "A. OSEI",
    expiry: "09/28",
    variant: "dark" as const,
  },
  {
    kind: "Virtual",
    tag: "Single-use",
    last4: "1173",
    holder: "A. OSEI",
    expiry: "09/28",
    variant: "light" as const,
  },
];

const controls = [
  { label: "Freeze", icon: Snowflake },
  { label: "Details", icon: Eye },
  { label: "Limits", icon: Settings2 },
  { label: "Secure", icon: ShieldCheck },
];

function CardsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Cards</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-institutional md:text-3xl">
            Your cards
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 border border-primary px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New card
        </button>
      </header>

      {/* Card carousel */}
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0">
        {cards.map((c) => (
          <article
            key={c.last4}
            className={`relative aspect-[1.6/1] w-[85%] shrink-0 snap-center overflow-hidden p-6 md:w-auto ${
              c.variant === "dark"
                ? "bg-secondary text-secondary-foreground"
                : "border border-border bg-card text-foreground"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] uppercase tracking-[0.3em] ${
                    c.variant === "dark" ? "text-primary" : "text-primary"
                  }`}
                >
                  {c.kind}
                </span>
                <p
                  className={`mt-1 text-[10px] uppercase tracking-[0.25em] ${
                    c.variant === "dark" ? "text-secondary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {c.tag}
                </p>
              </div>
              <img src={BRAND_LOGO_URL} alt="" className="h-8 w-8 object-contain" />
            </div>

            <Wifi
              className={`absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 rotate-90 ${
                c.variant === "dark" ? "text-primary/70" : "text-muted-foreground"
              }`}
              strokeWidth={1.5}
            />

            <p className="mt-14 text-lg tracking-[0.35em]">•••• •••• •••• {c.last4}</p>

            <div
              className={`mt-4 flex items-end justify-between text-[10px] uppercase tracking-[0.25em] ${
                c.variant === "dark" ? "text-secondary-foreground/60" : "text-muted-foreground"
              }`}
            >
              <span>{c.holder}</span>
              <span>EXP {c.expiry}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Controls */}
      <section>
        <h2 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Controls
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {controls.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.label}
                type="button"
                className="flex flex-col items-center gap-2 border border-border bg-card py-4 transition-colors hover:border-primary"
              >
                <span className="grid h-9 w-9 place-items-center border border-primary/40 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em]">{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Spending summary */}
      <section className="border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            This month
          </p>
          <p className="text-[11px] text-muted-foreground">Limit £5,000</p>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-institutional">£1,284.30</p>
        <div className="mt-3 h-1 w-full bg-muted">
          <div className="h-full bg-primary" style={{ width: "25%" }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          25% of monthly card limit used
        </p>
      </section>
    </div>
  );
}
