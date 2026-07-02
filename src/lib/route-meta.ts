// Central SEO metadata helper. Every marketing/legal leaf route uses this
// so canonical/og:url stay in lockstep with the route file location.

import { getSiteUrl } from "@/lib/site-config";

type MakeMetaArgs = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
};

export function makeRouteMeta({
  title,
  description,
  path,
  ogImage,
  ogType = "website",
  noindex = false,
}: MakeMetaArgs) {
  const url = `${getSiteUrl()}${path}`;
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: ogType },
    { name: "twitter:card", content: "summary_large_image" as const },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (ogImage) {
    meta.push({ property: "og:image", content: ogImage });
    meta.push({ name: "twitter:image", content: ogImage });
  }
  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }
  return {
    meta,
    links: [{ rel: "canonical" as const, href: url }],
  };
}
