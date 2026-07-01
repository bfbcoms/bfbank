import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Globe2,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Landmark,
  Lock,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SendMoneyCalculator } from "@/components/marketing/SendMoneyCalculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bright Future Bank — Cross-border banking, perfected" },
      {
        name: "description",
        content:
          "Multi-currency accounts, real exchange-rate transfers and institutional-grade security. Open a Bright Future account in minutes.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-24 md:pt-28 md:pb-32 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              Cross-border neobank · Est. 2026
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-institutional md:text-7xl">
              Banking, perfected for a world without borders.
            </h1>
            <p className="mt-6 max-w-xl text-base text-secondary-foreground/75 md:text-lg">
              Hold, send and spend in 40+ currencies at the real exchange rate. No
              hidden markups. No monthly fees. Just a modern account built for people
              and businesses that move.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center bg-primary px-8 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
              >
                Open an account
              </Link>
              <Link
                to="/transfers"
                className="inline-flex h-12 items-center border border-white/25 px-8 text-sm font-medium tracking-institutional uppercase text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Explore transfers
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 text-xs text-secondary-foreground/60">
              <Stat value="40+" label="Currencies" />
              <Stat value="150+" label="Countries" />
              <Stat value="0.35%" label="Transfer fee" />
            </div>
          </div>

          <div className="lg:pl-8">
            <SendMoneyCalculator />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-8 text-xs uppercase tracking-[0.25em] text-muted-foreground md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "FCA-registered EMI" },
            { icon: Lock, label: "AES-256 encryption" },
            { icon: Landmark, label: "Safeguarded funds" },
            { icon: ShieldCheck, label: "SOC 2 Type II" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">What you get</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
            One account. Every currency. Anywhere.
          </h2>
        </div>

        <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          <Feature
            icon={Wallet}
            title="Virtual accounts"
            body="Local GBP, USD, EUR and AED account details in your name. Get paid like a local — anywhere you work."
          />
          <Feature
            icon={CreditCard}
            title="Global cards"
            body="Physical and virtual cards on Visa and Mastercard rails. Freeze, unfreeze and spend in over 150 countries with Apple Pay & Google Pay."
          />
          <Feature
            icon={Globe2}
            title="Cross-border transfers"
            body="Send money at the mid-market rate to 40+ currencies. Most transfers arrive in seconds; every transfer tracked in real time."
          />
        </div>
      </section>

      {/* Split CTA */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          <SplitCta
            eyebrow="For individuals"
            title="Built for your life abroad."
            body="Whether you're moving overseas, sending money home or travelling for months, Bright Future keeps every currency in one place."
            cta="Explore Personal"
            to="/personal"
          />
          <SplitCta
            eyebrow="For business"
            title="Global payments, without the friction."
            body="Multi-currency accounts, batch payouts, contractor payments and expense cards — all under one operating account."
            cta="Explore Business"
            to="/business"
          />
        </div>
      </section>

      {/* Closing */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Ready when you are</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
          Open your account in under 5 minutes.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Fully digital onboarding. Biometric login from day one. Cancel any time.
        </p>
        <Link
          to="/signup"
          className="mt-8 inline-flex h-12 items-center bg-primary px-10 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
        >
          Get started
          <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
        </Link>
      </section>
    </MarketingLayout>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-institutional text-secondary-foreground">
        {value}
      </p>
      <p className="mt-1 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Wallet;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-background p-10">
      <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
      <h3 className="mt-6 text-xl font-semibold tracking-institutional">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function SplitCta({
  eyebrow,
  title,
  body,
  cta,
  to,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
}) {
  return (
    <div className="bg-secondary p-10 md:p-14">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-institutional md:text-4xl">{title}</h3>
      <p className="mt-4 max-w-lg text-secondary-foreground/70">{body}</p>
      <Link
        to={to}
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-institutional uppercase text-primary hover:underline"
      >
        {cta} <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </div>
  );
}
