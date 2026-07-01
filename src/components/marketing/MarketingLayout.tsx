import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="border-b border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-institutional md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-secondary-foreground/70 md:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
