"use client";

import { useMemo, useState, useTransition } from "react";
import { CURRENCIES, QUICK_CNY_AMOUNTS, type CurrencyCode } from "@/lib/currency-converter/currencies";
import { convertAmount, formatMoney, formatUnitRate, type ExchangeRatesPayload } from "@/lib/currency-converter/get-rates";

export function CurrencyConverter({ initialRates }: { initialRates: ExchangeRatesPayload }) {
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
      } catch { setError("Rates are temporarily unavailable. Your previous reference rate is still shown."); }
    });
  }

  return <div className="tool-interactive" id="convert"><div className="tool-panel-heading"><span>01 / CONVERT</span><h2>What does that cost in yuan?</h2><p>Use the mid-market reference rate to get your bearings before paying by card, cash or mobile wallet.</p></div>
    <div className="currency-fields"><label className="tool-field">Amount<input type="text" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} aria-describedby="currency-input-hint" /><small id="currency-input-hint">Enter a positive amount</small></label><label className="tool-field">From<select value={from} onChange={(event) => setFrom(event.target.value as CurrencyCode)}>{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}</select></label><button className="currency-swap" type="button" aria-label="Swap currencies" onClick={() => { setFrom(to); setTo(from); }}>⇄</button><label className="tool-field">To<select value={to} onChange={(event) => setTo(event.target.value as CurrencyCode)}>{CURRENCIES.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} · {currency.name}</option>)}</select></label></div>
    <div className="currency-result" aria-live="polite"><span>{Number.isFinite(number) && number >= 0 ? `${formatMoney(number, from)} ${from}` : "Enter a valid amount"}</span><strong>{rates.ok ? formatMoney(converted, to) : "Rate unavailable"} <small>{rates.ok ? to : ""}</small></strong>{rates.ok && <p>1 {from} ≈ {formatUnitRate(unit, to)} {to} · 1 {to} ≈ {formatUnitRate(reverse, from)} {from}</p>}</div>
    <div className="currency-rate-meta">{rates.ok ? <p>Rate date: <strong>{rates.rateDate}</strong> · Source: <a href={rates.sourceUrl} target="_blank" rel="noopener noreferrer">{rates.source} ↗</a> · Updates roughly hourly</p> : <p>Live rates could not be loaded. Please try refreshing.</p>}<button onClick={refresh} type="button" disabled={pending}>{pending ? "Refreshing…" : "Refresh rate ↻"}</button></div>{error && <p className="tool-error" role="alert">{error}</p>}
    {rates.ok && <div className="currency-quick"><h3>Quick reference · Chinese yuan</h3><div>{QUICK_CNY_AMOUNTS.map((cny) => <span key={cny}><b>¥{cny.toLocaleString()}</b> ≈ {formatMoney(convertAmount(cny, "CNY", foreign, rates.cnyPerUnit), foreign)} {foreign}</span>)}</div></div>}
  </div>;
}
