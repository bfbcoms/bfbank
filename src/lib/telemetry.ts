/**
 * Client-side error telemetry hook.
 *
 * Forwards uncaught React errors to the host telemetry bridge when one is
 * present on `window`. Safe to call from SSR — bails out when `window` is
 * undefined and swallows all failures so telemetry can never break the app.
 */

type TelemetryOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type TelemetryBridge = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: TelemetryOptions,
  ) => void;
};

declare global {
  interface Window {
    __appTelemetry?: TelemetryBridge;
    /** @deprecated legacy bridge name kept for backwards compatibility */
    __lovableEvents?: TelemetryBridge;
  }
}

export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const bridge = window.__appTelemetry ?? window.__lovableEvents;
  bridge?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
