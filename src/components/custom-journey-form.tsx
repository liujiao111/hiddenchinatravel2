"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { journeyBudgets, journeyComfort, journeyInterests } from "@/lib/custom-journey-enquiry";
import { trackEvent } from "@/lib/analytics";

export function CustomJourneyForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef<string | null>(null);
  const started = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    const fields = Object.fromEntries(["name", "email", "whatsapp", "travelTiming", "tripLength", "destinations", "budget", "comfort", "notes", "website"].map(key => [key, String(data.get(key) || "")]));
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/custom-journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, adults: Number(data.get("adults")), children: Number(data.get("children")), interests: data.getAll("interests"), consent: data.get("consent") === "on", requestId: requestId.current }) });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "We could not send your enquiry. Please try again.");
      setStatus("success");
      trackEvent("generate_lead", { form_name: "custom_journey_enquiry", page_path: "/custom-china-tour", lead_type: "tailor_made_journey" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send your enquiry. Please try again or contact Joy below.");
    }
  }

  if (status === "success") return <div className="custom-enquiry-success" role="status"><h3>Your enquiry has been sent.</h3><p>Thank you. Joy will review your ideas and reply by email to discuss the route and next steps.</p><p>You are requesting a proposal, not making a booking.</p><Link href="/journeys">Explore our journey ideas →</Link></div>;

  return <form className="contact-form custom-enquiry-form" onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; trackEvent("custom_journey_form_start", { form_name: "custom_journey_enquiry", page_path: "/custom-china-tour" }); } }}>
    <div className="contact-field-row"><label><span>Your name *</span><input name="name" autoComplete="name" type="text" maxLength={100} required /></label><label><span>Email *</span><input name="email" autoComplete="email" type="email" maxLength={254} required /></label></div>
    <label><span>WhatsApp <small>(optional, including country code)</small></span><input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} /></label>
    <div className="contact-field-row"><label><span>When would you like to travel?</span><input name="travelTiming" type="text" placeholder="Dates, a month, or flexible" maxLength={100} /></label><label><span>How long would you like to stay?</span><input name="tripLength" type="text" placeholder="For example, 8–10 days" maxLength={80} /></label></div>
    <fieldset><legend>Your party</legend><div className="contact-field-row"><label><span>Adults *</span><input name="adults" type="number" min={1} max={30} defaultValue={2} required /></label><label><span>Children</span><input name="children" type="number" min={0} max={20} defaultValue={0} required /></label></div></fieldset>
    <label><span>Where would you like to go?</span><input name="destinations" type="text" maxLength={300} placeholder="Yunnan, specific places, or please suggest" /></label>
    <div className="contact-field-row"><label><span>Budget per person <small>(USD, excluding international flights)</small></span><select name="budget" defaultValue="Please advise">{journeyBudgets.map(option => <option key={option}>{option}</option>)}</select></label><label><span>Preferred stays</span><select name="comfort" defaultValue="Please advise">{journeyComfort.map(option => <option key={option}>{option}</option>)}</select></label></div>
    <fieldset><legend>What would you like more time for?</legend><div className="custom-interest-options">{journeyInterests.map(interest => <label key={interest}><input type="checkbox" name="interests" value={interest} /><span>{interest}</span></label>)}</div></fieldset>
    <label><span>Anything else we should know?</span><textarea name="notes" rows={4} maxLength={3000} placeholder="Places to add or avoid, children’s ages, preferred pace, dietary needs, or an itinerary you already have." /></label>
    <div className="custom-form-trap" aria-hidden="true"><label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="custom-consent"><input name="consent" type="checkbox" required /><span>I agree that my details may be used to respond to this enquiry. <Link href="/privacy-policy">Privacy policy</Link>.</span></label>
    {status === "error" ? <p className="custom-form-error" role="alert">{message}</p> : null}
    <button className="button journey-primary-action" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING YOUR ENQUIRY…" : "REQUEST MY PRIVATE JOURNEY →"}</button>
    <p className="contact-form-note">A rough idea is enough. We’ll clarify the details with you before preparing a proposal.</p>
  </form>;
}
