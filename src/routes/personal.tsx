import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Home, Coffee, Smartphone, ArrowUpRight } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/personal")({
  head: () => ({
    meta: [
      { title: "Personal banking — Bright Future Bank" },
      {
        name: "description",
        content:
          "A modern personal account for travellers, expats and everyday spenders. Hold 40+ currencies, spend abroad at the real rate and get paid like a local.",
      },
    ],
  }),
  component: PersonalPage,
});

const useCases = [
  {
    icon: Plane,
    title: "Travel without the FX tax",
    body:
      "Spend in over 150 countries at the mid-market rate. No foreign transaction fees under £2,000 per month.",
  },
  {
    icon: Home,
    title: "Expat life, simplified",
    body:
      "Salary in one currency, rent in another, savings back home. Keep every balance in one account with local details.",
  },
  {
    icon: Coffee,
    title: "Everyday spending",
    body:
      "Instant notifications, spending insights, and category budgets — so you always know where your money is going.",
  },
  {
    icon: Smartphone,
    title: "Send money home",
    body:
      "Real-rate transfers to family and friends in 40+ currencies. Most arrive in seconds. Every step tracked in-app.",
  },
];

function PersonalPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Personal"
        title="A better account for a bigger life."
        subtitle="Bright Future Personal is built for people who work, spend and travel across borders — with the rate you deserve and the controls you expect."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {useCases.map((u) => (
            <div key={u.title} className="bg-background p-10">
              <u.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="mt-6 text-xl font-semibold tracking-institutional">{u.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              What's included
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-institutional">
              Everything you need in one account.
            </h2>
          </div>
          <ul className="space-y-4 text-sm">
            {[
              "Local GBP, USD, EUR and AED account details",
              "Contactless Visa debit card with Apple Pay & Google Pay",
              "Unlimited free virtual cards for online spend",
              "Instant transfers between Bright Future users",
              "Real-time spending notifications and merchant enrichment",
              "Biometric login, 2FA and freeze-card in one tap",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-border pb-4">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 bg-primary" aria-hidden />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </MarketingLayout>
  );
}

export function ClosingCta() {
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Ready when you are</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-institutional md:text-4xl">
            Open a Bright Future account in minutes.
          </h2>
        </div>
        <Link
          to="/signup"
          className="inline-flex h-12 shrink-0 items-center bg-primary px-8 text-sm font-medium tracking-institutional uppercase text-primary-foreground hover:bg-primary/90"
        >
          Get started
          <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
