"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const partyOptions = [
  { label: "1", count: 1 }, { label: "2", count: 2 },
  { label: "3–4", count: 3 }, { label: "5–6", count: 5 },
  { label: "7–10", count: 7 }, { label: "More than 10", count: 11 },
];

export function PreviewEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const idRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const target = document.getElementById("plan");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("preview-form-visible", entry.isIntersecting);
    }, { threshold: .12 });
    observer.observe(target);
    return () => { observer.disconnect(); document.body.classList.remove("preview-form-visible"); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "success") return;
    const form = new FormData(event.currentTarget);
    idRef.current ??= crypto.randomUUID();
    const partyLabel = String(form.get("partyRange") || "");
    const days = String(form.get("tripLength") || "");
    const travelers = partyOptions.find(x => x.label === partyLabel)?.count ?? 2;
    const whatsapp = String(form.get("whatsapp") || "").trim();
    if (!/^\+[0-9\s().-]{7,24}$/.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8) {
      setError("Please enter your WhatsApp number with its country code, such as +65 1234 5678.");
      setStatus("error");
      return;
    }
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      whatsapp,
      travelTiming: "",
      tripLength: days,
      adults: travelers,
      children: 0,
      destinations: "",
      budget: "Please advise",
      comfort: "Please advise",
      interests: [] as string[],
      notes: ("Travelers selected: " + partyLabel + "\n\n" + String(form.get("notes") || "") + "\n\nEnquiry page: " + window.location.href).slice(0, 3000),
      website: String(form.get("website") || ""),
      consent: form.get("consent") === "yes",
      requestId: idRef.current,
    };
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/custom-journey", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || "We could not send your enquiry.");
      setStatus("success");
      trackEvent("generate_lead", {
        form_name: "custom_journey_enquiry",
        lead_type: "tailor_made_journey",
        page_path: window.location.pathname,
        event_id: idRef.current || undefined,
      });
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Please try again.");
    }
  }

  if (status === "success") return <div className="preview-success" role="status"><h3>Thank you — we received your enquiry.</h3><p>We’ll follow up using your WhatsApp number about a suitable Yunnan route and an initial price. No booking commitment.</p></div>;

  return <form className="contact-form preview-enquiry" onSubmit={submit} onFocus={() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("custom_journey_form_start", { form_name: "custom_journey_enquiry", page_path: window.location.pathname });
    }
  }}>
    <div className="contact-field-row">
      <label><span>Name *</span><input required name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your name" /></label>
      <label><span>Email <small>(optional)</small></span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
    </div>
    <div className="contact-field-row">
      <label><span>WhatsApp *</span><input required name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder="+65 1234 5678 (with country code)" /></label>
      <label><span>Number of travelers *</span><select name="partyRange" defaultValue="2" required>{partyOptions.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</select></label>
    </div>
    <label><span>Approximate trip length *</span><select name="tripLength" required defaultValue=""><option value="" disabled>How many days?</option>{["5–6 days","7–8 days","9–12 days","More than 12 days","Not decided yet"].map(x => <option value={x} key={x}>{x}</option>)}</select></label>
    <label><span>Places, interests or questions <small>(optional)</small></span><textarea name="notes" rows={4} maxLength={2500} placeholder="Tell us anything you'd like Joy to consider…" /></label>
    <label className="contact-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    {status === "error" ? <p className="contact-form-error" role="alert">{error}</p> : null}
    <label className="preview-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree to be contacted about this trip enquiry. My details will only be used to respond to my request. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Me a Suggested Route & Price"}</button>
    <p className="contact-form-note">No payment to enquire. Final prices depend on your travel dates and confirmed services. You can add an email for a written copy of your proposal.</p>
  </form>;
}
