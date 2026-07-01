import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  Globe2,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Landmark,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SendMoneyCalculator } from "@/components/marketing/SendMoneyCalculator";
import { HomepageSection } from "@/components/marketing/HomepageSection";
import { homepageSectionsQuery, indexBySlug, type HomepageSection as Section } from "@/lib/homepage-content";
import { makeRouteMeta } from "@/lib/route-meta";
import homeVirtualAccounts from "@/assets/home-virtual-accounts.jpg.asset.json";
import homeGlobalCards from "@/assets/home-global-cards.jpg.asset.json";
import homeTransfers from "@/assets/home-transfers.jpg.asset.json";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck, Lock, Landmark, Wallet, CreditCard, Globe2,
};

const SECTION_IMAGES: Record<string, string> = {
  virtual_accounts: homeVirtualAccounts.url,
  global_cards: homeGlobalCards.url,
  cross_border: homeTransfers.url,
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homepageSectionsQuery()),
  head: () =>
    makeRouteMeta({
      title: "Bright Future Bank — Cross-border banking, perfected",
      description:
        "Multi-currency accounts, real exchange-rate transfers and institutional-grade security. Open a Bright Future account in minutes.",
      path: "/",
      ogImage: homeVirtualAccounts.url,
    }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(homepageSectionsQuery());
  const bySlug = indexBySlug(data);
  const visible = (slug: string) => bySlug[slug]?.is_visible !== false && bySlug[slug];
  const hero = visible("hero");
  const trust = visible("trust_bar");
  const featureGrid = visible("feature_grid");
  const virtualAccounts = visible("virtual_accounts");
  const globalCards = visible("global_cards");
  const crossBorder = visible("cross_border");
  const splitCta = visible("split_cta");
  const closing = visible("closing");

  return (
    <MarketingLayout>
      {hero && <Hero section={hero} />}
      {trust && <TrustBar section={trust} />}
      {featureGrid && <FeatureGrid section={featureGrid} />}

      {virtualAccounts && (
        <HomepageSection
          eyebrow={virtualAccounts.eyebrow}
          title={virtualAccounts.title}
          subtitle={virtualAccounts.subtitle}
          ctaLabel={virtualAccounts.cta_label}
          ctaHref={virtualAccounts.cta_href}
          imageUrl={virtualAccounts.image_url || SECTION_IMAGES.virtual_accounts}
          imageAlt="Stacked matte-black multi-currency BFB account cards"
          bullets={(virtualAccounts.content as { bullets?: { title: string; body: string }[] })?.bullets}
        />
      )}
      {globalCards && (
        <HomepageSection
          reverse
          dark
          eyebrow={globalCards.eyebrow}
          title={globalCards.title}
          subtitle={globalCards.subtitle}
          ctaLabel={globalCards.cta_label}
          ctaHref={globalCards.cta_href}
          imageUrl={globalCards.image_url || SECTION_IMAGES.global_cards}
          imageAlt="BFB metal card and mobile wallet with contactless payment"
          bullets={(globalCards.content as { bullets?: { title: string; body: string }[] })?.bullets}
        />
      )}
      {crossBorder && (
        <HomepageSection
          eyebrow={crossBorder.eyebrow}
          title={crossBorder.title}
          subtitle={crossBorder.subtitle}
          ctaLabel={crossBorder.cta_label}
          ctaHref={crossBorder.cta_href}
          imageUrl={crossBorder.image_url || SECTION_IMAGES.cross_border}
          imageAlt="Globe with gold cross-border payment corridors between major cities"
          bullets={(crossBorder.content as { bullets?: { title: string; body: string }[] })?.bullets}
        />
      )}

      {splitCta && <SplitCtaSection section={splitCta} />}
      {closing && <Closing section={closing} />}
    </MarketingLayout>
  );
}

function Hero({ section }: { section: Section }) {
  const c = section.content as {
    secondary_cta_label?: string;
    secondary_cta_href?: string;
    stats?: { value: string; label: string }[];
  };
  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-24 md:pt-28 md:pb-32 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          {section.eyebrow && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{section.eyebrow}</p>
          )}
          <h1 className="mt-6 text-5xl font-semibold tracking-institutional md:text-7xl">
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="mt-6 max-w-xl text-base text-secondary-foreground/75 md:text-lg">
              {section.subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            {section.cta_label && section.cta_href && (
              <Link
                to={section.cta_href}
                className="inline-flex h-12 items-center bg-primary px-8 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
              >
                {section.cta_label}
              </Link>
            )}
            {c.secondary_cta_label && c.secondary_cta_href && (
              <Link
                to={c.secondary_cta_href}
                className="inline-flex h-12 items-center border border-white/25 px-8 text-sm font-medium tracking-institutional uppercase text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {c.secondary_cta_label}
              </Link>
            )}
          </div>
          {c.stats && (
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 text-xs text-secondary-foreground/60">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold tracking-institutional text-secondary-foreground">
                    {s.value}
                  </p>
                  <p className="mt-1 uppercase tracking-[0.2em]">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:pl-8">
          <SendMoneyCalculator />
        </div>
      </div>
    </section>
  );
}

function TrustBar({ section }: { section: Section }) {
  const items = (section.content as { items?: { label: string; icon: string }[] })?.items ?? [];
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-8 text-xs uppercase tracking-[0.25em] text-muted-foreground md:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? ShieldCheck;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} aria-hidden />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeatureGrid({ section }: { section: Section }) {
  const features = (section.content as { features?: { icon: string; title: string; body: string }[] })?.features ?? [];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-3xl">
        {section.eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{section.eyebrow}</p>
        )}
        {section.title && (
          <h2 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
            {section.title}
          </h2>
        )}
      </div>
      <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
        {features.map((f) => {
          const Icon = ICONS[f.icon] ?? Wallet;
          return (
            <div key={f.title} className="bg-background p-10">
              <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-6 text-xl font-semibold tracking-institutional">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SplitCtaSection({ section }: { section: Section }) {
  const panels = (section.content as {
    panels?: { eyebrow: string; title: string; body: string; cta: string; to: string }[];
  })?.panels ?? [];
  return (
    <section className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-px border border-white/10 bg-white/10 md:grid-cols-2">
        {panels.map((p) => (
          <div key={p.eyebrow} className="bg-secondary p-10 md:p-14">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{p.eyebrow}</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-institutional md:text-4xl">{p.title}</h3>
            <p className="mt-4 max-w-lg text-secondary-foreground/70">{p.body}</p>
            <Link
              to={p.to}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-institutional uppercase text-primary hover:underline"
            >
              {p.cta} <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Closing({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
      {section.eyebrow && (
        <p className="text-xs uppercase tracking-[0.3em] text-primary">{section.eyebrow}</p>
      )}
      {section.title && (
        <h2 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
          {section.title}
        </h2>
      )}
      {section.subtitle && (
        <p className="mt-4 text-muted-foreground">{section.subtitle}</p>
      )}
      {section.cta_label && section.cta_href && (
        <Link
          to={section.cta_href}
          className="mt-8 inline-flex h-12 items-center bg-primary px-10 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
        >
          {section.cta_label}
          <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={1.5} aria-hidden />
        </Link>
      )}
    </section>
  );
}
