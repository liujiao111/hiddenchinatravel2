"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const years = Array.from({length: 6}, (_, i) => String(currentYear + i));
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
    const travelMonth = String(form.get("travelMonth") || "");
    const travelYear = String(form.get("travelYear") || "");
    if (!travelMonth || !travelYear) { setStatus("error"); setError("Please choose a travel month and year."); return; }
    idRef.current ??= crypto.randomUUID();
    const month = String(form.get("travelMonth") || "");
    const year = String(form.get("travelYear") || "");
    const partyLabel = String(form.get("partyRange") || "");
    const timing = month === "Not decided yet" || year === "Not decided yet" ? "Not decided yet" : month + " " + year;
    const days = String(form.get("tripLength") || "");
    const travelers = partyOptions.find(x => x.label === partyLabel)?.count ?? 2;
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      whatsapp: "",
      travelTiming: timing,
      tripLength: days,
      adults: travelers,
      children: 0,
      destinations: "",
      budget: "Please advise",
      comfort: "Please advise",
      interests: [] as string[],
      notes: ("Travelers selected: " + partyLabel + "\n\n" + String(form.get("notes") || "") + "\n\nEnquiry page: " + window.location.href).slice(0, 3000),
      website: String(form.get("website") || ""),
      consent: true,
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

  if (status === "success") return <div className="preview-success" role="status"><h3>Thank you — your enquiry is on its way to Joy.</h3><p>We'll use your travel month, trip length and group size to suggest a Yunnan route and initial price. No booking commitment.</p></div>;

  return <form className="contact-form preview-enquiry" onSubmit={submit} onFocus={() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("custom_journey_form_start", { form_name: "custom_journey_enquiry", page_path: window.location.pathname });
    }
  }}>
    <div className="contact-field-row">
      <label><span>Name *</span><input required name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your name" /></label>
      <label><span>Email *</span><input required name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
    </div>
    <div className="contact-field-row">
      <label><span>Travel month *</span><select name="travelMonth" required defaultValue=""><option value="" disabled>Select month</option>{months.map(month => <option value={month} key={month}>{month}</option>)}<option value="Not decided yet">Not decided yet</option></select></label>
      <label><span>Travel year *</span><select name="travelYear" required defaultValue=""><option value="" disabled>Select year</option>{years.map(year => <option key={year} value={year}>{year}</option>)}<option value="Not decided yet">Not decided yet</option></select></label>
    </div>
    <div className="contact-field-row">
      <label><span>Number of travelers *</span><select name="partyRange" defaultValue="2" required>{partyOptions.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</select></label>
    </div>
    <label><span>Approximate trip length *</span><select name="tripLength" required defaultValue=""><option value="" disabled>How many days?</option>{["5–6 days","7–8 days","9–12 days","More than 12 days","Not decided yet"].map(x => <option value={x} key={x}>{x}</option>)}</select></label>
    <label><span>Places, interests or questions <small>(optional)</small></span><textarea name="notes" rows={4} maxLength={2500} placeholder="Tell us anything you'd like Joy to consider…" /></label>
    <label className="contact-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    {status === "error" ? <p className="contact-form-error" role="alert">{error}</p> : null}
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Me a Suggested Route & Price"}</button>
    <p className="contact-form-note">No payment or booking commitment. Your details are used only to reply to your enquiry.</p>
  </form>;
}
