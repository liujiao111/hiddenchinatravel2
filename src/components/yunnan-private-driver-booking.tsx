"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { LocaleLink as Link } from "@/components/locale-link";

type Locale = "en" | "zh";
type Category = "arrival" | "intercity" | "day";
type ProductId =
  | "kunming-arrival" | "dali-arrival" | "lijiang-arrival"
  | "dali-lijiang-direct" | "dali-lijiang-shaxi" | "lijiang-shangri-la" | "lijiang-tlg-shangri-la"
  | "dali-day" | "lijiang-day" | "shangri-la-day";
type FormKind = "standard" | "custom";
type NamedOption = { value: string; en: string; zh: string };
type Product = {
  id: ProductId; category: Category; en: string; zh: string;
  detailEn: string; detailZh: string; photo: string;
  routes?: NamedOption[]; hubs?: NamedOption[];
};

const products: Product[] = [
  {
    id: "kunming-arrival", category: "arrival",
    en: "Kunming Arrival Transfers", zh: "昆明机场与车站接送",
    detailEn: "Choose an airport or railway station and your transfer direction.",
    detailZh: "选择机场或火车站及接送方向。",
    photo: "/assets/blog/kunming-travel-guide/kunming-city.webp",
    hubs: [
      { value: "Kunming Changshui International Airport", en: "Kunming Changshui Airport (KMG)", zh: "昆明长水国际机场（KMG）" },
      { value: "Kunming Railway Station", en: "Kunming Railway Station", zh: "昆明站" },
      { value: "Kunming South Railway Station", en: "Kunming South Railway Station", zh: "昆明南站" },
    ]
  },
  {
    id: "dali-arrival", category: "arrival",
    en: "Dali Arrival Transfers", zh: "大理机场与车站接送",
    detailEn: "Travel between your Dali hotel and the selected airport or station.",
    detailZh: "选择大理机场／火车站与酒店之间的接送方向。",
    photo: "/assets/destinations/yunnan/dali-erhai-cover.webp",
    hubs: [
      { value: "Dali Fengyi Airport", en: "Dali Fengyi Airport (DLU)", zh: "大理凤仪机场（DLU）" },
      { value: "Dali Railway Station", en: "Dali Railway Station", zh: "大理站" },
    ]
  },
  {
    id: "lijiang-arrival", category: "arrival",
    en: "Lijiang Arrival Transfers", zh: "丽江机场与车站接送",
    detailEn: "Private pickups and drop-offs for Lijiang, Shuhe and nearby hotels.",
    detailZh: "丽江古城、束河及周边酒店的私人接送服务。",
    photo: "/assets/destinations/yunnan/lijiang.webp",
    hubs: [
      { value: "Lijiang Sanyi International Airport", en: "Lijiang Sanyi Airport (LJG)", zh: "丽江三义国际机场（LJG）" },
      { value: "Lijiang Railway Station", en: "Lijiang Railway Station", zh: "丽江站" },
    ]
  },
  {
    id: "dali-lijiang-direct", category: "intercity",
    en: "Dali ⇄ Lijiang Direct", zh: "大理 ⇄ 丽江 · 直达",
    detailEn: "Direct hotel-to-hotel service without sightseeing stops.",
    detailZh: "酒店到酒店直达，不含观光停靠。",
    photo: "/assets/partners/vehicles/five-seat-toyota.webp",
    routes: [
      { value: "Dali → Lijiang direct", en: "Dali → Lijiang", zh: "大理 → 丽江" },
      { value: "Lijiang → Dali direct", en: "Lijiang → Dali", zh: "丽江 → 大理" },
    ]
  },
  {
    id: "dali-lijiang-shaxi", category: "intercity",
    en: "Dali ⇄ Lijiang via Shaxi", zh: "大理 ⇄ 丽江 · 途经沙溪",
    detailEn: "A scenic transfer with an agreed stop in Shaxi Ancient Town.",
    detailZh: "在沙溪古镇停留，观光时间需提前约定。",
    photo: "/assets/destinations/yunnan/shaxi.webp",
    routes: [
      { value: "Dali → Shaxi → Lijiang", en: "Dali → Shaxi → Lijiang", zh: "大理 → 沙溪 → 丽江" },
      { value: "Lijiang → Shaxi → Dali", en: "Lijiang → Shaxi → Dali", zh: "丽江 → 沙溪 → 大理" },
    ]
  },
  {
    id: "lijiang-shangri-la", category: "intercity",
    en: "Lijiang ⇄ Shangri-La", zh: "丽江 ⇄ 香格里拉",
    detailEn: "Private transfer between Lijiang and Shangri-La.",
    detailZh: "丽江与香格里拉之间的私人接送。",
    photo: "/assets/destinations/yunnan/shangri-la.webp",
    routes: [
      { value: "Lijiang → Shangri-La", en: "Lijiang → Shangri-La", zh: "丽江 → 香格里拉" },
      { value: "Shangri-La → Lijiang", en: "Shangri-La → Lijiang", zh: "香格里拉 → 丽江" },
    ]
  },
  {
    id: "lijiang-tlg-shangri-la", category: "intercity",
    en: "Lijiang → Tiger Leaping Gorge → Shangri-La",
    zh: "丽江 → 虎跳峡 → 香格里拉",
    detailEn: "One-way journey with a planned Tiger Leaping Gorge visit.",
    detailZh: "单向路线，包含提前约定的虎跳峡停留。",
    photo: "/assets/destinations/yunnan/tiger-leaping.webp",
    routes: [{ value: "Lijiang → Tiger Leaping Gorge → Shangri-La", en: "Lijiang → Tiger Leaping Gorge → Shangri-La", zh: "丽江 → 虎跳峡 → 香格里拉" }]
  },
  {
    id: "dali-day", category: "day",
    en: "Dali 9-Hour Car Charter", zh: "大理 9 小时包车",
    detailEn: "Private driver for a planned day within the confirmed Dali service area.",
    detailZh: "在已确认的大理服务范围内按路线安排用车。",
    photo: "/assets/partners/vehicles/five-seat-aion.webp",
  },
  {
    id: "lijiang-day", category: "day",
    en: "Lijiang 9-Hour Car Charter", zh: "丽江 9 小时包车",
    detailEn: "A flexible day of locally agreed stops around Lijiang.",
    detailZh: "在丽江周边约定服务范围内灵活安排停靠。",
    photo: "/assets/partners/vehicles/five-seat-hongqi.webp",
  },
  {
    id: "shangri-la-day", category: "day",
    en: "Shangri-La 9-Hour Car Charter", zh: "香格里拉 9 小时包车",
    detailEn: "A local driver for a pre-agreed Shangri-La day route.",
    detailZh: "提前确认香格里拉当地路线和实际驾驶范围。",
    photo: "/assets/destinations/yunnan/shangri-la.webp",
  },
];

const arrivalDirections: NamedOption[] = [
  { value: "Hub to hotel", en: "Airport / station → hotel", zh: "机场／车站 → 酒店（接机／接站）" },
  { value: "Hotel to hub", en: "Hotel → airport / station", zh: "酒店 → 机场／车站（送机／送站）" },
];

function DriverEnquiryForm({ locale, kind, serviceId }: { locale: Locale; kind: FormKind; serviceId?: ProductId }) {
  const zh = locale === "zh";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const idRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const service = products.find(p => p.id === serviceId);
  const isArrival = service?.category === "arrival";
  const isDay = service?.category === "day";
  const isIntercity = service?.category === "intercity";
  const title = kind === "custom" ? (zh ? "提交定制／多日包车需求" : "Request a Custom or Multi-Day Driver") : (zh ? "选择服务选项与日期" : "Select Your Transfer Details");
  const formName = kind === "custom" ? "yunnan_driver_custom" : "yunnan_driver_product";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "success") return;
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email") || "").trim();
    const whatsapp = String(values.get("whatsapp") || "").trim();
    if (!email && !whatsapp) {
      setError(zh ? "邮箱或 WhatsApp 至少填写一项。" : "Please enter either an email address or WhatsApp number.");
      setStatus("error"); return;
    }
    if (whatsapp && (!/^\+[0-9\s().-]{7,24}$/.test(whatsapp) || whatsapp.replace(/\D/g, "").length < 8)) {
      setError(zh ? "请填写带国家区号的 WhatsApp 号码。" : "Please include your WhatsApp country code, e.g. +65 1234 5678.");
      setStatus("error"); return;
    }
    const adults = Number(values.get("travelers") || 0);
    const children = Number(values.get("children") || 0);
    const luggage = Number(values.get("luggage") || 0);
    const vehicle = String(values.get("vehicle") || "Five-seat car");
    if (kind === "standard" && vehicle === "Five-seat car" && (adults + children > 3 || luggage > 3)) {
      setError(zh ? "标准5座车型建议最多3位乘客、3个大箱；请选择更大车型询价。" : "For over 3 passengers or 3 large cases, select a larger vehicle to request a quote.");
      setStatus("error"); return;
    }
    const travelDate = String(values.get("date") || "");
    const localToday = new Date(); localToday.setHours(0, 0, 0, 0);
    if (!travelDate || new Date(travelDate + "T00:00:00") < localToday) {
      setError(zh ? "请选择今天或之后的服务日期。" : "Please select today or a future date.");
      setStatus("error"); return;
    }
    const hub = String(values.get("hub") || "");
    const direction = String(values.get("direction") || "");
    const hotel = String(values.get("hotel") || "");
    if (isArrival && (!service?.hubs?.some(h => h.value === hub) || !arrivalDirections.some(d => d.value === direction))) {
      setError(zh ? "请选择有效的机场／车站和接送方向。" : "Select a valid airport / station and transfer direction.");
      setStatus("error"); return;
    }
    if (isIntercity && !service?.routes?.some(r => r.value === direction)) {
      setError(zh ? "请选择路线方向。" : "Select a valid route direction.");
      setStatus("error"); return;
    }
    const pickup = isArrival ? (direction === "Hub to hotel" ? hub : hotel) : String(values.get("pickup") || "");
    const dropoff = isArrival ? (direction === "Hub to hotel" ? hotel : hub) : (String(values.get("dropoff") || "") || (isDay ? pickup : ""));
    const route = String(values.get("route") || "");
    const notes = String(values.get("notes") || "");
    const days = kind === "custom" ? String(values.get("days") || "") : isDay ? "1 day / 9 hours" : "1 transfer";
    const serviceName = service?.en || "Custom & Multi-Day Driver";
    idRef.current ??= crypto.randomUUID();
    const detail = [
      "PRODUCT ID: " + (service?.id || "custom-multi-day"),
      "CATEGORY: " + (service?.category || "custom"),
      "Service: " + serviceName,
      "Travel date: " + travelDate,
      "Direction / selected route: " + (direction || "Custom"),
      "Airport / railway station: " + (hub || "Not applicable"),
      "Arrival / departure flight or train: " + String(values.get("transportNumber") || "Not supplied"),
      "Pickup: " + pickup,
      "Drop-off: " + dropoff,
      "Vehicle requested: " + vehicle,
      "Passengers: " + adults + " adults, " + children + " children",
      "Large suitcases: " + luggage,
      "Duration: " + days,
      "Stops / day plan: " + route,
      "Requirements: " + notes,
      "Status: enquiry only; no price, vehicle or payment confirmed",
      "Source page: " + window.location.href,
    ].join("\n").slice(0, 2900);
    const payload = {
      name: String(values.get("name") || ""),
      email, whatsapp, travelTiming: travelDate,
      tripLength: days.slice(0, 80), adults, children,
      destinations: (direction || route || serviceName).slice(0, 700),
      budget: "Please advise", comfort: "Please advise", interests: [] as string[],
      notes: detail, website: String(values.get("website") || ""),
      consent: values.get("consent") === "yes",
      attribution: getAttribution(), conversionPage: window.location.pathname,
      requestId: idRef.current,
    };
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/custom-journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.error || "Could not send your request.");
      trackEvent("generate_lead", {
        form_name: formName, lead_type: kind === "custom" ? "private_driver_custom" : "private_driver_product",
        product_id: service?.id || "custom-multi-day", service_category: service?.category || "custom",
        service_direction: direction || undefined, vehicle_requested: vehicle,
        event_id: idRef.current, page_path: window.location.pathname,
      });
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (zh ? "发送失败，请重试。" : "Please try again."));
      setStatus("error");
    }
  }

  if (status === "success") return <div className="driver-form-success" role="status">
    <h3>{zh ? "已收到包车需求" : "We received your driver request"}</h3>
    <p>{zh ? "我们会确认路线、车型、车源和价格，再联系你。尚未收取任何定金，预订也尚未确认。" : "We will verify the route, car and total price and contact you. No deposit was taken and this is not yet a confirmed booking."}</p>
    <Link href="/licensed-operator">{zh ? "查看持证旅行社信息" : "View the licensed operator"}</Link>
  </div>;

  return <form className="contact-form driver-form" onSubmit={submit} onFocus={() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("driver_enquiry_form_start", { form_name: formName, product_id: service?.id || "custom-multi-day", page_path: window.location.pathname });
    }
  }}>
    <h3>{title}</h3>
    {service ? <p className="driver-form-selection">{zh ? "当前产品：" : "Your product: "}<strong>{zh ? service.zh : service.en}</strong></p> : null}
    <p className="driver-form-note">{zh ? "选择路线选项并发送需求。车辆和总价核实后才安排付款，此表单不收取费用。" : "Select your options and request a quote. We check vehicle availability and total cost before arranging payment; this form is free."}</p>
    {service?.category === "arrival" ? <>
      <div className="contact-field-row">
        <label><span>{zh ? "选择机场／火车站 *" : "Airport / railway station *"}</span>
          <select name="hub" required defaultValue=""><option value="" disabled>{zh ? "请选择" : "Choose a hub"}</option>
            {service.hubs?.map(h => <option key={h.value} value={h.value}>{zh ? h.zh : h.en}</option>)}
          </select>
        </label>
        <label><span>{zh ? "接送方向 *" : "Transfer direction *"}</span>
          <select name="direction" required defaultValue=""><option value="" disabled>{zh ? "请选择方向" : "Choose direction"}</option>
            {arrivalDirections.map(d => <option key={d.value} value={d.value}>{zh ? d.zh : d.en}</option>)}
          </select>
        </label>
      </div>
      <div className="contact-field-row">
        <label><span>{zh ? "酒店名称或详细地址 *" : "Hotel name / full address *"}</span><input name="hotel" required maxLength={150} placeholder={zh ? "例如：大理古城某酒店" : "Hotel and address"} /></label>
        <label><span>{zh ? "航班号／车次（选填）" : "Flight / train number (optional)"}</span><input name="transportNumber" maxLength={40} placeholder={zh ? "例如：MU1234" : "e.g. MU1234"} /></label>
      </div>
    </> : null}
    {isIntercity ? <>
      <label><span>{zh ? "选择路线及方向 *" : "Route and direction *"}</span>
        <select name="direction" required defaultValue={service.routes?.length === 1 ? service.routes[0].value : ""}>
          {service.routes?.length !== 1 ? <option value="" disabled>{zh ? "请选择方向" : "Choose direction"}</option> : null}
          {service.routes?.map(r => <option key={r.value} value={r.value}>{zh ? r.zh : r.en}</option>)}
        </select>
      </label>
      {service.id === "dali-lijiang-shaxi" || service.id === "lijiang-tlg-shangri-la" ? <label><span>{zh ? "途中停留／计划参观内容" : "Sightseeing stops / time on site"}</span><input name="route" maxLength={300} placeholder={zh ? "希望停留多久、计划游览什么？" : "Preferred stops and time at each"} /></label> : null}
    </> : null}
    {!isArrival ? <div className="contact-field-row">
      <label><span>{zh ? "出发酒店／地点 *" : "Pickup hotel / location *"}</span><input required name="pickup" maxLength={150} placeholder={zh ? "完整地点或酒店名" : "Hotel or pickup address"} /></label>
      <label><span>{isDay ? (zh ? "结束地点（选填）" : "Drop-off location (optional)") : (zh ? "送达酒店／地点 *" : "Drop-off hotel / location *")}</span><input required={!isDay} name="dropoff" maxLength={150} placeholder={isDay ? (zh ? "留空则与出发地相同" : "Same as pickup if blank") : (zh ? "完整地点或酒店名" : "Hotel or destination address")} /></label>
    </div> : null}
    {isDay ? <label><span>{zh ? "当天计划路线及停靠点 *" : "Planned day route and stops *"}</span><input required name="route" maxLength={300} placeholder={zh ? "例如：酒店－周边景区－酒店" : "Hotel – sights – hotel"} /></label> : null}
    {kind === "custom" ? <div className="contact-field-row">
      <label><span>{zh ? "包车天数 *" : "Number of days *"}</span><input required name="days" maxLength={60} placeholder={zh ? "例如：3天" : "e.g. 3 days"} /></label>
      <label><span>{zh ? "计划路线及停靠点 *" : "Route and planned stops *"}</span><input required name="route" maxLength={300} placeholder={zh ? "例如：昆明－大理－沙溪－丽江" : "Kunming – Dali – Shaxi – Lijiang"} /></label>
    </div> : null}
    <div className="contact-field-row">
      <label><span>{zh ? "服务日期 *" : "Travel date *"}</span><input type="date" required name="date" /></label>
      <label><span>{zh ? "车型需求 *" : "Vehicle preference *"}</span><select required name="vehicle" defaultValue="Five-seat car">
        <option value="Five-seat car">{zh ? "标准5座车（建议1–3人）" : "Five-seat car (1–3 recommended)"}</option>
        <option value="Larger vehicle - quote required">{zh ? "更大车型（需另行报价）" : "Larger vehicle (custom quote)"}</option>
      </select></label>
    </div>
    <div className="contact-field-row">
      <label><span>{zh ? "成人数 *" : "Adults *"}</span><input required type="number" name="travelers" min="1" max="20" defaultValue="2" /></label>
      <label><span>{zh ? "儿童人数" : "Children"}</span><input type="number" name="children" min="0" max="20" defaultValue="0" /></label>
    </div>
    <label><span>{zh ? "大行李箱数量" : "Large suitcases"}</span><input type="number" name="luggage" min="0" max="20" defaultValue="1" /></label>
    <label><span>{zh ? "额外要求（儿童座椅、接送时间等）" : "Other needs (child seat, pickup time, etc.)"}</span><textarea rows={3} name="notes" maxLength={1100} /></label>
    <div className="contact-field-row">
      <label><span>{zh ? "姓名 *" : "Your name *"}</span><input required name="name" type="text" autoComplete="name" maxLength={100} /></label>
      <label><span>{zh ? "邮箱" : "Email"}</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
    </div>
    <label><span>{zh ? "WhatsApp（与邮箱二选一）" : "WhatsApp (email or WhatsApp required)"}</span><input name="whatsapp" type="tel" autoComplete="tel" maxLength={40} placeholder="+65 1234 5678" /></label>
    <label className="contact-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="driver-form-consent"><input type="checkbox" name="consent" value="yes" required /><span>{zh ? "我同意仅就本次包车咨询接收回复。" : "I agree to be contacted only about this driver enquiry."} <Link href="/privacy-policy">{zh ? "隐私政策" : "Privacy policy"}</Link></span></label>
    {status === "error" ? <p role="alert" className="contact-form-error">{error}</p> : null}
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? (zh ? "发送中…" : "Sending…") : (zh ? "查询车辆与报价" : "Check Availability & Request Price")}</button>
  </form>;
}

export function StandardTransferSection({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [selected, setSelected] = useState<ProductId | null>(null);
  const groups: { key: Category; en: string; zh: string; noteEn: string; noteZh: string }[] = [
    { key: "arrival", en: "Airport & Station Transfers", zh: "机场与火车站接送", noteEn: "Choose your city first, then select airport or train station and pickup direction.", noteZh: "先选城市，进入服务选项后选择机场／车站及接送方向。" },
    { key: "intercity", en: "Intercity Transfers", zh: "云南跨城私人接送", noteEn: "One card per route; select the direction and planned stops in the next step.", noteZh: "每条路线一张卡，随后选择出行方向与停靠计划。" },
    { key: "day", en: "Private Car by the Day", zh: "9 小时私人包车", noteEn: "Plan a 9-hour local charter, normally 9:00 AM–6:00 PM, subject to route confirmation.", noteZh: "按当地服务范围安排9小时用车，一般为09:00–18:00，路线需核实。" },
  ];
  const pick = (id: ProductId) => {
    setSelected(id);
    trackEvent("driver_product_select", { product_id: id, page_path: window.location.pathname });
    requestAnimationFrame(() => document.getElementById("driver-request")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return <section className="driver-section driver-section-soft" id="standard-transfers">
    <div className="shell">
      <div className="driver-section-head">
        <p className="kicker">{zh ? "私人交通服务目录" : "YUNNAN DRIVER SERVICES"}</p>
        <h2>{zh ? "选择合适的接送与包车服务" : "Find Your Private Car Service"}</h2>
        <p>{zh ? "10个清晰的标准产品入口，按城市、线路或包车时长选择。提交日期和车辆信息后，我们会先核实车源与总价。" : "Ten straightforward service options, grouped by arrival transfer, intercity route and day hire. We confirm the car and total price before taking a deposit."}</p>
      </div>
      <nav className="driver-catalog-jump" aria-label={zh ? "服务类别" : "Service categories"}>
        <a href="#airport-station-transfers">{zh ? "机场／车站接送" : "Airport & Station"}</a>
        <a href="#intercity-transfers">{zh ? "跨城接送" : "Intercity"}</a>
        <a href="#private-car-by-day">{zh ? "按天包车" : "By the Day"}</a>
        <a href="#custom-routes">{zh ? "定制及多日" : "Custom & Multi-Day"}</a>
      </nav>
      {groups.map((group, index) => <div className="driver-catalog-group" key={group.key} id={group.key === "arrival" ? "airport-station-transfers" : group.key === "intercity" ? "intercity-transfers" : "private-car-by-day"}>
        <div className="driver-group-heading">
          <div><p className="kicker">{String(index + 1).padStart(2, "0")} / {zh ? "服务类型" : "SERVICES"}</p><h3>{zh ? group.zh : group.en}</h3><p>{zh ? group.noteZh : group.noteEn}</p></div>
          <span>{products.filter(p => p.category === group.key).length} {zh ? "个产品" : "options"}</span>
        </div>
        <div className={`driver-product-grid driver-product-grid--${group.key}`}>
          {products.filter(p => p.category === group.key).map((product) => <article className="driver-product" key={product.id}>
            <div className="driver-product-photo"><Image src={product.photo} alt={zh ? product.zh : product.en} fill sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw" /></div>
            <div className="driver-product-copy">
              <h3>{zh ? product.zh : product.en}</h3>
              <p>{zh ? product.detailZh : product.detailEn}</p>
              <p className="driver-product-price">{zh ? "具体价格按日期与车型报价" : "Price confirmed by date & vehicle"}<small>{zh ? "车源核实后安排20%定金" : "20% deposit after confirmation"}</small></p>
              <button type="button" className="button button-blue" onClick={() => pick(product.id)}>{zh ? "选择选项并询价" : "Select Options & Check Price"}</button>
            </div>
          </article>)}
        </div>
      </div>)}
      <p className="driver-product-footnote">{zh ? "标准5座车建议1–3位旅客；更多乘客和大件行李可申请更大车型。车辆照片仅为示例，实际车型以确认单为准。" : "A five-seat car is recommended for 1–3 travellers; larger vehicles can be quoted. Photos are category examples. Vehicle details are confirmed in writing."}</p>
      {selected ? <div className="driver-booking-panel" id="driver-request" key={selected}>
        <DriverEnquiryForm locale={locale} kind="standard" serviceId={selected} />
      </div> : null}
    </div>
  </section>;
}

export function CustomDriverForm({ locale }: { locale: Locale }) {
  return <DriverEnquiryForm locale={locale} kind="custom" />;
}
