"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { scheduleScrollToEnquire, scrollToEnquire } from "@/components/enquire-link";
import { enquiryMessage, parseEnquiry, partySizes, type Enquiry } from "@/lib/enquiry";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

function enquirySource() {
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin && referrer.pathname.startsWith("/") && !/[\\s<>]/.test(referrer.pathname)) return referrer.pathname;
  } catch {
    // Direct visits have no usable referrer.
  }
  return "/contact";
}

export function ContactForm() {
  const t = useTranslations("contactForm");
  const tq = useTranslations("quickAsk");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);

  const partySizeLabels = tq.raw("partySizeLabels") as Record<string, string>;

  useEffect(() => {
    scheduleScrollToEnquire();
    window.addEventListener("hashchange", scrollToEnquire);
    return () => window.removeEventListener("hashchange", scrollToEnquire);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const parsed = parseEnquiry({ ...data, source: enquirySource(), allowEmptyPlans: true });
    if ("error" in parsed) {
      setStatus("error");
      setError(parsed.error);
      return;
    }

    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(enquiryMessage(parsed))}`;
    setStatus("sending");
    setError("");
    setWhatsappHref(whatsappUrl);

    const analyticsParams = {
      form_name: "trip_planning_contact",
      travel_window: parsed.travelWindow,
      interest: parsed.interest,
      page_path: window.location.pathname,
    };
    trackEvent("form_submit_attempt", analyticsParams);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed, allowEmptyPlans: true }),
      });
      const result = await response.json().catch(() => ({ error: t("sendError") }));

      if (!response.ok) {
        setStatus("error");
        setError(typeof result.error === "string" ? result.error : t("sendError"));
        return;
      }

      // Count a lead only after the enquiry API confirms successful submission.
      trackEvent("generate_lead", analyticsParams);
      setSent(parsed);
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("sendError"));
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success">
        <h3>{t("successTitle")}</h3>
        <p>{t("successText", { replyTime: tq("replyTime") })}</p>
        {sent ? <p><a href={siteConfig.sampleItineraryPdf} download>{t("successSample")}</a></p> : null}
        <p>{t("successWhatsappNote")}</p>
        <a className="button button-blue" href={whatsappHref}>{t("successWhatsapp")}</a>
      </div>
    );
  }

  return (
    <form className="contact-form contact-enquiry-form" method="post" action="/api/enquiry" onSubmit={handleSubmit}>
      <div className="contact-field-row">
        <label>
          <span>{t("name")}</span>
          <input name="name" type="text" autoComplete="name" placeholder={t("namePlaceholder")} required />
        </label>
        <label>
          <span>{t("email")}</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
      </div>

      <label className="contact-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="new-password" />
      </label>

      <label>
        <span>{t("whatsappLabel")} <small>{t("whatsappHint")}</small></span>
        <input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} placeholder="+65 1234 5678" />
      </label>

      <div className="contact-field-row contact-trip-row">
        <label>
          <span>{t("when")}</span>
          <input name="travelWindow" type="text" maxLength={180} placeholder={t("whenPlaceholder")} required />
        </label>
        <label>
          <span>{t("travelers")}</span>
          <select name="travelers" defaultValue="2 travelers" required>
            {partySizes.map((option) => <option key={option} value={option}>{partySizeLabels[option] ?? option}</option>)}
          </select>
        </label>
      </div>

      <label>
        <span>{t("plansLabel")}</span>
        <textarea
          name="plans"
          rows={7}
          placeholder={t("plansPlaceholder")}
          maxLength={4000}
        />
      </label>

      <button className="button button-blue" type="submit" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("submit")}
      </button>
      {status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>{t("sendOnWhatsapp")}</a> : null}</p> : null}
      <p className="contact-form-note">{t("note")}</p>
    </form>
  );
}
