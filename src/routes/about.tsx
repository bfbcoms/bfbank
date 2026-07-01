import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { ClosingCta } from "./personal";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/about")({
  head: () =>
    makeRouteMeta({
      title: "About — Bright Future Bank",
      description: "Bright Future Bank is building the operating account for the world's next billion cross-border earners, spenders and businesses.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="About"
        title="Money should move like the internet does."
        subtitle="Bright Future Bank was founded on a simple observation: banking hasn't caught up with the world it serves. We're rebuilding it — from the rails up — for people and businesses that live across borders."
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[1fr_1.4fr] md:py-28">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Our mission</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-institutional">
            A brighter standard for cross-border money.
          </h2>
        </div>
        <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
          <p>
            The world's next billion earners and businesses are already cross-border.
            Yet the banking system still treats currency, geography and identity as
            separate problems solved by separate providers, each taking their own cut.
          </p>
          <p>
            We think that's the wrong architecture. Bright Future runs one operating
            account, one identity and one settlement layer across dozens of currencies
            — so a designer in Lagos can invoice a client in London, a family in
            Dubai can send to Mumbai, and a founder in Singapore can pay a contractor
            in São Paulo, all without the FX tax, the correspondent lag or the
            paperwork.
          </p>
          <p>
            We're a team of former engineers and operators from Apple, Monzo, Wise
            and Revolut. We ship weekly, publish our reliability metrics, and hold
            ourselves to the same standards we hold our regulators to.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-4">
          {[
            { value: "2026", label: "Founded" },
            { value: "150+", label: "People" },
            { value: "40+", label: "Currencies" },
            { value: "£1B+", label: "Volume processed" },
          ].map((s) => (
            <div key={s.label} className="border border-border bg-background p-6">
              <p className="text-3xl font-semibold tracking-institutional">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ClosingCta />
    </MarketingLayout>
  );
}
