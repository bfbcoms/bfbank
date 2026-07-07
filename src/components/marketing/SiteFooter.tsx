import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/personal", label: "Personal accounts" },
      { to: "/business", label: "Business accounts" },
      { to: "/transfers", label: "Cross-border transfers" },
      { to: "/cards", label: "Virtual & physical cards" },
      { to: "/pricing", label: "Pricing & FX" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Bright Future" },
      { to: "/security", label: "Security" },
      { to: "/help", label: "Help centre" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/legal/terms", label: "Terms of service" },
      { to: "/legal/privacy", label: "Privacy notice" },
      { to: "/legal/cookies", label: "Cookies" },
      { to: "/legal/cardholder-agreement", label: "Cardholder agreement" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help", label: "Contact support" },
      { to: "/security", label: "Report a security issue" },
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Open an account" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-9 w-9 object-contain" alt="" />

              <span className="text-sm font-medium tracking-institutional uppercase">
                Bright Future Bank
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm text-secondary-foreground/70">
              Multi-currency accounts, real-rate transfers and institutional-grade
              controls — engineered for people and businesses that move across borders.
            </p>
            <div className="mt-8 space-y-2 text-xs uppercase tracking-[0.2em] text-secondary-foreground/50">
              <p>London · Singapore · New York</p>
              <p>support@brightfuture.bank</p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">{col.title}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-secondary-foreground/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-6 border-t border-white/10 pt-8 text-xs text-secondary-foreground/50">
          <p className="max-w-4xl leading-relaxed">
            Bright Future Bank is a trading name of Bright Future Financial Ltd, an
            electronic money institution. Banking services are provided in partnership
            with licensed credit institutions in each jurisdiction we operate. Card
            issuing is provided by our authorised card programme partners. Eligible
            customer funds are safeguarded in accordance with applicable local
            regulations. Investment and lending products are not offered; deposits are
            not covered by government deposit-insurance schemes unless expressly stated
            for a specific product. Please read the terms of service, privacy notice
            and cardholder agreement before opening an account.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Bright Future Financial Ltd. All rights reserved.</p>
            <ul className="flex items-center gap-5">
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com" },
                { label: "X", href: "https://x.com" },
                { label: "Instagram", href: "https://www.instagram.com" },
                { label: "YouTube", href: "https://www.youtube.com" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-foreground/60 transition-colors hover:text-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
