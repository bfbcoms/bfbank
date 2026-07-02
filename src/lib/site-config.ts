/**
 * Canonical public site configuration.
 *
 * `VITE_PUBLIC_SITE_URL` should be set in each environment to the public
 * origin the browser uses (no trailing slash). At runtime in the browser we
 * fall back to `window.location.origin` so previews and custom domains render
 * correct canonical/OG URLs without redeploying.
 */

const FALLBACK_SITE_URL = "https://www.brightfuturebank.com";

function readEnvSiteUrl(): string | undefined {
  const value = import.meta.env.VITE_PUBLIC_SITE_URL;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getSiteUrl(): string {
  const envUrl = readEnvSiteUrl();
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return FALLBACK_SITE_URL;
}

export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "support@brightfuturebank.com";
