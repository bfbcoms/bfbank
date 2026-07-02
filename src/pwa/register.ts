/**
 * Guarded service-worker registration.
 *
 * The service worker must never be installed in development, inside preview
 * iframes, or on ephemeral preview hostnames — a stale cache in any of those
 * environments would freeze contributors on outdated builds. In production the
 * worker is registered at `/sw.js` under the root scope. The `?sw=off` query
 * parameter forces an unregister at runtime as a kill switch.
 */

const APP_SW_PATH = "/sw.js";

const EPHEMERAL_HOST_SUFFIXES = [
  ".lovableproject.com",
  ".lovableproject-dev.com",
  ".beta.lovable.dev",
];

const EPHEMERAL_HOSTS = new Set([
  "lovableproject.com",
  "lovableproject-dev.com",
  "beta.lovable.dev",
]);

function isEphemeralPreviewHost(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (EPHEMERAL_HOSTS.has(host)) return true;
  return EPHEMERAL_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

async function unregisterAppWorker(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs
        .filter((r) => {
          const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
          return url.endsWith(APP_SW_PATH);
        })
        .map((r) => r.unregister()),
    );
  } catch {
    /* noop */
  }
}

export function registerAppServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const inIframe = window.self !== window.top;
  const killSwitch = new URLSearchParams(window.location.search).get("sw") === "off";
  const isProd = import.meta.env.PROD;

  if (!isProd || inIframe || isEphemeralPreviewHost() || killSwitch) {
    void unregisterAppWorker();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(APP_SW_PATH, { scope: "/" }).catch(() => {
      /* swallow — offline is best-effort */
    });
  });
}
