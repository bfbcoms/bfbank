import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HomepageSection = {
  id: string;
  slug: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
};

const FALLBACK_TIMESTAMP = "2026-07-01T00:00:00.000Z";

const makeFallbackSection = (
  slug: string,
  sort_order: number,
  section: Partial<HomepageSection>,
): HomepageSection => ({
  id: `fallback-${slug}`,
  slug,
  eyebrow: null,
  title: null,
  subtitle: null,
  body: null,
  cta_label: null,
  cta_href: null,
  image_url: null,
  content: {},
  sort_order,
  is_visible: true,
  updated_at: FALLBACK_TIMESTAMP,
  ...section,
});

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  makeFallbackSection("hero", 10, {
    eyebrow: "Cross-border neobank · Est. 2026",
    title: "Banking, perfected for a world without borders.",
    subtitle:
      "Hold, send and spend in 40+ currencies at the real exchange rate. No hidden markups. No monthly fees. Just a modern account built for people and businesses that move.",
    cta_label: "Open an account",
    cta_href: "/signup",
    content: {
      secondary_cta_label: "Explore transfers",
      secondary_cta_href: "/transfers",
      stats: [
        { value: "40+", label: "Currencies" },
        { value: "150+", label: "Countries" },
        { value: "0.35%", label: "Transfer fee" },
      ],
    },
  }),
  makeFallbackSection("trust_bar", 20, {
    content: {
      items: [
        { label: "FCA-registered EMI", icon: "ShieldCheck" },
        { label: "AES-256 encryption", icon: "Lock" },
        { label: "Safeguarded funds", icon: "Landmark" },
        { label: "SOC 2 Type II", icon: "ShieldCheck" },
      ],
    },
  }),
  makeFallbackSection("feature_grid", 30, {
    eyebrow: "What you get",
    title: "One account. Every currency. Anywhere.",
    content: {
      features: [
        {
          icon: "Wallet",
          title: "Virtual accounts",
          body: "Local GBP, USD, EUR and AED account details in your name. Get paid like a local — anywhere you work.",
        },
        {
          icon: "CreditCard",
          title: "Global cards",
          body: "Physical and virtual cards on Visa and Mastercard rails. Freeze, unfreeze and spend in over 150 countries with Apple Pay & Google Pay.",
        },
        {
          icon: "Globe2",
          title: "Cross-border transfers",
          body: "Send money at the mid-market rate to 40+ currencies. Most transfers arrive in seconds; every transfer is tracked in real time.",
        },
      ],
    },
  }),
  makeFallbackSection("virtual_accounts", 40, {
    eyebrow: "Virtual accounts",
    title: "A local account in every currency you earn.",
    subtitle:
      "Get paid like a local in GBP, USD, EUR and AED. Real account numbers in your name — no intermediaries, no lifting fees, no waiting three business days for cleared funds.",
    cta_label: "Open a multi-currency account",
    cta_href: "/signup",
    content: {
      bullets: [
        { title: "Real IBANs and sort codes", body: "UK sort code, US routing and account, Eurozone IBAN and AED account details — issued in your own name." },
        { title: "Zero receiving fees", body: "Accept salary, invoices and marketplace payouts in the local rail. We never take a cut on incoming payments." },
        { title: "Instant currency swap", body: "Convert between any held balance at the mid-market rate in a single tap. No spread, no surprise." },
      ],
    },
  }),
  makeFallbackSection("global_cards", 50, {
    eyebrow: "Global cards",
    title: "One card. 150 countries. Zero drama.",
    subtitle:
      "Physical metal, contactless virtual, and disposable single-use cards — all on Visa and Mastercard rails. Freeze, unfreeze and control every merchant category from your phone.",
    cta_label: "Order your card",
    cta_href: "/cards",
    content: {
      bullets: [
        { title: "Apple Pay and Google Pay day one", body: "Provision your card to Wallet the moment it is issued — start spending before the physical arrives." },
        { title: "Merchant-level controls", body: "Block gambling, ATM withdrawals or online payments in one tap. Set per-day, per-transaction and per-category limits." },
        { title: "Real-time spend intelligence", body: "Every tap is receipted in-app in under a second, with the merchant, category and FX rate you paid." },
      ],
    },
  }),
  makeFallbackSection("cross_border", 60, {
    eyebrow: "Cross-border transfers",
    title: "Send money the way the internet moves data.",
    subtitle:
      "Real mid-market rate on every transfer. Most corridors settle in under sixty seconds. Every payment is tracked end-to-end, with a receipt the moment it lands.",
    cta_label: "See supported corridors",
    cta_href: "/transfers",
    content: {
      bullets: [
        { title: "40+ currencies, 150+ countries", body: "Payout via local rails in each corridor — SEPA Instant, Faster Payments, ACH, IMPS, PIX and more." },
        { title: "Live tracking, not silence", body: "See the status of every leg of the transfer, with a firm ETA and a receipt the moment funds land." },
        { title: "Transparent per-transfer fee", body: "A single, published percentage. No margin baked into the exchange rate. Ever." },
      ],
    },
  }),
  makeFallbackSection("split_cta", 70, {
    content: {
      panels: [
        {
          eyebrow: "For individuals",
          title: "Built for your life abroad.",
          body: "Whether you are moving overseas, sending money home or travelling for months, Bright Future keeps every currency in one place.",
          cta: "Explore Personal",
          to: "/personal",
        },
        {
          eyebrow: "For business",
          title: "Global payments, without the friction.",
          body: "Multi-currency accounts, batch payouts, contractor payments and expense cards — all under one operating account.",
          cta: "Explore Business",
          to: "/business",
        },
      ],
    },
  }),
  makeFallbackSection("closing", 80, {
    eyebrow: "Ready when you are",
    title: "Open your account in under 5 minutes.",
    subtitle: "Fully digital onboarding. Biometric login from day one. Cancel any time.",
    cta_label: "Get started",
    cta_href: "/signup",
  }),
];

export const HOMEPAGE_SECTION_SLUGS = [
  "hero",
  "trust_bar",
  "feature_grid",
  "virtual_accounts",
  "global_cards",
  "cross_border",
  "split_cta",
  "closing",
] as const;

async function fetchHomepageSections(): Promise<HomepageSection[]> {
  try {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as HomepageSection[];
  } catch (error) {
    console.error("[BFB] Homepage content read failed; rendering the static public fallback.", error);
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

export function homepageSectionsQuery() {
  return queryOptions({
    queryKey: ["homepage_sections"],
    queryFn: fetchHomepageSections,
    staleTime: 60_000,
  });
}

export function indexBySlug(rows: HomepageSection[]): Record<string, HomepageSection> {
  return Object.fromEntries(rows.map((r) => [r.slug, r]));
}
