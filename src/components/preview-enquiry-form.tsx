"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { EnquirySelect } from "@/components/enquiry-select";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

const partyOptions = [
  { label: "1", count: 1 }, { label: "2", count: 2 },
  { label: "3–4", count: 3 }, { label: "5–6", count: 5 },
  { label: "7–10", count: 7 }, { label: "More than 10", count: 11 },
];

export function PreviewEnquiryForm({ locale = "en" }: { locale?: "en" | "zh" }) {
  const zh = locale === "zh";
  const today = new Date();
  const monthOptions = Array.from({ length: 36 }, (_, index) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + index, 1));
    return {
      value: date.toISOString().slice(0, 7),
      label: new Intl.DateTimeFormat(zh ? "zh-CN" : "en-GB", { year: "numeric", month: "long", timeZone: "UTC" }).format(date),
    };
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [replyChannel, setReplyChannel] = useState<"whatsapp" | "email">("whatsapp");
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
    const email = String(form.get("email") || "").trim();
    if (!whatsapp && !email) {
      setError(zh ? "请至少填写 WhatsApp 或邮箱其中一项，以便我们回复你的咨询。" : "Please provide either a WhatsApp number or an email address so we can reply.");
      setStatus("error");
      return;
    }
    if (whatsapp && (!/^\+[0-9\s().-]{7,24}$/.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8)) {
      setError(zh ? "请填写带国际区号的 WhatsApp 号码，例如 +65 1234 5678。" : "Please enter your WhatsApp number with its country code, such as +65 1234 5678.");
      setStatus("error");
      return;
    }
    const payload = {
      name: String(form.get("name") || ""),
      email,
      whatsapp,
      travelTiming: String(form.get("travelTiming") || ""),
      attribution: getAttribution(),
      conversionPage: window.location.pathname,
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
      setReplyChannel(whatsapp ? "whatsapp" : "email");
      setStatus("success");
      trackEvent("generate_lead", {
        form_name: "custom_journey_enquiry",
        lead_type: "tailor_made_journey",
        lead_id: idRef.current || undefined,
        page_path: window.location.pathname,
        event_id: idRef.current || undefined,
      });
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : (zh ? "提交失败，请重试。" : "Please try again."));
    }
  }

  if (status === "success") return <div className="preview-success" role="status"><h3>{zh ? "感谢咨询，我们已收到你的旅行需求。" : "Thank you — we received your enquiry."}</h3><p>{zh ? `我们会通过你留下的${replyChannel === "whatsapp" ? " WhatsApp" : "邮箱"}联系你，沟通云南私人路线和初步报价；提交咨询不代表预订。` : `We’ll follow up using your ${replyChannel === "whatsapp" ? "WhatsApp number" : "email address"} about a suitable Yunnan route and an initial price. No booking commitment.`}</p></div>;

  return <form className="contact-form preview-enquiry" onSubmit={submit} onFocus={() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("custom_journey_form_start", { form_name: "custom_journey_enquiry", page_path: window.location.pathname });
    }
  }}>
    <p className="contact-form-note">{zh ? "* 联系方式请至少填写一项：WhatsApp 或邮箱均可。" : "* Please provide at least one contact method: WhatsApp or email."}</p>
    <div className="contact-field-row">
      <label><span>{zh ? "姓名 *" : "Name *"}</span><input required name="name" type="text" autoComplete="name" maxLength={100} placeholder={zh ? "你的姓名" : "Your name"} /></label>
      <label><span>{zh ? "邮箱 *" : "Email *"}</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
    </div>
    <div className="contact-field-row">
      <label><span>WhatsApp *</span><input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder={zh ? "+65 1234 5678（含国际区号）" : "+65 1234 5678 (with country code)"} /></label>
      <EnquirySelect name="partyRange" label={zh ? "出行人数 *" : "Number of travelers *"} placeholder={zh ? "请选择人数" : "Select travelers"} required options={partyOptions.map(p => ({ value: p.label, label: p.label === "More than 10" && zh ? "超过10人" : p.label }))} />
    </div>
    <EnquirySelect name="travelTiming" label={zh ? "大致出行月份（选填）" : "Approximate travel month (optional)"} placeholder={zh ? "请选择具体月份" : "Select a month"} options={[{ value: "", label: zh ? "尚未决定" : "Not decided yet" }, ...monthOptions]} />
    <EnquirySelect name="tripLength" label={zh ? "预计出行天数 *" : "Approximate trip length *"} placeholder={zh ? "计划玩几天？" : "How many days?"} required options={["5–6 days", "7–8 days", "9–12 days", "More than 12 days", "Not decided yet"].map((value, i) => ({ value, label: zh ? ["5–6天", "7–8天", "9–12天", "超过12天", "还没决定"][i] : value }))} />
    <label><span>{zh ? "目的地、兴趣或问题" : "Places, interests or questions"} <small>{zh ? "（选填）" : "(optional)"}</small></span><textarea name="notes" rows={4} maxLength={2500} placeholder={zh ? "告诉 Joy 你想去哪里、喜欢什么体验，或者其他旅行需求……" : "Tell us anything you'd like Joy to consider…"} /></label>
    <label className="contact-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    {status === "error" ? <p className="contact-form-error" role="alert">{error}</p> : null}
    <label className="preview-consent"><input type="checkbox" name="consent" value="yes" required /><span>{zh ? "我同意 Hidden China Travel 为回复本次旅行咨询而联系我；个人信息仅用于处理此次咨询。" : "I agree to be contacted about this trip enquiry. My details will only be used to respond to my request."} <a href={zh ? "/zh/privacy-policy" : "/privacy-policy"} target="_blank" rel="noopener noreferrer">{zh ? "隐私政策" : "Privacy Policy"}</a>.</span></label>
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? (zh ? "正在发送……" : "Sending…") : (zh ? "提交需求，获取定制路线与报价" : "Send Me a Suggested Route & Price")}</button>
    <p className="contact-form-note">{zh ? "免费咨询，无需预付款。最终报价取决于出行日期和确认服务；可选填邮箱以接收书面方案。" : "No payment to enquire. Final prices depend on your travel dates and confirmed services. You can add an email for a written copy of your proposal."}</p>
  </form>;
}
