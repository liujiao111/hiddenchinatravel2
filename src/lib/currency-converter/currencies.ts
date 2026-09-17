export type CurrencyCode =
  | "CNY"
  | "USD"
  | "EUR"
  | "GBP"
  | "HKD"
  | "AUD"
  | "CAD"
  | "JPY"
  | "SGD"
  | "KRW"
  | "TWD";

export type CurrencyOption = {
  code: CurrencyCode;
  name: string;
  symbol: string;
};

/** Traveler-facing currencies — CNY first, then common inbound origins. */
export const CURRENCIES: CurrencyOption[] = [
  { code: "CNY", name: "Chinese Yuan (RMB)", symbol: "¥" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" },
];

export const DEFAULT_FROM: CurrencyCode = "USD";
export const DEFAULT_TO: CurrencyCode = "CNY";

/** Quick CNY amounts for the lookup table (tourist mental math). */
export const QUICK_CNY_AMOUNTS = [100, 200, 500, 1000, 2000, 5000] as const;

/** Common foreign cash amounts → CNY (matches “how much is $X in yuan”). */
export const QUICK_FOREIGN_AMOUNTS = [10, 20, 50, 100, 200, 500] as const;

/** Illustrative markups vs mid-market — not bank-specific quotes. */
export const ILLUSTRATIVE_MARKUPS = [
  { id: "atm", label: "Typical ATM / bank cash withdrawal", pct: 3.5 },
  { id: "airport", label: "Airport / hotel exchange desk", pct: 6 },
] as const;

export function currencyByCode(code: string): CurrencyOption | undefined {
  return CURRENCIES.find((c) => c.code === code);
}
