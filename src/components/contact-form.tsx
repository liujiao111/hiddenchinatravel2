"use client";

import { useEffect, useState, type FormEvent } from "react";
import { scheduleScrollToEnquire, scrollToEnquire } from "@/components/enquire-link";
import { enquiryMessage, parseEnquiry, partySizes, type Enquiry } from "@/lib/enquiry";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

function enquirySource() {
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin && referrer.pathname.startsWith("/") && !/[\s<>]/.test(referrer.pathname)) return referrer.pathname;
  } catch {
    // Direct visits have no usable referrer.
  }
  return "/contact";
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [whatsappHref, setWhatsappHref] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);

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
        <h3>Thank you. Joy has your note.</h3>
        <p>Joy will personally review your enquiry. {siteConfig.replyTime} There is no obligation to book.</p>
        {sent ? <p><a href={siteConfig.sampleItineraryPdf} download>Download the 6-day sample itinerary (PDF)</a></p> : null}
        <p>If you would rather continue on WhatsApp, you can send the same note now.</p>
        <a className="button button-blue" href={whatsappHref}>Send on WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="contact-form contact-enquiry-form" method="post" action="/api/enquiry" onSubmit={handleSubmit}>
      <div className="contact-field-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
      </div>

      <label className="contact-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label>
        <span>WhatsApp <small>Optional, including country code</small></span>
        <input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} placeholder="+65 1234 5678" />
      </label>

      <div className="contact-field-row contact-trip-row">
        <label>
          <span>When would you like to travel?</span>
          <input name="travelWindow" type="text" maxLength={180} placeholder={'Exact dates, approximate month, or “not decided yet”'} required />
        </label>
        <label>
          <span>Number of travelers</span>
          <select name="travelers" defaultValue="" required>
            <option value="" disabled>Select</option>
            {partySizes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <label>
        <span>Tell us about your trip</span>
        <textarea
          name="plans"
          rows={7}
          placeholder={"Which places interest you?\nHow many days are you considering?\nIs there anything you would like us to know, including a rough budget if you have one?"}
          required
        />
      </label>

      <button className="button button-blue" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "PLAN MY YUNNAN TRIP"}
      </button>
      {status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>Send on WhatsApp instead</a> : null}</p> : null}
      <p className="contact-form-note">{siteConfig.replyTime}</p>
      <p className="contact-form-privacy">We respect your privacy. No spam, ever. Your details are only used to plan your trip.</p>
    </form>
  );
}
