import { createFileRoute } from "@tanstack/react-router";
import { Snowflake, Smartphone, Globe, Shield } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { ClosingCta } from "./personal";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/cards")({
  head: () =>
    makeRouteMeta({
      title: "Virtual & physical cards — Bright Future Bank",
      description: "Freeze in one tap. Spend in over 150 countries. Bright Future virtual and physical cards ship with Apple Pay, Google Pay and instant merchant controls.",
      path: "/cards",
    }),
  component: CardsPage,
});

function CardsPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Cards"
        title="A card built for the way you actually spend."
        subtitle="Contactless in seconds. Frozen just as fast. Bright Future cards give you global acceptance, tokenised security and full control from your phone."
      />

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-2 md:py-28 md:items-center">
        <div className="relative order-2 md:order-1">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {[
              { icon: Snowflake, title: "Freeze & unfreeze", body: "Lost your card at the airport? Freeze it in one tap. Unfreeze the moment you find it." },
              { icon: Smartphone, title: "Apple Pay & Google Pay", body: "Add your card to your wallet the second it's issued — physical or virtual." },
              { icon: Globe, title: "Global acceptance", body: "Spend anywhere Visa or Mastercard is accepted — over 150 countries and 60 million merchants." },
              { icon: Shield, title: "Tokenised by default", body: "Merchants never see your real card number. Fraud protection built in from day one." },
            ].map((f) => (
              <div key={f.title} className="bg-background p-8">
                <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 text-base font-semibold tracking-institutional">{f.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 md:order-2">
          <CardShowcase />
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-3">
          {[
            { title: "Metal", body: "Reserved for Bright Future Plus. Solid steel core, engraved detail." },
            { title: "Classic", body: "Contactless Visa debit, shipped free to over 30 countries." },
            { title: "Virtual", body: "Issue instantly for online spend. Burn and re-create in one tap." },
          ].map((c) => (
            <div key={c.title} className="border border-border bg-background p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">{c.title}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-institutional">
                Bright Future · {c.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ClosingCta />
    </MarketingLayout>
  );
}

function CardShowcase() {
  return (
    <div className="relative mx-auto aspect-[1.586/1] w-full max-w-md bg-secondary text-secondary-foreground shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,177,73,0.25),transparent_60%)]" />
      <div className="relative flex h-full flex-col justify-between p-8">
        <div className="flex items-start justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">Bright Future</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
            Debit · Visa
          </span>
        </div>
        <div>
          <p className="font-mono text-lg tracking-[0.3em] text-secondary-foreground/90">
            4917 •••• •••• 2418
          </p>
          <div className="mt-6 flex items-end justify-between text-xs">
            <div>
              <p className="uppercase tracking-[0.25em] text-secondary-foreground/50">
                Cardholder
              </p>
              <p className="mt-1 tracking-institutional">A. MORGAN</p>
            </div>
            <div className="text-right">
              <p className="uppercase tracking-[0.25em] text-secondary-foreground/50">Expires</p>
              <p className="mt-1 tracking-institutional">09 / 30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
