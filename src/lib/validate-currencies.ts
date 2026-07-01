import { validateCurrencyRegistry } from "./currencies";

let hasRun = false;

/**
 * Runs the Nium currency registry validation once per session. Any mismatch
 * between our local registry and the documented Nium payout set is surfaced
 * via console.warn so engineers can catch drift without breaking the app.
 */
export function runCurrencyRegistryCheck(): void {
  if (hasRun) return;
  hasRun = true;
  const result = validateCurrencyRegistry();
  if (result.ok) return;
  // eslint-disable-next-line no-console
  console.warn("[BFB] Currency registry drift vs Nium reference set:", {
    missing: result.missing,
    extra: result.extra,
    invalidCountry: result.invalidCountry,
  });
}
