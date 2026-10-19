"use client";

import { useEffect, useState, type FormEvent } from "react";
import { scheduleScrollToEnquire, scrollToEnquire } from "@/components/enquire-link";
import { budgetBands, enquiryMessage, interests, isQuoteReady, parseEnquiry, partySizes, travelWindows, type Enquiry } from "@/lib/enquiry";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

type Props = {
  defaultInterest?: string;
};

function enquirySource() {
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin && referrer.pathname.startsWith("/") && !/[\s<>]/.test(referrer.pathname)) return referrer.pathname;
  } catch {
    // Direct visits have no usable referrer.
  }
  return "/contact";
}

export function ContactForm({ defaultInterest }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);
  const selectedInterest = interests.includes(defaultInterest as (typeof interests)[number]) ? defaultInterest : "Yunnan Journey";

  useEffect(() => {
    scheduleScrollToEnquire();
    window.addEventListener("hashchange", scrollToEnquire);
    return () => window.removeEventListener("hashchange", scrollToEnquire);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const parsed = parseEnquiry({ ...data, source: enquirySource() });
    if ("error" in parsed) {
      setStatus("error");
      setError(parsed.error);
      return;
    }

    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(enquiryMessage(parsed))}`;
    setStatus("sending");
    setError("");
    setWhatsappHref(whatsappUrl);

    trackEvent("contact_form_submit", {
      form_name: "trip_planning_contact",
      travel_window: parsed.travelWindow,
      interest: parsed.interest,
      page_path: window.location.pathname,
    });

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const result = await response.json().catch(() => ({ error: "We could not send this just now." }));

      if (!response.ok) {
        setStatus("error");
        setError(typeof result.error === "string" ? result.error : "We could not send this just now.");
        return;
      }

      setSent(parsed);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not send this just now.");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success">
        <h3>{sent && isQuoteReady(sent) ? "Thank you. Joy can price a route from this." : "Thank you. Joy has your note."}</h3>
        <p>{sent && isQuoteReady(sent) ? "He will reply with a route sketch and a price range, including what is covered." : "He will personally review your enquiry and reply with initial suggestions. Add dates, group size and a budget if you would like a price."} {siteConfig.replyTime} There is no obligation to book.</p>
        <p><a href={siteConfig.sampleItineraryPdf} download>Download the 6-day sample itinerary (PDF)</a></p>
        <p>If you would rather continue on WhatsApp, you can send the same note now.</p>
        <a className="button button-blue" href={whatsappHref}>Send on WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-field-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>

      <label className="contact-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label>
        <span>WhatsApp <small>(recommended)</small></span>
        <input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} />
      </label>

      <fieldset>
        <legend>When are you thinking of traveling?</legend>
        <div className="contact-options">
          {travelWindows.map((option, index) => (
            <label key={option}>
              <input name="travelWindow" type="radio" value={option} required={index === 0} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>What are you hoping to plan?</legend>
        <div className="contact-options">
          {interests.map((option) => (
            <label key={option}>
              <input name="interest" type="radio" value={option} defaultChecked={option === selectedInterest} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-field-row">
        <label>
          <span>Travelers <small>(helps Joy price a route)</small></span>
          <select name="travelers" defaultValue="">
            <option value="">Add if you know</option>
            {partySizes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Budget per person <small>(USD, excluding flights)</small></span>
          <select name="budget" defaultValue="">
            <option value="">Add if you know</option>
            {budgetBands.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <label>
        <span>Where are you thinking of going?</span>
        <textarea
          name="plans"
          rows={7}
          placeholder={"Where would you like to go?\nHow many days are you considering?\nWhat questions can we help answer?"}
          required
        />
      </label>

      <button className="button button-blue" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send to Joy"}
      </button>
      {status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>Send on WhatsApp instead</a> : null}</p> : null}
      <p className="contact-form-note">Dates, group size and budget let Joy reply with a route and a price range. {siteConfig.replyTime}</p>
      <p className="contact-form-privacy">We respect your privacy. No spam, ever. Your details are only used to plan your trip.</p>
    </form>
  );
}
