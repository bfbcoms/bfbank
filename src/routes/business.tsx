import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users2, FileText, Coins } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";
import { ClosingCta } from "./personal";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/business")({
  head: () =>
    makeRouteMeta({
      title: "Business banking — Bright Future Bank",
      description: "Multi-currency business accounts, contractor payouts, expense cards and invoicing — built for founders, SMEs and international teams.",
      path: "/business",
    }),
  component: BusinessPage,
});

function BusinessPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Business"
        title="The operating account for global companies."
        subtitle="Open a multi-currency business account in days, not weeks. Pay contractors in 90+ countries, issue expense cards to your team, and reconcile everything in one dashboard."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Building2,
              title: "Multi-currency accounts",
              body: "Local receiving details in GBP, USD, EUR, CAD, AUD and AED under your company name.",
            },
            {
              icon: Users2,
              title: "Team expense cards",
              body: "Issue virtual and physical cards with per-card limits, category controls and instant freezing.",
            },
            {
              icon: FileText,
              title: "Invoicing & reconciliation",
              body: "Send invoices, take card payments and export clean data to Xero, QuickBooks and NetSuite.",
            },
            {
              icon: Coins,
              title: "Contractor payouts",
              body: "Pay contractors in 90+ countries at the real rate. Bulk uploads, scheduled runs and receipts.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <f.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 text-lg font-semibold tracking-institutional">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Controls</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-institutional">
              Approval workflows your finance team will actually use.
            </h2>
            <p className="mt-4 text-secondary-foreground/70">
              Role-based access, dual authorisation on high-value payments, and a full
              audit trail on every action — designed with CFOs, not for them.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            {[
              "Roles: Owner, Admin, Finance, Bookkeeper, Viewer",
              "Configurable approval thresholds by currency",
              "Dual authorisation on transfers above your policy limit",
              "Immutable audit log with per-user activity streams",
              "SSO via Google Workspace, Okta and Microsoft Entra",
              "SCA (Strong Customer Authentication) on every login",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 border-b border-white/10 pb-4">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </MarketingLayout>
  );
}
