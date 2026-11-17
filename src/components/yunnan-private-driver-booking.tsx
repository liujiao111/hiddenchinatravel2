"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { LocaleLink as Link } from "@/components/locale-link";

type Locale = "en" | "zh";
type ServiceId = "dali-lijiang" | "lijiang-dali" | "dali-day";
type FormKind = "standard" | "custom";

const services: { id: ServiceId; en: string; zh: string; detailEn: string; detailZh: string; photo: string; alt: string; notesEn: string[]; notesZh: string[] }[] = [
  { id: "dali-lijiang", en: "Dali to Lijiang Private Transfer", zh: "大理 → 丽江 · 私人接送", detailEn: "Direct hotel-to-hotel transfer between agreed service areas.", detailZh: "在双方确认的服务区域内，酒店到酒店直接接送。", photo: "/assets/partners/vehicles/five-seat-toyota.webp", alt: "Real five-seat vehicle category example", notesEn: ["Five-seat vehicle · 1–3 travellers", "Up to 3 large cases, subject to size", "Direct transfer; no sightseeing stops", "Expressway tolls quoted separately"], notesZh: ["5 座车 · 1–3 位旅客", "最多 3 个大箱，需核实尺寸", "直达接送，不含沿途游览", "高速过路费另计"] },
  { id: "lijiang-dali", en: "Lijiang to Dali Private Transfer", zh: "丽江 → 大理 · 私人接送", detailEn: "Return-direction transfer, with flexible hotel pickup points.", detailZh: "丽江出发至大理，在约定区域内安排酒店接送。", photo: "/assets/partners/vehicles/five-seat-hongqi.webp", alt: "Real five-seat vehicle category example", notesEn: ["Five-seat vehicle · 1–3 travellers", "Up to 3 large cases, subject to size", "Direct transfer; no sightseeing stops", "Expressway tolls quoted separately"], notesZh: ["5 座车 · 1–3 位旅客", "最多 3 个大箱，需核实尺寸", "直达接送，不含沿途游览", "高速过路费另计"] },
  { id: "dali-day", en: "Dali Private Car for One Day", zh: "大理 9 小时私人包车", detailEn: "Local driver and private car from 9:00 AM to 6:00 PM within a pre-agreed Dali route.", detailZh: "09:00–18:00 包车 9 小时，具体路线需在已确认的大理服务区域内。", photo: "/assets/partners/vehicles/five-seat-aion.webp", alt: "Real five-seat vehicle category example", notesEn: ["9:00 AM–6:00 PM service", "Driver, fuel and standard parking", "Tolls and attraction tickets excluded", "Route and mileage confirmed first"], notesZh: ["09:00–18:00 · 9 小时", "含司机、燃油、常规停车费", "不含高速费和景区门票", "行驶路线与里程需事先确认"] },
];

function DriverEnquiryForm({ locale, kind, serviceId }: { locale: Locale; kind: FormKind; serviceId?: ServiceId }) {
  const zh = locale === "zh";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const idRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const service = services.find(s => s.id === serviceId);
  const title = kind === "custom" ? (zh ? "提交自定义包车路线" : "Request a Custom Driver Quote") : (zh ? "查询日期与车辆" : "Check Your Date & Vehicle");
  const formName = kind === "custom" ? "yunnan_driver_custom" : "yunnan_driver_standard";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "success") return;
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "").trim();
    const whatsapp = String(values.get("whatsapp") || "").trim();
    if (!email && !whatsapp) {
      setError(zh ? "请留下邮箱或 WhatsApp，至少填写一项。" : "Please provide either an email address or WhatsApp number.");
      setStatus("error");
      return;
    }
    if (whatsapp && (!/^\+[0-9\s().-]{7,24}$/.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8)) {
      setError(zh ? "请填写带国家区号的 WhatsApp 号码。" : "Please enter WhatsApp with a country code, such as +65 1234 5678.");
      setStatus("error");
      return;
    }
    idRef.current ??= crypto.randomUUID();
    const adults = Number(values.get("travelers") || "2");
    const children = Number(values.get("children") || "0");
    if (kind === "standard" && adults + children > 3) {
      setError(zh ? "标准5座车最多建议3位乘客，请选择定制包车申请更大车型。" : "Standard five-seat service is limited to three passengers. Please request a larger vehicle through the custom form.");
      setStatus("error");
      return;
    }
    const route = String(values.get("route") || "");
    const pickup = String(values.get("pickup") || "");
    const dropoff = String(values.get("dropoff") || "");
    const luggage = String(values.get("luggage") || "");
    if (kind === "standard" && Number(luggage) > 3) {
      setError(zh ? "标准5座车最多参考3个大箱，超过请提交定制包车申请以核实后备箱空间。" : "For more than three large suitcases, please request a custom vehicle so we can check luggage capacity.");
      setStatus("error");
      return;
    }
    const note = String(values.get("notes") || "");
    const travelDate = String(values.get("date") || "");
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    if (!travelDate || new Date(travelDate + "T00:00:00") < todayLocal) {
      setError(zh ? "请选择今天或之后的服务日期。" : "Please choose today or a future service date.");
      setStatus("error");
      return;
    }
    const travelDays = kind === "custom" ? String(values.get("days") || "") : (serviceId === "dali-day" ? "1 day" : "1 transfer");
    const serviceLabel = service ? service.en : "Custom Yunnan driver service";
    const detail = [
      "Service requested: " + serviceLabel,
      "Preferred date: " + travelDate,
      "Pickup: " + pickup,
      "Drop-off: " + dropoff,
      "Passengers: " + adults + " adults, " + children + " children",
      "Large suitcases: " + luggage,
      "Number of days: " + travelDays,
      "Route / stops: " + route,
      "Other requirements: " + note,
      "Booking stage: enquiry only; no deposit paid and no vehicle confirmed",
      "Source page: " + window.location.href
    ].join("\n").slice(0, 2900);
    const payload = {
      name: String(values.get("name") || ""),
      email, whatsapp, travelTiming: travelDate,
      tripLength: travelDays.slice(0, 80),
      adults, children, destinations: (route || serviceLabel).slice(0, 700),
      budget: "Please advise", comfort: "Please advise", interests: [] as string[],
      notes: detail, website: String(values.get("website") || ""),
      consent: values.get("consent") === "yes",
      attribution: getAttribution(), conversionPage: window.location.pathname,
      requestId: idRef.current,
    };
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/custom-journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.error || "Unable to submit enquiry.");
      trackEvent("generate_lead", { form_name: formName, lead_type: kind === "custom" ? "private_driver_custom" : "private_driver_standard", service_id: serviceId || "custom", event_id: idRef.current, page_path: window.location.pathname });
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (zh ? "提交失败，请重试。" : "Could not submit your request."));
      setStatus("error");
    }
  }

  if (status === "success") {
    return <div className="driver-form-success" role="status">
      <h3>{zh ? "已收到你的包车需求" : "We received your driver request"}</h3>
      <p>{zh ? "我们会核对日期、路线、车辆和价格，再通过你留下的联系方式回复。尚未收取定金，也尚未确认预订。" : "We will check vehicle availability, route and the total price, then reply using your contact details. No deposit has been taken and the booking is not confirmed."}</p>
      <Link href="/licensed-operator">{zh ? "查看负责签约与收款的持证旅行社" : "View the licensed operator"}</Link>
    </div>;
  }

  return <form className="contact-form driver-form" onSubmit={submit} onFocus={() => { if (!startedRef.current) { startedRef.current = true; trackEvent("driver_enquiry_form_interaction", { form_name: formName, page_path: window.location.pathname }); } }}>
    <h3>{title}</h3>
    {service ? <p className="driver-form-selection">{zh ? "已选服务：" : "Selected service: "} <strong>{zh ? service.zh : service.en}</strong></p> : null}
    <p className="driver-form-note">{zh ? "先核实日期和车源，确认报价后才会安排支付。本表单不会扣费。" : "We verify your date and vehicle first. Payment arrangements follow your confirmed quote. This form does not charge you."}</p>
    <div className="contact-field-row">
      <label><span>{zh ? "服务日期 *" : "Service date *"}</span><input required type="date" name="date" /></label>
      <label><span>{zh ? "成人数 *" : "Adults *"}</span><input required type="number" name="travelers" min="1" max={kind === "custom" ? "20" : "3"} defaultValue="2" /></label>
    </div>
    <div className="contact-field-row">
      <label><span>{zh ? "接车地点 *" : "Pickup point *"}</span><input required name="pickup" maxLength={150} placeholder={zh ? "城市 + 酒店／车站" : "City and hotel / station"} /></label>
      <label><span>{zh ? "送达地点 *" : "Drop-off point *"}</span><input required name="dropoff" maxLength={150} placeholder={zh ? "城市 + 酒店／车站" : "City and hotel / station"} /></label>
    </div>
    <div className="contact-field-row">
      <label><span>{zh ? "儿童人数" : "Children"}</span><input type="number" name="children" min="0" max="20" defaultValue="0" /></label>
      <label><span>{zh ? "大行李箱数量" : "Large suitcases"}</span><input type="number" name="luggage" min="0" max="20" defaultValue="1" /></label>
    </div>
    {kind === "custom" ? <div className="contact-field-row"><label><span>{zh ? "预计天数 *" : "Number of days *"}</span><input name="days" required maxLength={50} placeholder={zh ? "例如 3 天" : "e.g. 3 days"} /></label><label><span>{zh ? "途经地点／停靠计划 *" : "Route and sightseeing stops *"}</span><input required name="route" maxLength={300} placeholder={zh ? "大理－沙溪－丽江" : "Dali – Shaxi – Lijiang"} /></label></div> : serviceId === "dali-day" ? <label><span>{zh ? "当天计划路线 *" : "Your planned route *"}</span><input required name="route" maxLength={300} placeholder={zh ? "计划去的景点和停靠点" : "Stops and sightseeing plan"} /></label> : null}
    <label><span>{zh ? "其他要求" : "Other requirements"} <small>{zh ? "（如儿童座椅、超大行李、出发时间）" : "(child seat, oversized bags, preferred time)"}</small></span><textarea rows={3} name="notes" maxLength={1200} /></label>
    <div className="contact-field-row">
      <label><span>{zh ? "姓名 *" : "Your name *"}</span><input required name="name" type="text" autoComplete="name" maxLength={100} /></label>
      <label><span>{zh ? "邮箱" : "Email"}</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
    </div>
    <label><span>WhatsApp {zh ? "（可与邮箱二选一）" : "(email or WhatsApp required)"}</span><input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} placeholder="+65 1234 5678" /></label>
    <label className="contact-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="driver-form-consent"><input required type="checkbox" name="consent" value="yes" /><span>{zh ? "我同意仅就本次包车咨询接收回复。" : "I agree to be contacted only about this driver enquiry."} <Link href="/privacy-policy">{zh ? "隐私政策" : "Privacy policy"}</Link></span></label>
    {status === "error" ? <p role="alert" className="contact-form-error">{error}</p> : null}
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? (zh ? "正在发送…" : "Sending…") : (zh ? "提交日期与路线查询" : "Send Date & Route Request")}</button>
  </form>;
}

export function StandardTransferSection({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [selected, setSelected] = useState<ServiceId | null>(null);
  function choose(service: ServiceId) {
    setSelected(service);
    trackEvent("driver_standard_transfer_select", { service_id: service, page_path: window.location.pathname });
    requestAnimationFrame(() => document.getElementById("driver-request")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  return <section className="driver-section driver-section-soft" id="standard-transfers">
    <div className="shell">
      <div className="driver-section-head">
        <p className="kicker">{zh ? "标准路线" : "STANDARD TRANSFERS"}</p>
        <h2>{zh ? "标准私人接送服务" : "Standard Private Transfers"}</h2>
        <p>{zh ? "首批提供三种标准车型服务。请先选择项目并提交出行信息；价格、车源与 20% 定金支付链接会在核实后确认。" : "Start with one of three defined services. Check your travel date first; we confirm the vehicle, final price and secure 20% deposit link before any payment."}</p>
      </div>
      <div className="driver-product-grid">
        {services.map(item => <article className="driver-product" key={item.id}>
          <div className="driver-product-photo"><Image src={item.photo} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
          <div className="driver-product-copy">
            <p className="driver-product-kicker">{item.id === "dali-day" ? (zh ? "当日包车" : "ONE-DAY DRIVER") : (zh ? "跨城接送" : "POINT-TO-POINT")}</p>
            <h3>{zh ? item.zh : item.en}</h3>
            <p>{zh ? item.detailZh : item.detailEn}</p>
            <ul>{(zh ? item.notesZh : item.notesEn).map(note => <li key={note}>{note}</li>)}</ul>
            <p className="driver-product-price">{zh ? "价格按确认路线报价" : "Price on confirmed route"} <small>{zh ? "20% 定金 · 车源确认后安排" : "20% deposit after availability check"}</small></p>
            <button className="button button-blue" type="button" onClick={() => choose(item.id)}>{zh ? "查询日期与价格" : "Check Date & Price"}</button>
          </div>
        </article>)}
      </div>
      {selected ? <div className="driver-booking-panel" id="driver-request" key={selected}><DriverEnquiryForm locale={locale} kind="standard" serviceId={selected} /></div> : <p className="driver-product-footnote">{zh ? "车辆图片为真实车型示例，品牌、型号、颜色及行李空间以预订前确认的实际车辆为准。暂不收取在线定金。" : "Photos are real vehicle-category examples, not a promise of a particular make, colour or luggage capacity. No online deposit is collected yet."}</p>}
    </div>
  </section>;
}

export function CustomDriverForm({ locale }: { locale: Locale }) {
  return <DriverEnquiryForm locale={locale} kind="custom" />;
}
