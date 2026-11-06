"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { checkVisaEligibility } from "@/app/[lang]/china-visa-checker/actions";
import type { VisaEvaluationResult, VisaCheckInput } from "@/lib/visa-checker/evaluate";
import type { SelectOption } from "@/lib/visa-checker/load-rules";

type Props = { countries: SelectOption[]; ports: SelectOption[] };

export function VisaChecker({ countries, ports }: Props) {
  const t = useTranslations("visaChecker");
  const locale = useLocale();
  const purposeLabels = t.raw("form.purposes") as Record<string, string>;
  const routeLabels = t.raw("form.routes") as Record<string, string>;
  const [form, setForm] = useState<VisaCheckInput>({ nationality: "", purpose: "tourism", stayDays: 7, transitRoute: "no_transit", portId: "" });
  const [result, setResult] = useState<VisaEvaluationResult | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof VisaCheckInput>(key: K, value: VisaCheckInput[K]) => { setForm((previous) => ({ ...previous, [key]: value })); setResult(null); };
  useEffect(() => { if (result) document.getElementById("visa-result")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [result]);

  return <div className="tool-interactive" id="check-visa">
    <div className="tool-panel-heading"><span>{t("form.step")}</span><h2>{t("form.heading")}</h2><p>{t("form.lead")}</p></div>
    <form className="tool-form" onSubmit={(event) => { event.preventDefault(); setError(""); startTransition(async () => { try { setResult(await checkVisaEligibility({ ...form, locale })); } catch (issue) { setError(issue instanceof Error ? issue.message : t("form.errorGeneric")); } }); }}>
      <label className="tool-field">{t("form.nationality")}<select required value={form.nationality} onChange={(event) => set("nationality", event.target.value)}><option value="">{t("form.nationalityPlaceholder")}</option>{countries.map((country) => <option value={country.value} key={country.value}>{country.label}</option>)}</select></label>
      <label className="tool-field">{t("form.purpose")}<select value={form.purpose} onChange={(event) => set("purpose", event.target.value)}>{Object.entries(purposeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label className="tool-field">{t("form.stayDays")}<input type="number" required min="1" max="365" value={form.stayDays} onChange={(event) => set("stayDays", Number(event.target.value))} /></label>
      <label className="tool-field">{t("form.route")}<select value={form.transitRoute} onChange={(event) => set("transitRoute", event.target.value)}>{Object.entries(routeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label className="tool-field tool-field-wide">{t("form.port")} <small>{t("form.portHint")}</small><select value={form.portId} onChange={(event) => set("portId", event.target.value)}><option value="">{t("form.portPlaceholder")}</option>{ports.map((port) => <option value={port.value} key={port.value}>{port.label}</option>)}</select></label>
      <div className="tool-form-action"><button className="button" type="submit" disabled={pending}>{pending ? t("form.submitting") : t("form.submit")}</button><p>{t("form.formNote")}</p></div>
      {error && <p className="tool-error" role="alert">{error}</p>}
    </form>
    <div id="visa-result" className="tool-result-anchor" aria-live="polite">{result && <VisaResult result={result} />}</div>
  </div>;
}

function VisaResult({ result }: { result: VisaEvaluationResult }) {
  const t = useTranslations("visaChecker");
  const kind = result.outcome === "visa_free" || result.outcome === "hainan_30" ? "eligible" : result.outcome === "transit_240" ? "transit" : "caution";
  return <article className={`visa-result ${kind}`}><span className="tool-kicker">{result.kicker}</span><h2>{result.headline}</h2><p>{result.summary}</p>{result.note && <p className="visa-note">{result.note}</p>}
    <div className="visa-result-facts"><span><b>{t("result.passport")}</b>{result.meta.nationality}</span><span><b>{t("result.stay")}</b>{result.meta.stayLabel}</span><span><b>{t("result.arrival")}</b>{result.meta.portLabel}</span></div>
    {result.policy?.allowedStayArea && <p><strong>{t("result.permittedArea")}</strong> {result.policy.allowedStayArea}</p>}
    {result.missingConditions?.length ? <div className="visa-conditions"><h3>{t("result.missingConditions")}</h3><ul>{result.missingConditions.map((condition) => <li key={condition}>{condition}</li>)}</ul></div> : null}
    <h3>{t("result.prepare")}</h3><ul>{result.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
    <div className="tool-result-links"><Link href={result.primaryCta.href}>{result.primaryCta.label} →</Link><Link href="#official-sources">{t("result.officialSources")}</Link></div>
    <small>{t("result.disclaimer")}</small>
  </article>;
}
