import type { ReactNode } from "react";
import { MarketingLayout } from "./MarketingLayout";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export function LegalDocument({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <MarketingLayout>
      <div className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-secondary-foreground/60">
            Last updated · {updated}
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="prose-legal text-[15px] leading-relaxed text-foreground">
          <p className="text-muted-foreground">{intro}</p>

          <nav className="mt-10 border border-border bg-muted/40 p-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              On this page
            </p>
            <ol className="mt-3 space-y-1.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s-${i + 1}`} className="text-foreground hover:text-primary">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-10">
            {sections.map((s, i) => (
              <section key={s.title} id={`s-${i + 1}`}>
                <h2 className="text-xl font-semibold tracking-institutional">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
            Questions? Email{" "}
            <span className="text-foreground">legal@brightfuture.bank</span>.
          </p>
        </div>
      </article>
    </MarketingLayout>
  );
}
