/**
 * Guarded Service-Worker registration for Bright Future Bank.
 *
 * Rules (per Lovable PWA skill):
 *  - Never register in dev, iframes, or Lovable preview hosts.
 *  - Respect a `?sw=off` kill-switch and unregister any matching worker.
 *  - Only ever manage /sw.js (never touch third-party workers like FCM).
 */

const APP_SW_PATH = "/sw.js";

function isPreviewOrDevHost(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return (
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev")
  );
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

  if (!isProd || inIframe || isPreviewOrDevHost() || killSwitch) {
    void unregisterAppWorker();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(APP_SW_PATH, { scope: "/" }).catch(() => {
      /* swallow — offline is best-effort */
    });
  });
}
