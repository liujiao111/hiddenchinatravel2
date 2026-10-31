"use client";

import { Link } from "@/i18n/navigation";
import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { journeyBudgets, journeyComfort, journeyInterests } from "@/lib/custom-journey-enquiry";
import { siteConfig } from "@/lib/site-config";
import { JourneyPlaceSelection, useJourneyInspiration } from "@/components/journey-inspiration-context";
import { trackEvent } from "@/lib/analytics";

export function CustomJourneyForm() {
  const t = useTranslations("customForm");
  const tq = useTranslations("quickAsk");
  const { selected } = useJourneyInspiration();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef<string | null>(null);
  const started = useRef(false);

  const interestLabels = t.raw("interestLabels") as Record<string, string>;
  const budgetLabels = t.raw("budgetLabels") as Record<string, string>;
  const comfortLabels = t.raw("comfortLabels") as Record<string, string>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    const fields = Object.fromEntries(["name", "email", "whatsapp", "travelTiming", "tripLength", "destinations", "budget", "comfort", "notes", "website"].map(key => [key, String(data.get(key) || "")]));
    fields.destinations = [fields.destinations, ...selected].filter(Boolean).join("; ");
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/custom-journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, adults: Number(data.get("adults")), children: Number(data.get("children")), interests: data.getAll("interests"), consent: data.get("consent") === "on", requestId: requestId.current }) });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || t("sendError"));
      setStatus("success");
      trackEvent("generate_lead", { form_name: "custom_journey_enquiry", page_path: "/custom-china-tour", lead_type: "tailor_made_journey", event_id: requestId.current || undefined });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t("sendErrorAlt"));
    }
  }

  if (status === "success") return <div className="custom-enquiry-success" role="status" tabIndex={-1} style={{ scrollMarginTop: 90 }} ref={(confirmation) => { if (!confirmation) return; confirmation.focus({ preventScroll: true }); confirmation.scrollIntoView({ behavior: "instant", block: "start" }); }}><h3>{t("successTitle")}</h3><p>{t("successText", { replyTime: tq("replyTime") })}</p><p><a href={siteConfig.sampleItineraryPdf} download>{t("successSample")}</a></p><p>{t("successNote")}</p><Link href="/journeys">{t("successLink")}</Link></div>;

  return <form className="contact-form custom-enquiry-form" onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; trackEvent("custom_journey_form_start", { form_name: "custom_journey_enquiry", page_path: "/custom-china-tour" }); } }}>
    <div className="contact-field-row"><label><span>{t("name")}</span><input name="name" autoComplete="name" type="text" maxLength={100} required /></label><label><span>{t("email")}</span><input name="email" autoComplete="email" type="email" maxLength={254} required /></label></div>
    <label><span>{t("travelTiming")}</span><input name="travelTiming" type="text" placeholder={t("travelTimingPlaceholder")} maxLength={100} /></label>
    <fieldset><legend>{t("travelersLegend")}</legend><div className="contact-field-row"><label><span>{t("adults")}</span><input name="adults" type="number" min={1} max={30} defaultValue={2} required /></label><label><span>{t("children")}</span><input name="children" type="number" min={0} max={20} defaultValue={0} required /></label></div></fieldset>
    <JourneyPlaceSelection />
    <label><span>{t("notesLabel")}</span><textarea name="notes" rows={4} maxLength={3000} placeholder={t("notesPlaceholder")} /></label>
    <details className="custom-enquiry-options"><summary>{t("moreOptions")} <small>{t("optional")}</small><span aria-hidden="true">+</span></summary><div>
    <label><span>{t("whatsappLabel")} <small>{t("whatsappHint")}</small></span><input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} /></label>
    <label><span>{t("tripLength")}</span><input name="tripLength" type="text" placeholder={t("tripLengthPlaceholder")} maxLength={80} /></label>
    <label><span>{t("destinationsLabel")}</span><input name="destinations" type="text" maxLength={300} placeholder={t("destinationsPlaceholder")} /></label>
    <div className="contact-field-row"><label><span>{t("budgetLabel")} <small>{t("budgetHint")}</small></span><select name="budget" defaultValue="Please advise">{journeyBudgets.map(option => <option key={option} value={option}>{budgetLabels[option] ?? option}</option>)}</select></label><label><span>{t("comfortLabel")}</span><select name="comfort" defaultValue="Please advise">{journeyComfort.map(option => <option key={option} value={option}>{comfortLabels[option] ?? option}</option>)}</select></label></div>
    <fieldset><legend>{t("interestsLegend")}</legend><div className="custom-interest-options">{journeyInterests.map(interest => <label key={interest}><input type="checkbox" name="interests" value={interest} /><span>{interestLabels[interest] ?? interest}</span></label>)}</div></fieldset>
    </div></details>
    <div className="custom-form-trap" aria-hidden="true"><label>{t("trapLabel")}<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="custom-consent"><input name="consent" type="checkbox" required /><span>{t("consentText")} <Link href="/privacy-policy">{t("privacyLink")}</Link>.</span></label>
    {status === "error" ? <p className="custom-form-error" role="alert">{message}</p> : null}
    <button className="button journey-primary-action" type="submit" disabled={status === "sending"}>{status === "sending" ? t("sending") : t("submit")}</button>
    <p className="contact-form-note">{t("noteNoPayment")}</p>
    <p className="contact-form-privacy">{t("notePrivacy")}</p>
  </form>;
}
