import { CURRENCIES, type CurrencyCode } from "./currencies";

export type ExchangeRatesResult = {
  ok: true;
  /** ISO timestamp when we successfully fetched */
  fetchedAt: string;
  /** Date string from the upstream feed when available */
  rateDate: string;
  source: string;
  sourceUrl: string;
  /** CNY amount for 1 unit of each currency (CNY → 1) */
  cnyPerUnit: Record<CurrencyCode, number>;
};

export type ExchangeRatesError = {
  ok: false;
  error: string;
};

export type ExchangeRatesPayload = ExchangeRatesResult | ExchangeRatesError;

const WANTED = CURRENCIES.map((c) => c.code);

const PRIMARY =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cny.json";
const FALLBACK_FAWAZ =
  "https://latest.currency-api.pages.dev/v1/currencies/cny.json";
const FALLBACK_ER = "https://open.er-api.com/v6/latest/CNY";

type FawazPayload = {
  date?: string;
  cny?: Record<string, number>;
};

type ErApiPayload = {
  result?: string;
  time_last_update_utc?: string;
  rates?: Record<string, number>;
};

function buildCnyPerUnitFromForeignPerCny(
  foreignPerCny: Record<string, number>,
): Record<CurrencyCode, number> {
  const out = {} as Record<CurrencyCode, number>;
  for (const code of WANTED) {
    if (code === "CNY") {
      out.CNY = 1;
      continue;
    }
    const perCny = foreignPerCny[code.toLowerCase()] ?? foreignPerCny[code];
    if (typeof perCny !== "number" || !(perCny > 0)) {
      throw new Error(`Missing rate for ${code}`);
    }
    // 1 foreign = 1 / (foreign per 1 CNY) CNY
    out[code] = 1 / perCny;
  }
  return out;
}

function buildCnyPerUnitFromCnyBaseRates(
  rates: Record<string, number>,
): Record<CurrencyCode, number> {
  const out = {} as Record<CurrencyCode, number>;
  for (const code of WANTED) {
    if (code === "CNY") {
      out.CNY = 1;
      continue;
    }
    const foreignPerCny = rates[code];
    if (typeof foreignPerCny !== "number" || !(foreignPerCny > 0)) {
      throw new Error(`Missing rate for ${code}`);
    }
    out[code] = 1 / foreignPerCny;
  }
  return out;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Upstream ${res.status} for ${url}`);
  }
  return res.json();
}

async function fromFawaz(
  url: string,
  label: string,
): Promise<ExchangeRatesResult> {
  const data = (await fetchJson(url)) as FawazPayload;
  if (!data.cny || typeof data.cny !== "object") {
    throw new Error("Unexpected fawazahmed0 payload");
  }
  return {
    ok: true,
    fetchedAt: new Date().toISOString(),
    rateDate: data.date ?? new Date().toISOString().slice(0, 10),
    source: label,
    sourceUrl: url,
    cnyPerUnit: buildCnyPerUnitFromForeignPerCny(data.cny),
  };
}

async function fromOpenErApi(): Promise<ExchangeRatesResult> {
  const data = (await fetchJson(FALLBACK_ER)) as ErApiPayload;
  if (data.result !== "success" || !data.rates) {
    throw new Error("Unexpected open.er-api.com payload");
  }
  return {
    ok: true,
    fetchedAt: new Date().toISOString(),
    rateDate:
      data.time_last_update_utc?.slice(0, 16) ??
      new Date().toISOString().slice(0, 10),
    source: "ExchangeRate-API (open.er-api.com)",
    sourceUrl: FALLBACK_ER,
    cnyPerUnit: buildCnyPerUnitFromCnyBaseRates(data.rates),
  };
}

/** Fetch mid-market rates with hourly Next.js cache + multi-source fallback. */
export async function getExchangeRates(): Promise<ExchangeRatesPayload> {
  const attempts: Array<() => Promise<ExchangeRatesResult>> = [
    () => fromFawaz(PRIMARY, "fawazahmed0/currency-api (jsDelivr)"),
    () => fromFawaz(FALLBACK_FAWAZ, "fawazahmed0/currency-api (Cloudflare)"),
    () => fromOpenErApi(),
  ];

  const errors: string[] = [];
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  return {
    ok: false,
    error:
      "Could not load live exchange rates. Please refresh in a moment.",
  };
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  cnyPerUnit: Record<CurrencyCode, number>,
): number {
  if (!(amount >= 0) || !Number.isFinite(amount)) return NaN;
  if (from === to) return amount;
  const fromCny = amount * cnyPerUnit[from];
  return fromCny / cnyPerUnit[to];
}

export function formatMoney(amount: number, code: CurrencyCode): string {
  if (!Number.isFinite(amount)) return "—";
  const maxFraction = code === "JPY" || code === "KRW" ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: maxFraction,
      minimumFractionDigits: code === "JPY" || code === "KRW" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(maxFraction)} ${code}`;
  }
}

/** Mid-market unit rate for display (toureler-friendly, usually 4 dp). */
export function formatUnitRate(amount: number, code: CurrencyCode): string {
  if (!Number.isFinite(amount)) return "—";
  const digits = code === "JPY" || code === "KRW" ? 2 : 4;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${amount.toFixed(digits)} ${code}`;
  }
}
