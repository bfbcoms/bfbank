import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, KeyRound, Lock, ShieldCheck, ServerCog, Eye } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & compliance — Bright Future Bank" },
      {
        name: "description",
        content:
          "How Bright Future protects your money and data: 2FA, biometric login, AES-256 encryption, SCA, safeguarded funds and independent audits.",
      },
    ],
  }),
  component: SecurityPage,
});

const controls = [
  { icon: Fingerprint, title: "Biometric login", body: "Face ID and Touch ID authenticate every session on trusted devices." },
  { icon: KeyRound, title: "Two-factor authentication", body: "One-time codes over authenticator apps, hardware keys and secure push." },
  { icon: Lock, title: "AES-256 encryption", body: "Data encrypted at rest and TLS 1.3 in transit — end-to-end, no exceptions." },
  { icon: ShieldCheck, title: "SCA on every payment", body: "Strong Customer Authentication for every transfer, no matter the value." },
  { icon: ServerCog, title: "Isolated infrastructure", body: "Multi-region resilience, hardened Kubernetes, secrets-manager-only credentials." },
  { icon: Eye, title: "24/7 fraud monitoring", body: "ML-based anomaly detection, human analysts and instant in-app alerts." },
];

function SecurityPage() {
  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Security & compliance"
        title="Institutional-grade security. Consumer-grade simplicity."
        subtitle="Every part of Bright Future is engineered around one principle: your money and your data are yours alone. Here is how we keep them that way."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {controls.map((c) => (
            <div key={c.title} className="bg-background p-8">
              <c.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold tracking-institutional">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Regulatory status</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-institutional md:text-4xl">
              Regulated where we operate.
            </h2>
            <p className="mt-4 text-secondary-foreground/70">
              Bright Future is an electronic money institution operating under
              regulatory permissions in the United Kingdom, the European Union, the
              United Arab Emirates and Singapore. Customer funds are safeguarded with
              tier-1 credit institutions in each jurisdiction.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            {[
              "United Kingdom — Financial Conduct Authority (EMI, reference on request)",
              "European Union — De Nederlandsche Bank (EMI passported into the EEA)",
              "United Arab Emirates — Central Bank of the UAE (registered agent)",
              "Singapore — Monetary Authority of Singapore (major payment institution)",
              "SOC 2 Type II report available under NDA",
              "PCI-DSS v4.0 compliant for card issuing and processing",
            ].map((r) => (
              <li key={r} className="flex items-start gap-3 border-b border-white/10 pb-4">
                <span className="mt-1 inline-block h-2 w-2 shrink-0 bg-primary" aria-hidden />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Responsible disclosure</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-institutional md:text-4xl">
          Found something? Tell our team first.
        </h2>
        <p className="mt-4 text-muted-foreground">
          We operate a coordinated disclosure programme. Security researchers can
          report vulnerabilities to <span className="text-foreground">security@brightfuture.bank</span>.
          We acknowledge every report within 24 hours and publish public bounties for
          in-scope findings.
        </p>
      </section>
    </MarketingLayout>
  );
}
