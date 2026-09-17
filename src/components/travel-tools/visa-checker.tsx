"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { checkVisaEligibility } from "@/app/china-visa-checker/actions";
import type { VisaEvaluationResult, VisaCheckInput } from "@/lib/visa-checker/evaluate";
import type { SelectOption } from "@/lib/visa-checker/load-rules";

type Props = { countries: SelectOption[]; ports: SelectOption[] };

const purposes = [
  ["tourism", "Tourism"], ["business", "Business"], ["family_visit", "Visit family / friends"],
  ["exchange", "Short exchange"], ["transit", "Transit"], ["study", "Study"],
  ["work", "Work"], ["journalism", "Journalism"],
] as const;

export function VisaChecker({ countries, ports }: Props) {
  const [form, setForm] = useState<VisaCheckInput>({ nationality: "", purpose: "tourism", stayDays: 7, transitRoute: "no_transit", portId: "" });
  const [result, setResult] = useState<VisaEvaluationResult | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof VisaCheckInput>(key: K, value: VisaCheckInput[K]) => { setForm((previous) => ({ ...previous, [key]: value })); setResult(null); };
  useEffect(() => { if (result) document.getElementById("visa-result")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [result]);

  return <div className="tool-interactive" id="check-visa">
    <div className="tool-panel-heading"><span>01 / CHECK YOUR ROUTE</span><h2>Start with your passport.</h2><p>A short answer based on the published entry rules, with the conditions that matter for your trip.</p></div>
    <form className="tool-form" onSubmit={(event) => { event.preventDefault(); setError(""); startTransition(async () => { try { setResult(await checkVisaEligibility(form)); } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not check this trip. Please try again."); } }); }}>
      <label className="tool-field">Passport nationality<select required value={form.nationality} onChange={(event) => set("nationality", event.target.value)}><option value="">Select your passport country</option>{countries.map((country) => <option value={country.value} key={country.value}>{country.label}</option>)}</select></label>
      <label className="tool-field">Purpose of visit<select value={form.purpose} onChange={(event) => set("purpose", event.target.value)}>{purposes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label className="tool-field">Length of stay (days)<input type="number" required min="1" max="365" value={form.stayDays} onChange={(event) => set("stayDays", Number(event.target.value))} /></label>
      <label className="tool-field">Travel route<select value={form.transitRoute} onChange={(event) => set("transitRoute", event.target.value)}><option value="no_transit">Visiting China, then returning home</option><option value="third_country_confirmed">Transiting to a different country or region with an onward ticket</option><option value="same_country_return">Returning to the same country or region</option><option value="not_sure">I have not decided yet</option></select></label>
      <label className="tool-field tool-field-wide">Arrival port <small>Needed for transit and Hainan rules</small><select value={form.portId} onChange={(event) => set("portId", event.target.value)}><option value="">Choose your arrival port (if known)</option>{ports.map((port) => <option value={port.value} key={port.value}>{port.label}</option>)}</select></label>
      <div className="tool-form-action"><button className="button" type="submit" disabled={pending}>{pending ? "CHECKING…" : "CHECK ENTRY RULES →"}</button><p>Ordinary passports · Information for trip planning</p></div>
      {error && <p className="tool-error" role="alert">{error}</p>}
    </form>
    <div id="visa-result" className="tool-result-anchor" aria-live="polite">{result && <VisaResult result={result} />}</div>
  </div>;
}

function VisaResult({ result }: { result: VisaEvaluationResult }) {
  const kind = result.outcome === "visa_free" || result.outcome === "hainan_30" ? "eligible" : result.outcome === "transit_240" ? "transit" : "caution";
  return <article className={`visa-result ${kind}`}><span className="tool-kicker">{result.kicker}</span><h2>{result.headline}</h2><p>{result.summary}</p>{result.note && <p className="visa-note">{result.note}</p>}
    <div className="visa-result-facts"><span><b>Passport</b>{result.meta.nationality}</span><span><b>Stay</b>{result.meta.stayLabel}</span><span><b>Arrival</b>{result.meta.portLabel}</span></div>
    {result.policy?.allowedStayArea && <p><strong>Permitted area:</strong> {result.policy.allowedStayArea}</p>}
    {result.missingConditions?.length ? <div className="visa-conditions"><h3>Conditions still missing</h3><ul>{result.missingConditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></div> : null}
    <h3>What to prepare</h3><ul>{result.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
    <div className="tool-result-links"><Link href={result.primaryCta.href}>{result.primaryCta.label} →</Link><Link href="#official-sources">Check official sources →</Link></div>
    <small>Final entry is decided by border officials. Confirm the latest rules before booking.</small>
  </article>;
}
