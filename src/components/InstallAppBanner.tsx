import { useEffect, useState } from "react";
import { X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "bfb.install.dismissed";

export function InstallAppBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
      return;
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const ua = window.navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS/i.test(ua);
    if (isIos) setShowIos(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (dismissed) return null;
  if (!prompt && !showIos) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    dismiss();
  };

  return (
    <div
      className="fixed inset-x-0 z-30 mx-4 border border-white/10 bg-secondary text-secondary-foreground shadow-2xl"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 5rem)" }}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <BrandLogo className="h-9 w-9 shrink-0 object-contain" alt="" />

        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Install</p>
          <p className="mt-0.5 text-xs text-secondary-foreground/80">
            {prompt
              ? "Add Bright Future Bank to your home screen for faster access."
              : "Tap the share icon, then \u201cAdd to Home Screen\u201d."}
          </p>
          {prompt && (
            <button
              type="button"
              onClick={install}
              className="mt-2 inline-flex h-9 items-center bg-primary px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground"
            >
              Install
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-secondary-foreground/60 hover:text-secondary-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
