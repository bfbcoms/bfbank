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
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as HomepageSection[];
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
