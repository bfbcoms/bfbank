import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { MarketingLayout, PageHero } from "@/components/marketing/MarketingLayout";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help centre — Bright Future Bank" },
      {
        name: "description",
        content:
          "Answers to common questions about opening an account, sending money, cards, security and business banking with Bright Future.",
      },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    category: "Getting started",
    q: "How long does it take to open an account?",
    a: "Most personal accounts are opened in under 5 minutes. Business accounts typically take 1–3 business days depending on the complexity of your ownership structure.",
  },
  {
    category: "Getting started",
    q: "What documents do I need to open an account?",
    a: "For personal accounts, we accept a government-issued photo ID (passport, national ID or driving licence) and a short selfie to complete verification. For business, we additionally need your certificate of incorporation and details of ultimate beneficial owners.",
  },
  {
    category: "Transfers",
    q: "What exchange rate do I get?",
    a: "You always receive the mid-market exchange rate — the same one you see on Reuters or Bloomberg — plus a transparent transfer fee shown before you confirm.",
  },
  {
    category: "Transfers",
    q: "How long do international transfers take?",
    a: "Most transfers between major currencies settle in under 30 seconds. Emerging-market corridors typically settle within 30 minutes. You can track every transfer inside the app.",
  },
  {
    category: "Cards",
    q: "Can I use my card with Apple Pay and Google Pay?",
    a: "Yes. Every Bright Future card — physical or virtual — can be added to Apple Pay, Google Pay, Samsung Pay and Garmin Pay the moment it is issued.",
  },
  {
    category: "Cards",
    q: "How do I freeze a lost or stolen card?",
    a: "Open the Bright Future app, tap the card, and tap Freeze. Your card is disabled instantly across every wallet and merchant token. You can order a replacement in the same screen.",
  },
  {
    category: "Security",
    q: "Are my funds safeguarded?",
    a: "Yes. Customer funds are held in segregated accounts at tier-1 credit institutions in each jurisdiction we operate, in line with the requirements of our EMI licences.",
  },
  {
    category: "Security",
    q: "What do I do if I notice a payment I don't recognise?",
    a: "Freeze your card in the app immediately, then report the transaction from within the transaction detail screen. Our fraud team will investigate and, where liability rests with us, provisionally refund you within 24 hours.",
  },
];

function HelpPage() {
  const [query, setQuery] = useState("");
  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});

  return (
    <MarketingLayout>
      <PageHero
        eyebrow="Help centre"
        title="Answers, without the hold music."
        subtitle="Search common questions, or reach a human 24/7 from inside the Bright Future app. Most questions are answered in under 3 minutes."
      />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-3 border border-border bg-background px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try 'transfer', 'card', or 'security'"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="mt-12 space-y-12">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">{cat}</p>
              <ul className="mt-4 border-t border-border">
                {items.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </ul>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No results. Try a different search term, or reach us at{" "}
              <span className="text-foreground">support@brightfuture.bank</span>.
            </p>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary"
      >
        <span className="text-base font-medium">{q}</span>
        {open ? (
          <Minus className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
        ) : (
          <Plus className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        )}
      </button>
      {open && <p className="pb-6 pr-10 text-sm text-muted-foreground">{a}</p>}
    </li>
  );
}
