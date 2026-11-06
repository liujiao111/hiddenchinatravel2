"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CURRENCIES, QUICK_CNY_AMOUNTS, currencyName, type CurrencyCode } from "@/lib/currency-converter/currencies";
import { convertAmount, formatMoney, formatUnitRate, type ExchangeRatesPayload } from "@/lib/currency-converter/get-rates";

export function CurrencyConverter({ initialRates }: { initialRates: ExchangeRatesPayload }) {
  const t = useTranslations("currencyConverter");
  const locale = useLocale();
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";
  const [rates, setRates] = useState(initialRates);
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("CNY");
  const [amount, setAmount] = useState("100");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const number = Number(amount.replace(/,/g, ""));
  const converted = useMemo(() => rates.ok && Number.isFinite(number) && number >= 0 ? convertAmount(number, from, to, rates.cnyPerUnit) : NaN, [rates, number, from, to]);
  const unit = rates.ok ? convertAmount(1, from, to, rates.cnyPerUnit) : NaN;
  const reverse = rates.ok ? convertAmount(1, to, from, rates.cnyPerUnit) : NaN;
  const foreign = from === "CNY" ? to : from;

  function refresh() {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/exchange-rates", { cache: "no-store" });
        const payload = (await response.json()) as ExchangeRatesPayload;
        if (!payload.ok) throw new Error(payload.error);
        setRates(payload);
      } catch { setError(t("tool.errorMessage")); }
    });
  }

  return <div className="tool-interactive" id="convert"><div className="tool-panel-heading"><span>{t("tool.step")}</span><h2>{t("tool.heading")}</h2><p>{t("tool.lead")}</p></div>
    <div className="currency-fields"><label className="tool-field">{t("tool.amount")}<input type="text" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} aria-describedby="currency-input-hint" /><small id="currency-input-hint">{t("tool.amountHint")}</small></label><label className="tool-field">{t("tool.from")}<select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)}>{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currencyName(currency, locale === "zh" ? "zh" : "en")}</option>)}</select></label><button className="currency-swap" type="button" aria-label={t("tool.swapAria")} onClick={() => { setFrom(to); setTo(from); }}>⇄</button><label className="tool-field">{t("tool.to")}<select value={to} onChange={(event) => setTo(event.target.value as CurrencyCode)}>{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currencyName(currency, locale === "zh" ? "zh" : "en")}</option>)}</select></label></div>
    <div className="currency-result" aria-live="polite"><span>{Number.isFinite(number) && number >= 0 ? `${formatMoney(number, from, numberLocale)} ${from}` : t("tool.invalidAmount")}</span><strong>{rates.ok ? formatMoney(converted, to, numberLocale) : t("tool.rateUnavailable")} <small>{rates.ok ? to : ""}</small></strong>{rates.ok && <p>1 {from} ≈ {formatUnitRate(unit, to, numberLocale)} {to} · 1 {to} ≈ {formatUnitRate(reverse, from, numberLocale)} {from}</p>}</div>
    <div className="currency-rate-meta">{rates.ok ? <p>{t("tool.rateDate")} <strong>{rates.rateDate}</strong> · {t("tool.source")} <a href={rates.sourceUrl} target="_blank" rel="noopener noreferrer">{rates.source} ↗</a> · {t("tool.updatesHourly")}</p> : <p>{t("tool.loadFailed")}</p>}<button onClick={refresh} type="button" disabled={pending}>{pending ? t("tool.refreshing") : t("tool.refresh")}</button></div>{error && <p className="tool-error" role="alert">{error}</p>}
    {rates.ok && <div className="currency-quick"><h3>{t("tool.quickHeading")}</h3><div>{QUICK_CNY_AMOUNTS.map((cny) => <span key={cny}><b>¥{cny.toLocaleString(numberLocale)}</b> ≈ {formatMoney(convertAmount(cny, "CNY", foreign, rates.cnyPerUnit), foreign, numberLocale)} {foreign}</span>)}</div></div>}
  </div>;
}
