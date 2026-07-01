import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const OVERRIDE_KEY = "bfb.shell.override";
type Override = "web" | "pwa" | null;

/**
 * Returns "pwa" on mobile viewports, "web" on desktop.
 * A manual override (dev toggle) via localStorage["bfb.shell.override"] wins.
 */
export function useResponsiveShell(): "web" | "pwa" {
  const isMobile = useIsMobile();
  const [override, setOverride] = useState<Override>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = window.localStorage.getItem(OVERRIDE_KEY);
    if (value === "web" || value === "pwa") setOverride(value);
  }, []);

  if (override) return override;
  return isMobile ? "pwa" : "web";
}
