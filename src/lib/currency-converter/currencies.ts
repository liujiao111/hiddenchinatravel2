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
  /** Simplified Chinese display name (used on /zh pages). */
  nameZh: string;
  symbol: string;
};

/** Traveler-facing currencies — CNY first, then common inbound origins. */
export const CURRENCIES: CurrencyOption[] = [
  { code: "CNY", name: "Chinese Yuan (RMB)", nameZh: "人民币", symbol: "¥" },
  { code: "USD", name: "US Dollar", nameZh: "美元", symbol: "$" },
  { code: "EUR", name: "Euro", nameZh: "欧元", symbol: "€" },
  { code: "GBP", name: "British Pound", nameZh: "英镑", symbol: "£" },
  { code: "HKD", name: "Hong Kong Dollar", nameZh: "港元", symbol: "HK$" },
  { code: "AUD", name: "Australian Dollar", nameZh: "澳元", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", nameZh: "加元", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", nameZh: "日元", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", nameZh: "新加坡元", symbol: "S$" },
  { code: "KRW", name: "South Korean Won", nameZh: "韩元", symbol: "₩" },
  { code: "TWD", name: "New Taiwan Dollar", nameZh: "新台币", symbol: "NT$" },
];

export type CurrencyLang = "en" | "zh";

/** Localised currency display name. */
export function currencyName(
  currency: CurrencyOption,
  lang: CurrencyLang = "en",
): string {
  return lang === "zh" ? currency.nameZh : currency.name;
}

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
