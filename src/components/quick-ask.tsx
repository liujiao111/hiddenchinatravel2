"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { budgetBands, enquiryMessage, isQuoteReady, parseEnquiry, partySizes, travelWindows, type Enquiry } from "@/lib/enquiry";
import { siteConfig } from "@/lib/site-config";
import { newAnalyticsEventId, trackEvent } from "@/lib/analytics";

type Intent = "trip" | "advice";

type Props = {
  source: string;
  sourceTitle: string;
  intent: Intent;
  id?: string;
  layout?: "band" | "embedded" | "plain";
};

const visibleAskTargets = new Set<string>();

function travelMonthOptions(locale: string, notSureLabel: string) {
  const options: string[] = [];
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const localeTag = locale === "zh" ? "zh-CN" : "en-US";
  for (let index = 0; index < 18; index += 1) {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1));
    options.push(date.toLocaleDateString(localeTag, { month: "long", year: "numeric", timeZone: "UTC" }));
  }
  options.push(notSureLabel);
  return options;
}

function syncMobileAskBars() {
  const hide = visibleAskTargets.size > 0;
  document.querySelectorAll(".article-mobile-ask").forEach((bar) => {
    bar.classList.toggle("ask-bar-hidden", hide);
  });
}

export function QuickAsk({ source, sourceTitle, intent, id = "ask-joy", layout = "band" }: Props) {
  const t = useTranslations("quickAsk");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [whatsappHref, setWhatsappHref] = useState("");
  const [quoteRequested, setQuoteRequested] = useState(intent === "trip");

  const partySizeLabels = t.raw("partySizeLabels") as Record<string, string>;
  const travelWindowLabels = t.raw("travelWindowLabels") as Record<string, string>;
  const budgetBandLabels = t.raw("budgetBandLabels") as Record<string, string>;

  useEffect(() => {
    const target = document.getElementById(id);
    const bars = document.querySelectorAll(".article-mobile-ask");
    if (!target || bars.length === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) visibleAskTargets.add(id);
      else visibleAskTargets.delete(id);
      syncMobileAskBars();
    }, { threshold: 0.2 });
    observer.observe(target);
    return () => {
      observer.disconnect();
      visibleAskTargets.delete(id);
      syncMobileAskBars();
    };
  }, [id]);

  useEffect(() => {
    function resetAskForm(event: Event) {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id !== id) return;
      setStatus("idle");
      setError("");
      setSent(null);
      setWhatsappHref("");
    }

    window.addEventListener("quick-ask:reset", resetAskForm);
    return () => window.removeEventListener("quick-ask:reset", resetAskForm);
  }, [id]);

  const plain = layout === "plain";
  const standbyWhatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(t("whatsappPrompt", { sourceTitle }))}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const wantsQuote = intent === "trip" || data.quote === "on";
    const note = String(data.plans ?? "").trim();
    const plans = note || (wantsQuote ? t("defaultPlans", { sourceTitle }) : "");
    const parsed = parseEnquiry({
      ...data,
      plans,
      interest: wantsQuote ? "Yunnan Journey" : "China Travel Advice",
      source,
    });

    if ("error" in parsed) {
      setStatus("error");
      setError(parsed.error);
      return;
    }

    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(enquiryMessage(parsed))}`;
    setStatus("sending");
    setError("");
    setWhatsappHref(whatsappUrl);
    const eventId = newAnalyticsEventId();

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const result = await response.json().catch(() => ({ error: t("sendError") }));
      if (!response.ok) {
        setStatus("error");
        setError(typeof result.error === "string" ? result.error : t("sendError"));
        return;
      }
      setSent(parsed);
      setStatus("success");
      trackEvent("generate_lead", {
        form_name: "quick_ask",
        interest: parsed.interest,
        travel_window: parsed.travelWindow || "not_provided",
        quote_ready: isQuoteReady(parsed),
        page_path: source,
        event_id: eventId,
      });
    } catch {
      setStatus("error");
      setError(t("sendError"));
    }
  }

  const form = status === "success" && sent ? (
    <div className="contact-form-success quick-ask-success" role="status">
      <h3>{isQuoteReady(sent) ? t("successQuoteTitle") : t("successNoteTitle")}</h3>
      <p>
        {isQuoteReady(sent) ? t("successQuoteText") : t("successNoteText")}{" "}
        {t("replyTime")}
      </p>
      {sent.interest === "Yunnan Journey" ? <p><a href={siteConfig.sampleItineraryPdf} download>{t("downloadSample")}</a></p> : null}
      <a className="button button-blue" href={whatsappHref}>{t("continueWhatsapp")}</a>
    </div>
  ) : (
    <form className={`contact-form quick-ask-form${plain ? " quick-ask-plain-form" : ""}`} method="post" action="/api/enquiry" onSubmit={handleSubmit}>
      {plain ? (
        <>
          <div className="quick-ask-plain-row">
            <label>
              <span>{t("plainName")}</span>
              <input name="name" type="text" autoComplete="name" required maxLength={100} placeholder={t("namePlaceholder")} onInvalid={(event) => event.preventDefault()} />
              <small className="plain-field-error">{t("fieldRequired")}</small>
            </label>
            <label>
              <span>{t("email")}</span>
              <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@email.com" onInvalid={(event) => event.preventDefault()} />
              <small className="plain-field-error">{t("fieldRequired")}</small>
            </label>
            <label>
              <span>{t("travelMonth")}</span>
              <select name="travelWindow" defaultValue="" aria-label={t("travelMonth")}>
                <option value="">{t("selectMonth")}</option>
                {travelMonthOptions(locale, t("notSureYet")).map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>{t("travelers")}</span>
              <select name="travelers" defaultValue="2 travelers" aria-label={t("travelers")}>
                {partySizes.map((option) => <option key={option} value={option}>{partySizeLabels[option] ?? option}</option>)}
              </select>
            </label>
            <label className="contact-honeypot" aria-hidden="true">
              <span>Company</span>
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? t("sending") : t("submitTrip")}</button>
          </div>
        </>
      ) : <div className="contact-field-row">
        <label>
          <span>{t("name")}</span>
          <input name="name" type="text" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          <span>{t("email")}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
      </div>}
      {plain ? null : <>
      <label className="contact-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      {intent === "advice" ? (
        <label className="quick-ask-quote">
          <input name="quote" type="checkbox" checked={quoteRequested} onChange={(event) => setQuoteRequested(event.target.checked)} />
          <span>{t("quoteCheckbox")}</span>
        </label>
      ) : null}
      {intent === "trip" || quoteRequested ? (
        <div className="quick-ask-facts">
          <label>
            <span>{t("when")}</span>
            <select name="travelWindow" defaultValue="">
              <option value="">{t("notSureYet")}</option>
              {travelWindows.map((option) => <option key={option} value={option}>{travelWindowLabels[option] ?? option}</option>)}
            </select>
          </label>
          <label>
            <span>{t("travelers")}</span>
            <select name="travelers" defaultValue="">
              <option value="">{t("notSureYet")}</option>
              {partySizes.map((option) => <option key={option} value={option}>{partySizeLabels[option] ?? option}</option>)}
            </select>
          </label>
          <label>
            <span>{t("budgetPerPerson")}</span>
            <select name="budget" defaultValue="">
              <option value="">{t("pleaseAdvise")}</option>
              {budgetBands.filter((option) => option !== "Please advise").map((option) => <option key={option} value={option}>{budgetBandLabels[option] ?? option}</option>)}
            </select>
          </label>
        </div>
      ) : null}
      <label>
        <span>{intent === "trip" ? t("plansLabelTrip") : t("plansLabelAdvice")} <small>{intent === "trip" ? t("optional") : ""}</small></span>
        <textarea name="plans" rows={intent === "trip" ? 3 : 4} required={intent === "advice" && !quoteRequested} placeholder={intent === "trip" || quoteRequested ? t("plansPlaceholderTrip") : t("plansPlaceholderAdvice")} />
      </label>
      <div className="quick-ask-actions">
        <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? t("sending") : intent === "trip" || quoteRequested ? t("submitTrip") : t("submitAdvice")}</button>
        <a href={standbyWhatsapp}>{t("whatsappAlt")}</a>
      </div>
      {status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>{t("sendOnWhatsapp")}</a> : null}</p> : null}
      <p className="contact-form-note">{t("formNote", { replyTime: t("replyTime") })}</p>
      </>}
      {plain && status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>{t("sendOnWhatsapp")}</a> : null}</p> : null}
    </form>
  );

  if (layout === "embedded" || layout === "plain") return <div id={id} className="quick-ask-embedded">{form}</div>;

  const title = intent === "trip" ? t("bandTitleTrip") : t("bandTitleAdvice");
  const copy = intent === "trip" ? t("bandCopyTrip", { sourceTitle }) : t("bandCopyAdvice");

  return (
    <section className="quick-ask" id={id}>
      <div className="shell quick-ask-layout">
        <div>
          <p>{t("bandKicker")}</p>
          <h2>{title}</h2>
          <span>{copy}</span>
        </div>
        {form}
      </div>
    </section>
  );
}
