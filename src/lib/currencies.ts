/**
 * Canonical currency + country registry aligned with the Nium global payouts network.
 *
 * Nium enables pay-outs in 100+ currencies and pay-ins across 190+ countries. This
 * file centralises the currency codes we surface in-app (calculator, accounts,
 * transfer forms, corridor tables, deposit/withdraw flows, admin) and pairs each
 * with an ISO-3166 alpha-2 country code used to render its circular flag.
 *
 * Multi-country currency codes (EUR, XOF, XCD, XPF) map to their most
 * recognisable jurisdiction badge (EU for EUR, Senegal for XOF, etc.).
 */

export type CurrencyMeta = {
  /** ISO-4217 currency code */
  code: string;
  /** Human-readable currency name */
  name: string;
  /** ISO-3166 alpha-2 country code used for the flag asset */
  country: string;
  /** Optional currency symbol for display */
  symbol?: string;
};

// Ordered: our primary settlement currencies first, then the wider Nium set.
export const NIUM_CURRENCIES: CurrencyMeta[] = [
  { code: "GBP", name: "Pound sterling", country: "gb", symbol: "£" },
  { code: "USD", name: "US dollar", country: "us", symbol: "$" },
  { code: "EUR", name: "Euro", country: "european_union", symbol: "€" },
  { code: "AED", name: "UAE dirham", country: "ae", symbol: "د.إ" },
  { code: "AUD", name: "Australian dollar", country: "au", symbol: "A$" },
  { code: "BDT", name: "Bangladeshi taka", country: "bd", symbol: "৳" },
  { code: "BGN", name: "Bulgarian lev", country: "bg", symbol: "лв" },
  { code: "BHD", name: "Bahraini dinar", country: "bh" },
  { code: "BRL", name: "Brazilian real", country: "br", symbol: "R$" },
  { code: "CAD", name: "Canadian dollar", country: "ca", symbol: "C$" },
  { code: "CHF", name: "Swiss franc", country: "ch" },
  { code: "CLP", name: "Chilean peso", country: "cl" },
  { code: "CNY", name: "Chinese yuan", country: "cn", symbol: "¥" },
  { code: "COP", name: "Colombian peso", country: "co" },
  { code: "CZK", name: "Czech koruna", country: "cz", symbol: "Kč" },
  { code: "DKK", name: "Danish krone", country: "dk", symbol: "kr" },
  { code: "EGP", name: "Egyptian pound", country: "eg" },
  { code: "FJD", name: "Fijian dollar", country: "fj" },
  { code: "GEL", name: "Georgian lari", country: "ge" },
  { code: "GHS", name: "Ghanaian cedi", country: "gh" },
  { code: "HKD", name: "Hong Kong dollar", country: "hk", symbol: "HK$" },
  { code: "HRK", name: "Croatian kuna", country: "hr" },
  { code: "HUF", name: "Hungarian forint", country: "hu", symbol: "Ft" },
  { code: "IDR", name: "Indonesian rupiah", country: "id", symbol: "Rp" },
  { code: "ILS", name: "Israeli shekel", country: "il", symbol: "₪" },
  { code: "INR", name: "Indian rupee", country: "in", symbol: "₹" },
  { code: "JPY", name: "Japanese yen", country: "jp", symbol: "¥" },
  { code: "KES", name: "Kenyan shilling", country: "ke", symbol: "KSh" },
  { code: "KRW", name: "South Korean won", country: "kr", symbol: "₩" },
  { code: "KWD", name: "Kuwaiti dinar", country: "kw" },
  { code: "LKR", name: "Sri Lankan rupee", country: "lk" },
  { code: "MAD", name: "Moroccan dirham", country: "ma" },
  { code: "MXN", name: "Mexican peso", country: "mx", symbol: "Mex$" },
  { code: "MYR", name: "Malaysian ringgit", country: "my", symbol: "RM" },
  { code: "NGN", name: "Nigerian naira", country: "ng", symbol: "₦" },
  { code: "NOK", name: "Norwegian krone", country: "no", symbol: "kr" },
  { code: "NPR", name: "Nepalese rupee", country: "np" },
  { code: "NZD", name: "New Zealand dollar", country: "nz", symbol: "NZ$" },
  { code: "OMR", name: "Omani rial", country: "om" },
  { code: "PEN", name: "Peruvian sol", country: "pe" },
  { code: "PHP", name: "Philippine peso", country: "ph", symbol: "₱" },
  { code: "PKR", name: "Pakistani rupee", country: "pk" },
  { code: "PLN", name: "Polish złoty", country: "pl", symbol: "zł" },
  { code: "QAR", name: "Qatari riyal", country: "qa" },
  { code: "RON", name: "Romanian leu", country: "ro" },
  { code: "RSD", name: "Serbian dinar", country: "rs" },
  { code: "SAR", name: "Saudi riyal", country: "sa" },
  { code: "SEK", name: "Swedish krona", country: "se", symbol: "kr" },
  { code: "SGD", name: "Singapore dollar", country: "sg", symbol: "S$" },
  { code: "THB", name: "Thai baht", country: "th", symbol: "฿" },
  { code: "TND", name: "Tunisian dinar", country: "tn" },
  { code: "TRY", name: "Turkish lira", country: "tr", symbol: "₺" },
  { code: "TWD", name: "New Taiwan dollar", country: "tw", symbol: "NT$" },
  { code: "TZS", name: "Tanzanian shilling", country: "tz" },
  { code: "UGX", name: "Ugandan shilling", country: "ug" },
  { code: "UYU", name: "Uruguayan peso", country: "uy" },
  { code: "VND", name: "Vietnamese đồng", country: "vn", symbol: "₫" },
  { code: "XAF", name: "Central African CFA franc", country: "cm" },
  { code: "XOF", name: "West African CFA franc", country: "sn" },
  { code: "ZAR", name: "South African rand", country: "za", symbol: "R" },
];

/**
 * Reference set of ISO-4217 codes documented as supported by the Nium global
 * payouts network (public API docs). Used at runtime to validate that
 * NIUM_CURRENCIES is in sync — mismatches log a warning in development.
 */
export const NIUM_REFERENCE_CODES: readonly string[] = [
  "AED","AUD","BDT","BGN","BHD","BRL","CAD","CHF","CLP","CNY","COP","CZK",
  "DKK","EGP","EUR","FJD","GBP","GEL","GHS","HKD","HRK","HUF","IDR","ILS",
  "INR","JPY","KES","KRW","KWD","LKR","MAD","MXN","MYR","NGN","NOK","NPR",
  "NZD","OMR","PEN","PHP","PKR","PLN","QAR","RON","RSD","SAR","SEK","SGD",
  "THB","TND","TRY","TWD","TZS","UGX","USD","UYU","VND","XAF","XOF","ZAR",
];

export type CurrencyValidationResult = {
  ok: boolean;
  missing: string[]; // in Nium reference but absent from NIUM_CURRENCIES
  extra: string[];   // present in NIUM_CURRENCIES but not in Nium reference
  invalidCountry: string[]; // registry rows with malformed country codes
};

export function validateCurrencyRegistry(): CurrencyValidationResult {
  const local = new Set(NIUM_CURRENCIES.map((c) => c.code));
  const remote = new Set(NIUM_REFERENCE_CODES);
  const missing = [...remote].filter((c) => !local.has(c)).sort();
  const extra = [...local].filter((c) => !remote.has(c)).sort();
  const invalidCountry = NIUM_CURRENCIES
    .filter((c) => !/^[a-z]{2}$|^european_union$/.test(c.country))
    .map((c) => c.code);
  return { ok: missing.length === 0 && extra.length === 0 && invalidCountry.length === 0, missing, extra, invalidCountry };
}

const BY_CODE = new Map(NIUM_CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: string): CurrencyMeta | undefined {
  return BY_CODE.get(code.toUpperCase());
}

export function getCurrencyFlagUrl(code: string): string | null {
  const meta = getCurrency(code);
  if (!meta) return null;
  return `https://hatscripts.github.io/circle-flags/flags/${meta.country}.svg`;
}

/** Currency codes we support for sending FROM (settlement accounts BFB issues). */
export const SEND_CURRENCY_CODES = ["GBP", "USD", "EUR", "AED", "AUD", "CAD", "SGD", "HKD"] as const;

/** Currency codes for receive-side selection (superset — full Nium payout list). */
export const RECEIVE_CURRENCY_CODES = NIUM_CURRENCIES.map((c) => c.code);
