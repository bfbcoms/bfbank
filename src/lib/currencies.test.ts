import { describe, it, expect } from "vitest";
import {
  NIUM_CURRENCIES,
  NIUM_REFERENCE_CODES,
  getCurrency,
  getCurrencyFlagUrl,
  validateCurrencyRegistry,
} from "@/lib/currencies";

const COUNTRY_RE = /^[a-z]{2}$|^european_union$/;

describe("currency registry", () => {
  it("has a valid ISO country mapping for every entry", () => {
    for (const c of NIUM_CURRENCIES) {
      expect(c.code, `${c.code} must be a 3-letter ISO code`).toMatch(/^[A-Z]{3}$/);
      expect(c.country, `${c.code} → ${c.country}`).toMatch(COUNTRY_RE);
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  it("emits a circle-flags URL for every currency", () => {
    for (const c of NIUM_CURRENCIES) {
      expect(getCurrencyFlagUrl(c.code)).toBe(
        `https://hatscripts.github.io/circle-flags/flags/${c.country}.svg`,
      );
    }
  });

  it("has no duplicate codes", () => {
    const codes = NIUM_CURRENCIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("includes XAF (Central African CFA franc — Nium supported)", () => {
    expect(getCurrency("XAF")).toBeDefined();
  });

  it("matches the Nium reference set", () => {
    const result = validateCurrencyRegistry();
    expect(result).toEqual({ ok: true, missing: [], extra: [], invalidCountry: [] });
  });

  it("reference set has no duplicates", () => {
    expect(new Set(NIUM_REFERENCE_CODES).size).toBe(NIUM_REFERENCE_CODES.length);
  });
});
