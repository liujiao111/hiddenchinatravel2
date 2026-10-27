"use client";

import { useEffect, useState, type FormEvent } from "react";
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

function travelMonthOptions() {
  const options: string[] = [];
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  for (let index = 0; index < 18; index += 1) {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1));
    options.push(date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }));
  }
  options.push("Not sure yet");
  return options;
}

function syncMobileAskBars() {
  const hide = visibleAskTargets.size > 0;
  document.querySelectorAll(".article-mobile-ask").forEach((bar) => {
    bar.classList.toggle("ask-bar-hidden", hide);
  });
}

export function QuickAsk({ source, sourceTitle, intent, id = "ask-joy", layout = "band" }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [whatsappHref, setWhatsappHref] = useState("");
  const [quoteRequested, setQuoteRequested] = useState(intent === "trip");

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

  const plain = layout === "plain";
  const whatsappPrompt = `Hi Joy, I was looking at "${sourceTitle}". I'd like a private Yunnan route and a price range. My dates are ____, we are ____ travelers, and our budget is about ____ per person.`;
  const standbyWhatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappPrompt)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const wantsQuote = intent === "trip" || data.quote === "on";
    const note = String(data.plans ?? "").trim();
    const plans = note || (wantsQuote ? `Please suggest a private Yunnan route and a price range. I was looking at: ${sourceTitle}.` : "");
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
      const result = await response.json().catch(() => ({ error: "We could not send this just now." }));
      if (!response.ok) {
        setStatus("error");
        setError(typeof result.error === "string" ? result.error : "We could not send this just now.");
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
      setError("We could not send this just now.");
    }
  }

  const form = status === "success" && sent ? (
    <div className="contact-form-success quick-ask-success" role="status">
      <h3>{isQuoteReady(sent) ? "Joy has what he needs to quote this route." : "Joy has your note."}</h3>
      <p>
        {isQuoteReady(sent)
          ? "Expect a short route sketch and a price range, with what is included. There is no need to book from that reply."
          : "Joy will answer what you asked. If you want a price, reply with your dates, group size and a budget range."}{" "}
        {siteConfig.replyTime}
      </p>
      {sent.interest === "Yunnan Journey" ? <p><a href={siteConfig.sampleItineraryPdf} download>Download a 6-day sample itinerary (PDF)</a></p> : null}
      <a className="button button-blue" href={whatsappHref}>Continue on WhatsApp</a>
    </div>
  ) : (
    <form className={`contact-form quick-ask-form${plain ? " quick-ask-plain-form" : ""}`} method="post" action="/api/enquiry" onSubmit={handleSubmit}>
      {plain ? (
        <>
          <div className="quick-ask-plain-row">
            <label>
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" onInvalid={(event) => event.preventDefault()} />
              <small className="plain-field-error">Please fill in this field</small>
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@email.com" onInvalid={(event) => event.preventDefault()} />
              <small className="plain-field-error">Please fill in this field</small>
            </label>
            <label>
              <span>Travel Month</span>
              <select name="travelWindow" defaultValue="" aria-label="Travel Month">
                <option value="">Select a month</option>
                {travelMonthOptions().map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label>
              <span>Travelers</span>
              <select name="travelers" defaultValue="2 travelers" aria-label="Travelers">
                {partySizes.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="contact-honeypot" aria-hidden="true">
              <span>Company</span>
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Get My Trip Plan"}</button>
          </div>
        </>
      ) : <div className="contact-field-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          <span>Email</span>
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
          <span>I want a private Yunnan route and a price range</span>
        </label>
      ) : null}
      {intent === "trip" || quoteRequested ? (
        <div className="quick-ask-facts">
          <label>
            <span>When</span>
            <select name="travelWindow" defaultValue="">
              <option value="">Not sure yet</option>
              {travelWindows.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Travelers</span>
            <select name="travelers" defaultValue="">
              <option value="">Not sure yet</option>
              {partySizes.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Budget per person</span>
            <select name="budget" defaultValue="">
              <option value="">Please advise</option>
              {budgetBands.filter((option) => option !== "Please advise").map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
      ) : null}
      <label>
        <span>{intent === "trip" ? "What should this trip include?" : "Your question"} <small>{intent === "trip" ? "(optional)" : ""}</small></span>
        <textarea name="plans" rows={intent === "trip" ? 3 : 4} required={intent === "advice" && !quoteRequested} placeholder={intent === "trip" || quoteRequested ? "Comfort, Premium or Luxury, more time in Dali, or leave this blank for a first suggestion." : "Ask about this guide, or say where you would like to go."} />
      </label>
      <div className="quick-ask-actions">
        <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : intent === "trip" || quoteRequested ? "Get My Trip Plan" : "Ask Joy"}</button>
        <a href={standbyWhatsapp}>Or WhatsApp Joy →</a>
      </div>
      {status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>Send on WhatsApp instead</a> : null}</p> : null}
      <p className="contact-form-note">Dates, group size and budget let Joy reply with a price range. {siteConfig.replyTime} No booking from this form.</p>
      </>}
      {plain && status === "error" ? <p className="contact-form-error">{error} {whatsappHref ? <a href={whatsappHref}>Send on WhatsApp instead</a> : null}</p> : null}
    </form>
  );

  if (layout === "embedded" || layout === "plain") return <div id={id} className="quick-ask-embedded">{form}</div>;

  const title = intent === "trip" ? "Get a route and a price range." : "Planning the trip, not just this guide?";
  const copy = intent === "trip"
    ? `You were looking at ${sourceTitle}. Send your dates, group size and a budget, and Joy will reply with a route sketch and a price range. Nothing is booked from this note.`
    : "Most readers sort the practical question, then get stuck on the route. Ask Joy here, or request a private Yunnan trip with a price range.";

  return (
    <section className="quick-ask" id={id}>
      <div className="shell quick-ask-layout">
        <div>
          <p>ASK JOY</p>
          <h2>{title}</h2>
          <span>{copy}</span>
        </div>
        {form}
      </div>
    </section>
  );
}
