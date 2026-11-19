"use client";

import Image from "next/image";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { generateLeadId } from "@/lib/whatsapp";
import { createFormTracking } from "@/lib/lead-ref-client";
import { trackEvent } from "@/lib/analytics";
import { LocaleLink as Link } from "@/components/locale-link";
import { airportTransferCatalog, chinaServiceDate, isOutsideTransferArea, transferGuidePrice, transferStartingPrice } from "@/lib/driver-airport-transfers";
import { filterDriverProducts } from "@/lib/driver-product-filter";

type Locale = "en" | "zh";
type Category = "arrival" | "intercity" | "day";
type ProductId =
  | "kunming-arrival" | "dali-arrival" | "lijiang-arrival" | "shangri-la-arrival"
  | "dali-lijiang-direct" | "dali-lijiang-shaxi" | "lijiang-shangri-la" | "lijiang-tlg-shangri-la"
  | "kunming-day" | "dali-day" | "lijiang-day" | "shangri-la-day";
const serviceCities = [
  { value: "kunming", en: "Kunming", zh: "昆明" },
  { value: "dali", en: "Dali", zh: "大理" },
  { value: "lijiang", en: "Lijiang", zh: "丽江" },
  { value: "shangri-la", en: "Shangri-La", zh: "香格里拉" },
] as const;
type ServiceCity = typeof serviceCities[number]["value"];

const serviceFilters = [
  { key: "all", id: "all-driver-services", en: "All services", zh: "全部服务" },
  { key: "arrival", id: "airport-station-transfers", en: "Airport & Station", zh: "机场／车站接送" },
  { key: "intercity", id: "intercity-transfers", en: "Intercity", zh: "跨城接送" },
  { key: "day", id: "private-car-by-day", en: "Private Day Trips", zh: "周边一日游包车" },
] as const;

type FormKind = "standard" | "custom";
type NamedOption = { value: string; en: string; zh: string };
type Product = {
  id: ProductId; category: Category; cities: ServiceCity[]; departureCities?: ServiceCity[]; en: string; zh: string;
  detailEn: string; detailZh: string; photo: string; guidePrices?: { five: number; seven: number };
  routes?: NamedOption[];
};

const products: Product[] = [
  {
    id: "kunming-arrival", category: "arrival", cities: ["kunming"],
    en: "Kunming Airport & Railway Station Transfer", zh: "昆明机场与火车站接送",
    detailEn: "Private transfers between Kunming Changshui Airport, Kunming Railway Station or Kunming South Railway Station and major hotel areas.",
    detailZh: "提供昆明长水国际机场、昆明站及昆明南站与昆明主要酒店区域之间的私人接送服务。",
    photo: "/assets/blog/kunming-travel-guide/kunming-city.webp",
  },
  {
    id: "dali-arrival", category: "arrival", cities: ["dali"],
    en: "Dali Airport & Railway Station Transfer", zh: "大理机场与火车站接送",
    detailEn: "Private transfers between Dali Fengyi Airport, Dali Railway Station, Xiaguan, Dali Old Town, Xizhou and Shuanglang.",
    detailZh: "提供大理凤仪机场、大理站与下关、大理古城、喜洲及双廊之间的私人接送服务。",
    photo: "/assets/destinations/yunnan/dali-erhai-cover.webp",
  },
  {
    id: "lijiang-arrival", category: "arrival", cities: ["lijiang"],
    en: "Lijiang Airport & Railway Station Transfer", zh: "丽江机场与火车站接送",
    detailEn: "Private transfers between Lijiang Sanyi International Airport, Lijiang Railway Station, Lijiang Old Town, Shuhe and Baisha.",
    detailZh: "提供丽江三义国际机场、丽江站与丽江古城、束河古镇及白沙古镇之间的私人接送服务。",
    photo: "/assets/destinations/yunnan/lijiang.webp",
  },
  {
    id: "shangri-la-arrival", category: "arrival", cities: ["shangri-la"],
    en: "Shangri-La Airport & Railway Station Transfer", zh: "香格里拉机场与火车站接送",
    detailEn: "Private transfers between Diqing Shangri-La Airport, Shangri-La Railway Station, Dukezong Ancient Town, central Shangri-La and the Songzanlin area.",
    detailZh: "提供迪庆香格里拉机场、香格里拉站与独克宗古城、香格里拉市区及松赞林寺片区之间的私人接送服务。",
    photo: "/assets/destinations/yunnan/shangri-la.webp",
  },
  {
    id: "dali-lijiang-direct", guidePrices: { five: 550, seven: 750 }, category: "intercity", cities: ["dali", "lijiang"], departureCities: ["dali", "lijiang"],
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
    id: "dali-lijiang-shaxi", guidePrices: { five: 780, seven: 980 }, category: "intercity", cities: ["dali", "lijiang"], departureCities: ["dali", "lijiang"],
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
    id: "lijiang-shangri-la", guidePrices: { five: 680, seven: 880 }, category: "intercity", cities: ["lijiang", "shangri-la"], departureCities: ["lijiang", "shangri-la"],
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
    id: "lijiang-tlg-shangri-la", guidePrices: { five: 880, seven: 1080 }, category: "intercity", cities: ["lijiang", "shangri-la"], departureCities: ["lijiang"],
    en: "Lijiang → Tiger Leaping Gorge → Shangri-La",
    zh: "丽江 → 虎跳峡 → 香格里拉",
    detailEn: "One-way journey with a planned Tiger Leaping Gorge visit.",
    detailZh: "单向路线，包含提前约定的虎跳峡停留。",
    photo: "/assets/destinations/yunnan/tiger-leaping.webp",
    routes: [{ value: "Lijiang → Tiger Leaping Gorge → Shangri-La", en: "Lijiang → Tiger Leaping Gorge → Shangri-La", zh: "丽江 → 虎跳峡 → 香格里拉" }]
  },
  {
    id: "kunming-day", category: "day", cities: ["kunming"],
    en: "Kunming Private Day Trip", zh: "昆明周边一日游包车",
    detailEn: "Wander among the Stone Forest’s limestone spires, or take in Dianchi Lake from the Western Hills.",
    detailZh: "去石林看奇峰怪石，或走滇池海埂与西山，从湖边一路看到山上。",
    photo: "/assets/blog/kunming-travel-guide/cover-stone-forest.webp",
  },
  {
    id: "dali-day", guidePrices: { five: 750, seven: 950 }, category: "day", cities: ["dali"],
    en: "Dali Private Day Trip", zh: "大理周边一日游包车",
    detailEn: "Explore Bai courtyards in Xizhou and lakeside villages around Erhai, or visit the Three Pagodas and Dali Old Town.",
    detailZh: "去喜洲看白族老院子，沿洱海看湖景；也可走崇圣寺三塔和大理古城。",
    photo: "/assets/destinations/yunnan/dali-erhai-cover.webp",
  },
  {
    id: "lijiang-day", guidePrices: { five: 780, seven: 980 }, category: "day", cities: ["lijiang"],
    en: "Lijiang Private Day Trip", zh: "丽江周边一日游包车",
    detailEn: "Pair Jade Dragon Snow Mountain with Blue Moon Valley, or slow down in Baisha and Shuhe’s old lanes.",
    detailZh: "去玉龙雪山和蓝月谷看雪峰与碧水，或到白沙、束河慢逛纳西古镇。",
    photo: "/assets/destinations/yunnan/blue-moon.webp",
  },
  {
    id: "shangri-la-day", guidePrices: { five: 850, seven: 1050 }, category: "day", cities: ["shangri-la"],
    en: "Shangri-La Private Day Trip", zh: "香格里拉周边一日游包车",
    detailEn: "Visit Songzanlin Monastery and the wetlands around Napa Lake, or spend the day among Pudacuo’s lakes and forests.",
    detailZh: "看松赞林寺与纳帕海湿地，或留一天到普达措走湖畔、看森林。",
    photo: "/assets/blog/best-time-to-visit-yunnan/cover-pudacuo-autumn.webp",
  },
];

const fiveSeat = "Five-seat car";
const sevenSeat = "Seven-seat car";
function DriverPicker({ name, type, label, min, required = true }: { name: string; type: "date" | "time"; label: string; min?: string; required?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  return <div className="driver-picker">
    <input ref={input} type={type} name={name} required={required} min={min} aria-label={label} />
    <button type="button" aria-label={label} onClick={() => {
      const field = input.current;
      if (!field) return;
      field.focus();
      try { field.showPicker?.(); } catch { /* The focused input remains editable. */ }
    }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {type === "date" ? <path d="M4 6h16v14H4zM4 10h16M8 4v4m8-4v4" /> : <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>}
      </svg>
    </button>
  </div>;
}

/**
 * Driver-only dropdown: avoids mixing native <details>, nested radio changes,
 * and form-wide change handlers while the checkout review is mounted.
 * Keep this isolated to the private-driver page; other forms are unchanged.
 */
function DriverDropdown({ name, label, placeholder, options, required = false, value: controlledValue, defaultValue = "", onValueChange }: {
  name: string; label: string; placeholder: string;
  options: { value: string; label: string }[]; required?: boolean;
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const field = useRef<HTMLDivElement>(null);
  const value = controlledValue ?? internalValue;
  const selected = options.find(option => option.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !field.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return <fieldset className="enquiry-select driver-dropdown">
    <legend id={id + "-label"}>{label}</legend>
    <div className="driver-dropdown-anchor" ref={field} onKeyDown={event => {
      if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); }
    }}>
      <button type="button" className="driver-dropdown-trigger" aria-haspopup="listbox"
        aria-expanded={open} aria-labelledby={id + "-label " + id + "-selected"}
        aria-required={required} onClick={() => setOpen(current => !current)}>
        <span id={id + "-selected"} className={selected ? "" : "enquiry-select-placeholder"}>{selected?.label ?? placeholder}</span>
        <span className="enquiry-select-chevron" aria-hidden="true" />
      </button>
      {open ? <div className="driver-dropdown-options" role="listbox" aria-labelledby={id + "-label"}>
        {options.map(option => <button key={option.value} type="button" role="option"
          aria-selected={value === option.value} className={value === option.value ? "is-selected" : ""}
          onClick={() => {
            setInternalValue(option.value);
            onValueChange?.(option.value);
            setOpen(false);
          }}>
          <span>{option.label}</span>
          {value === option.value ? <span aria-hidden="true">✓</span> : null}
        </button>)}
      </div> : null}
      <input type="hidden" name={name} value={value} />
    </div>
  </fieldset>;
}

function DriverEnquiryForm({ locale, kind, serviceId, stripeTestCheckoutEnabled = false }: { locale: Locale; kind: FormKind; serviceId?: ProductId; stripeTestCheckoutEnabled?: boolean }) {
  const zh = locale === "zh";
  const [status, setStatus] = useState<"idle" | "review" | "paying" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [vehicle, setVehicle] = useState(fiveSeat);
  const [hubId, setHubId] = useState("");
  const [arrivalDirection, setArrivalDirection] = useState("");
  const [hotelArea, setHotelArea] = useState("");
  const [stationTransfer, setStationTransfer] = useState(false);
  const idRef = useRef<string | null>(null);
  const leadRef = useRef<string | null>(null);
  const submissionKey = useRef<string | null>(null);
  const [orderPath, setOrderPath] = useState("");
  const [ackStatus, setAckStatus] = useState<"accepted" | "failed" | "not_requested">("not_requested");
  const startedRef = useRef(false);
  const [paymentReview, setPaymentReview] = useState<null | {
    payload: Record<string, unknown>; route: string; date: string; time: string;
    vehicle: string; travelers: string; luggage: number; contact: string; transportNumber: string; notes: string;
  }>(null);
  const [testTermsAccepted, setTestTermsAccepted] = useState(false);
  const isKunmingTest = stripeTestCheckoutEnabled && serviceId === "kunming-arrival";
  const invalidateReview = () => {
    if (status !== "review") return;
    setStatus("idle"); setError(""); setPaymentReview(null); setTestTermsAccepted(false);
    idRef.current = null; leadRef.current = null; submissionKey.current = null;
  };
  const service = products.find(p => p.id === serviceId);
  const transfer = airportTransferCatalog[serviceId ?? ""];
  const isArrival = service?.category === "arrival";
  const isDaliArrival = serviceId === "dali-arrival";
  const isLijiangArrival = serviceId === "lijiang-arrival";
  const isShangriLaArrival = serviceId === "shangri-la-arrival";
  const hub = transfer?.hubs.find(option => option.value === hubId);
  const isStationTransfer = serviceId === "kunming-arrival" && hubId === "kmg" && stationTransfer;
  const secondHub = isStationTransfer ? transfer?.hubs.find(option => option.value === "south") : undefined;
  const selectedArea = transfer?.areas.find(option => option.value === hotelArea);
  const priceArea = secondHub?.value || hotelArea;
  const vehiclePrice = vehicle === fiveSeat ? "five" : vehicle === sevenSeat ? "seven" : undefined;
  const guidePrice = isArrival
    ? transferGuidePrice(serviceId ?? "", hubId, priceArea, arrivalDirection, vehiclePrice)
    : vehiclePrice ? service?.guidePrices?.[vehiclePrice] : undefined;
  const outsideArea = !isStationTransfer && isOutsideTransferArea(hotelArea);
  const isPickup = arrivalDirection === "pickup";
  const transportHub = secondHub && !isPickup ? secondHub : hub;
  const isAirport = transportHub?.kind === "airport";
  const transportLabel = !transportHub ? (zh ? "航班号／车次" : "Flight / train number")
    : isAirport ? (zh ? "航班号" : "Flight number") : (zh ? "车次" : "Train number");
  const requiresArrivalDetails = Boolean(isPickup || secondHub);
  const timeLabel = requiresArrivalDetails ? (zh ? "预计抵达时间" : "Scheduled arrival time") : (zh ? "期望接客时间" : "Preferred pickup time");
  const hubType = !hub ? (zh ? "机场／火车站" : "Airport / railway station")
    : hub.kind === "airport" ? (zh ? "机场" : "Airport") : (zh ? "火车站" : "Railway station");
  const pickupLabel = secondHub ? (zh ? "机场 → 昆明南站（接机）" : "Airport → Kunming South Railway Station (airport pickup)")
    : zh ? `${hubType} → 酒店（${hub ? hub.kind === "airport" ? "接机" : "接站" : "接机／接站"}）` : `${hubType} → hotel (pickup)`;
  const dropoffLabel = secondHub ? (zh ? "昆明南站 → 机场（接站）" : "Kunming South Railway Station → airport (railway pickup)")
    : zh ? `酒店 → ${hubType}（${hub ? hub.kind === "airport" ? "送机" : "送站" : "送机／送站"}）` : `Hotel → ${hubType} (drop-off)`;
  const isDay = service?.category === "day";
  const isIntercity = service?.category === "intercity";
  const title = kind === "custom" ? (zh ? "提交定制／多日包车需求" : "Request a Custom or Multi-Day Driver") : (zh ? "选择服务选项与日期" : "Select Your Transfer Details");
  const formName = kind === "custom" ? "yunnan_driver_custom" : "yunnan_driver_product";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || status === "paying" || status === "success") return;
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
    if (isArrival && (!Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0 || !Number.isInteger(luggage) || luggage < 0 || !vehicle)) {
      setError(zh ? "请填写有效人数、大行李箱数量和车型，成人至少1人。" : "Select a vehicle and enter valid passenger and luggage counts, including at least one adult.");
      setStatus("error"); return;
    }
    if (kind === "standard" && vehicle === fiveSeat && (adults + children > 3 || luggage > 3)) {
      setError(isArrival
        ? (adults + children > 3
          ? (zh ? "标准5座车建议最多3位乘客，请选择7座商务车或提交人工确认。" : "For more than 3 passengers, select a seven-seat vehicle or request a manual quote.")
          : (isDaliArrival || isLijiangArrival || isShangriLaArrival)
            ? (zh ? "超过3个大行李箱，请选择7座商务车或更大车型以便人工确认。" : "For more than 3 large suitcases, choose a seven-seat MPV or select a larger vehicle for a manual quote.")
            : (zh ? "标准5座车最多可放3个大行李箱，建议选择7座商务车。" : "A five-seat car fits up to 3 large suitcases. Please select a seven-seat vehicle."))
        : zh ? "标准5座车型建议最多3位乘客、3个大箱；请改选7座或更大车型。" : "For over 3 passengers or 3 large cases, select a seven-seat or larger vehicle.");
      setStatus("error"); return;
    }
    if (vehicle === sevenSeat && adults + children > 6) {
      setError(zh ? "7座车最多可乘坐6位旅客，请改选更大车型。" : "Select a larger vehicle for more than six travellers.");
      setStatus("error"); return;
    }
    const travelDate = String(values.get("date") || "");
    const localToday = new Date(); localToday.setHours(0, 0, 0, 0);
    if (!travelDate || (isArrival ? travelDate < chinaServiceDate() : new Date(travelDate + "T00:00:00") < localToday)) {
      setError(zh ? "请选择今天或之后的服务日期。" : "Please select today or a future date.");
      setStatus("error"); return;
    }
    const endDate = String(values.get("endDate") || "");
    if (kind === "custom" && endDate && endDate < travelDate) {
      setError(zh ? "结束日期不能早于出发日期。" : "The end date cannot be before the start date.");
      setStatus("error"); return;
    }
    const hotel = String(values.get("hotel") || "").trim();
    const transportNumber = String(values.get("transportNumber") || "").trim();
    const serviceTime = String(values.get("serviceTime") || "");
    const direction = isArrival ? (isPickup ? pickupLabel : dropoffLabel) : String(values.get("direction") || "");
    if (isArrival && (!hub || !["pickup", "dropoff"].includes(arrivalDirection)
      || (!secondHub && (!selectedArea || !hotel)) || (serviceTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(serviceTime))
      )) {
      setError(zh ? "请确认交通枢纽、接送方向、地址和服务时间。" : "Please confirm the hub, direction, address and service time.");
      setStatus("error"); return;
    }
    if (isKunmingTest && ![fiveSeat, sevenSeat].includes(vehicle)) {
      setError(zh ? "US$1 测试只支持5座和7座；更大车型请单独询价。" : "The US$1 test only supports five-seat and seven-seat vehicles.");
      setStatus("error"); return;
    }
    if (isIntercity && !service?.routes?.some(r => r.value === direction)) {
      setError(zh ? "请选择路线方向。" : "Select a valid route direction.");
      setStatus("error"); return;
    }
    const hubName = hub ? hub[locale] : "";
    const secondLocation = secondHub ? secondHub[locale] : hotel;
    const pickup = isArrival ? (isPickup ? hubName : secondLocation) : String(values.get("pickup") || "");
    const dropoff = isArrival ? (isPickup ? secondLocation : hubName) : (String(values.get("dropoff") || "") || (isDay ? pickup : ""));
    const route = String(values.get("route") || "");
    const notes = String(values.get("notes") || "");
    const days = kind === "custom" ? String(values.get("days") || "") : isDay ? "1 day" : "1 transfer";
    const serviceName = service?.en || "Custom & Multi-Day Driver";
    idRef.current ??= crypto.randomUUID();
    leadRef.current ??= generateLeadId();
    submissionKey.current ??= crypto.randomUUID();
    const detail = [
      "PRODUCT ID: " + (service?.id || "custom-multi-day"),
      "CATEGORY: " + (service?.category || "custom"),
      "Service: " + serviceName,
      "Travel date: " + travelDate,
      ...(kind === "custom" ? ["Travel end date: " + (String(values.get("endDate") || "") || "Not supplied")] : []),
      "Direction / selected route: " + (direction || "Custom"),
      "Airport / railway station: " + (hub?.en || "Not applicable"),
      "Hotel service area: " + (!secondHub && selectedArea ? selectedArea.en : "Not applicable"),
      ...(isArrival ? [
        "Hotel address: " + (hotel || "Not applicable"),
        (transportHub?.kind === "railway" ? "Train number: " : "Flight number: ") + (transportNumber || "Not supplied"),
        (requiresArrivalDetails ? "Scheduled arrival time: " : "Preferred pickup time: ") + (serviceTime ? serviceTime + " (China time)" : "To be confirmed"),
      ] : ["Arrival / departure flight or train: Not supplied"]),
      "Pickup: " + pickup,
      "Drop-off: " + dropoff,
      "Vehicle requested: " + vehicle,
      isKunmingTest ? "Sandbox test price: USD 1.00 (not a real quote)" : guidePrice === undefined ? "Price: manual quote" : "Online guide price: RMB " + guidePrice + " per vehicle",
      "Passengers: " + adults + " adults, " + children + " children",
      "Large suitcases: " + luggage,
      "Duration: " + days,
      "Stops / day plan: " + route,
      "Requirements: " + notes,
      isKunmingTest ? "Status: PREVIEW sandbox US$1 checkout; no real booking" : "Status: enquiry only; no price, vehicle or payment confirmed",
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
      tracking: createFormTracking(leadRef.current, formName, service?.id || "custom-multi-day"),
      requestId: idRef.current,
      driverOrder: {
        submissionKey: submissionKey.current, locale, service: service ? (zh ? service.zh : service.en) : title,
        route: direction || route, pickup, dropoff, vehicle: zh
          ? (vehicle === fiveSeat ? "5座车" : vehicle === sevenSeat ? "7座商务车" : "更大车型") : vehicle,
        guideFen: guidePrice === undefined ? null : guidePrice * 100,
        ...(isArrival ? { airportTransfer: {
          productId: serviceId, hubId, direction: arrivalDirection, hotelArea: secondHub ? "" : hotelArea,
          stationTransfer: Boolean(secondHub), hotel, transportNumber, serviceTime, vehicle, luggage, notes,
        } } : {}),
      },
    };
    if (isKunmingTest) {
      setPaymentReview({
        payload, route: `${pickup} → ${dropoff}`, date: travelDate, time: serviceTime || (zh ? "待补充" : "To be confirmed"),
        vehicle, travelers: `${adults} ${zh ? "成人" : "adults"}, ${children} ${zh ? "儿童" : "children"}`,
        luggage, contact: email || whatsapp, transportNumber, notes,
      });
      setTestTermsAccepted(false); setError(""); setStatus("review");
      return;
    }
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/custom-journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.error || "Could not send your request.");
      trackEvent("generate_lead", {
        form_name: formName, lead_type: kind === "custom" ? "private_driver_custom" : "private_driver_product",
        product_id: service?.id || "custom-multi-day", service_category: service?.category || "custom",
        service_direction: isArrival ? arrivalDirection : direction || undefined, hotel_area: isArrival && !secondHub ? hotelArea || undefined : undefined, vehicle_requested: vehicle,
        event_id: idRef.current, lead_id: leadRef.current || undefined, page_path: window.location.pathname,
      });
      if (typeof data.orderPath === "string") setOrderPath(data.orderPath);
      setAckStatus(data.acknowledgement === "accepted" ? "accepted" : data.acknowledgement === "failed" ? "failed" : "not_requested");
      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (zh ? "发送失败，请重试。" : "Please try again."));
      setStatus("error");
    }
  }

  async function confirmTestPayment() {
    if (!paymentReview || status === "paying" || !testTermsAccepted) return;
    setStatus("paying"); setError("");
    try {
      const response = await fetch("/api/stripe/kunming-test-checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentReview.payload),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Could not create the test checkout.");
      const next = new URL(data.url);
      if (next.protocol !== "https:" || !(next.hostname === "checkout.stripe.com" || (next.hostname === "buy.stripe.com" && next.pathname.startsWith("/test_")))) throw new Error("Unexpected payment link.");
      trackEvent("driver_stripe_test_checkout_start", { product_id: "kunming-arrival", page_path: window.location.pathname });
      window.location.assign(next.href);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (zh ? "无法打开 Stripe 测试付款。" : "Could not open Stripe test checkout."));
      setStatus("review");
    }
  }

  if (status === "success") return <div className="driver-form-success" role="status">
    <h3>{zh ? "已收到包车需求" : "We received your driver request"}</h3>
    <p>{zh ? "我们会确认路线、车型、车源和价格，再联系你。尚未收取任何款项，预订也尚未确认。" : "We will verify the route, car and total price and contact you. No payment was taken and this is not yet a confirmed booking."}</p>
    {orderPath ? <p><a href={orderPath}>{zh ? "查看我的包车申请" : "View my driver request"}</a></p> : null}
    {ackStatus === "accepted" ? <p>{zh ? "系统已向你的邮箱提交咨询回执（非预订确认）。" : "An acknowledgement has been accepted for your email (not a booking confirmation)."}</p>
      : ackStatus === "failed" ? <p>{zh ? "邮箱回执暂时未发送成功，但我们已收到你的咨询。" : "The email acknowledgement was unavailable, but we received your enquiry."}</p> : null}
    <Link href="/licensed-operator">{zh ? "查看持证旅行社信息" : "View the licensed operator"}</Link>
  </div>;

  return <form className="contact-form driver-form" onSubmit={submit} onChange={event => {
    if (isKunmingTest && !(event.target instanceof Element && event.target.closest(".driver-form-success"))) invalidateReview();
  }} onFocus={() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("driver_enquiry_form_start", { form_name: formName, product_id: service?.id || "custom-multi-day", page_path: window.location.pathname });
    }
  }}>
    <h3>{title}</h3>
    {service ? <p className="driver-form-selection">{zh ? "当前产品：" : "Your product: "}<strong>{zh ? service.zh : service.en}</strong></p> : null}
    <p className="driver-form-note">{isKunmingTest
      ? (zh ? "PREVIEW 沙盒测试：填写接送信息并核对订单，统一支付 US$1 测试款。不会安排真实车辆，也不会发生真实扣款。" : "PREVIEW SANDBOX TEST: Enter transfer details, review your order, then pay US$1 in Stripe test mode. No real charge or vehicle booking.")
      : (zh ? "选择路线选项并发送需求。车辆和总价核实后才安排付款，此表单不收取费用。" : "Select your options and request a quote. We check vehicle availability and total cost before arranging payment; this form is free.")}</p>
    {transfer ? <>
      <div className="contact-field-row">
        <DriverDropdown name="hub" label={zh ? "选择机场／火车站 *" : "Airport / railway station *"} placeholder={zh ? "请选择" : "Choose a hub"} required value={hubId} onValueChange={value => { invalidateReview(); setHubId(value); setArrivalDirection(""); setHotelArea(""); setStationTransfer(false); }} options={transfer.hubs.map(h => ({ value: h.value, label: h[locale] }))} />
        <DriverDropdown name="direction" label={zh ? "接送方向 *" : "Transfer direction *"} placeholder={zh ? "请选择方向" : "Choose direction"} required value={arrivalDirection} onValueChange={value => { invalidateReview(); setArrivalDirection(value); }} options={[{ value: "pickup", label: pickupLabel }, { value: "dropoff", label: dropoffLabel }]} />
      </div>
      {serviceId === "kunming-arrival" && hubId === "kmg" ? <label className="driver-form-consent">
        <input type="checkbox" checked={stationTransfer} onChange={event => setStationTransfer(event.target.checked)} />
        <span>{zh ? "长水机场与昆明南站直达" : "Direct transfer between Changshui Airport and Kunming South Railway Station"}</span>
      </label> : null}
      {!secondHub ? <div className="contact-field-row">
        <DriverDropdown name="hotelArea" label={zh ? "酒店所在区域 *" : "Hotel area *"} placeholder={zh ? "选择酒店区域" : "Select hotel area"} required value={hotelArea} onValueChange={value => { invalidateReview(); setHotelArea(value); }} options={transfer.areas.map(area => ({ value: area.value, label: area[locale] }))} />
        <label><span>{zh ? "酒店名称或详细地址 *" : "Hotel name / full address *"}</span><input type="text" name="hotel" required maxLength={150} placeholder={zh ? "填写酒店名称或完整地址" : "Hotel name or full address"} /></label>
      </div> : null}
      {isLijiangArrival && hotelArea === "oldtown" ? <p className="driver-area-hint">{zh
        ? "丽江古城部分住宿位于步行区域，车辆可能无法直接到达酒店门口。请填写完整酒店名称和地址，并提前向酒店确认最近的可通车接送点。"
        : "Some accommodation inside Lijiang Old Town is located in pedestrian-only lanes. The vehicle may stop at the nearest accessible Old Town entrance rather than directly outside the hotel. Please provide the full hotel name and address."}</p> : null}
      {isShangriLaArrival && hotelArea === "dukezong" ? <p className="driver-area-hint">{zh
        ? "独克宗古城内部分住宿位于步行区域，车辆可能只能到达最近的可通车入口。请填写完整酒店名称和地址，并提前向酒店确认最近的接送点。"
        : "Some accommodation inside Dukezong Ancient Town is located in pedestrian-only lanes. The vehicle may stop at the nearest accessible entrance rather than directly outside the hotel. Please provide the full hotel name and address."}</p> : null}
      {outsideArea ? <p className="driver-area-hint">{isShangriLaArrival
        ? (zh ? "该地址位于香格里拉标准接送区域之外，请填写完整酒店名称和地址，我们将在确认路线、路况与车源后提供报价。"
          : "This location is outside our standard Shangri-La transfer zones. Please provide the full hotel name and address for a custom quotation.")
        : isLijiangArrival
        ? (zh ? "该地址位于丽江标准接送区域之外，请填写完整酒店名称和地址，我们将在确认路线与车源后提供报价。"
          : "This location is outside our standard Lijiang transfer zones. Please provide the full hotel name and address for a custom quotation.")
        : isDaliArrival
        ? (zh ? "该地址位于大理标准接送区域之外，请填写完整酒店名称和地址，我们将在确认路线与车源后提供报价。"
          : "This address is outside Dali’s standard transfer area. Enter the full hotel name and address so we can confirm the route and vehicle availability before quoting.")
        : (zh ? "该地址位于标准接送区域之外，我们将在确认具体地址和车源后提供报价。" : "This address is outside the standard transfer area. We will quote after confirming the exact address and vehicle availability.")}</p> : null}
      {isLijiangArrival && outsideArea ? <p className="driver-area-hint">{zh
        ? "玉龙雪山、玉湖村、拉市海、虎跳峡、泸沽湖、石鼓和长江第一湾均按其他区域询价。"
        : "Request a custom quote for Jade Dragon Snow Mountain, Yuhu Village, Lashihai, Tiger Leaping Gorge, Lugu Lake, Shigu and the First Bend of the Yangtze."}</p> : null}
      {isShangriLaArrival && outsideArea ? <p className="driver-area-hint">{zh
        ? "纳帕海及环湖区域、普达措、巴拉格宗、虎跳峡、白水台、梅里雪山／飞来寺、雨崩和哈巴雪山片区均按其他区域询价。"
        : "Request a custom quote for Napa Lake, Pudacuo, Balagezong, Tiger Leaping Gorge, Baishuitai, Meili Snow Mountain / Feilai Temple, Yubeng and the Haba Snow Mountain area."}</p> : null}
      <label><span>{transportLabel}{zh ? "（选填，可稍后补充）" : " (optional; share later)"}</span>
        <input type="text" name="transportNumber" maxLength={40} placeholder={(isAirport || !transportHub) ? (isShangriLaArrival ? "MU5931" : "MU1234") : isDaliArrival ? "D3937" : isLijiangArrival ? "D8791" : isShangriLaArrival ? "C119" : "G2845"} key={transportHub?.kind ?? "unknown"} />
        <small>{zh ? "还没订机票或火车票？可稍后补充航班号或车次。" : "Not booked yet? You can share your flight or train number later."}</small>
      </label>
    </> : null}
    {isIntercity ? <>
      <DriverDropdown name="direction" label={zh ? "选择路线及方向 *" : "Route and direction *"} placeholder={zh ? "请选择方向" : "Choose direction"} required defaultValue={service.routes?.length === 1 ? service.routes[0].value : ""} options={(service.routes ?? []).map(route => ({ value: route.value, label: route[locale] }))} />
      {service.id === "dali-lijiang-shaxi" || service.id === "lijiang-tlg-shangri-la" ? <label><span>{zh ? "途中停留／计划参观内容" : "Sightseeing stops / time on site"}</span><input name="route" maxLength={300} placeholder={zh ? "希望停留多久、计划游览什么？" : "Preferred stops and time at each"} /></label> : null}
    </> : null}
    {!isArrival ? <div className="contact-field-row">
      <label><span>{zh ? "出发酒店／地点 *" : "Pickup city / location *"}</span><input required name="pickup" maxLength={150} placeholder={zh ? "完整地点或酒店名" : "City, station or hotel"} /></label>
      <label><span>{isDay ? (zh ? "结束地点（选填）" : "Drop-off location (optional)") : (zh ? "送达酒店／地点 *" : "Drop-off city / location *")}</span><input required={!isDay} name="dropoff" maxLength={150} placeholder={isDay ? (zh ? "留空则与出发地相同" : "Same as pickup if blank") : (zh ? "完整地点或酒店名" : "City, station or hotel")} /></label>
    </div> : null}
    {isDay ? <label><span>{zh ? "当天计划路线及停靠点 *" : "Planned day route and stops *"}</span><input required name="route" maxLength={300} placeholder={zh ? "例如：酒店－周边景区－酒店" : "Hotel – sights – hotel"} /></label> : null}
    {kind === "custom" ? <div className="contact-field-row">
      <label><span>{zh ? "包车天数 *" : "Number of days *"}</span><input required name="days" maxLength={60} placeholder={zh ? "例如：7天6晚" : "e.g. 7 days / 6 nights"} /></label>
      <label><span>{zh ? "计划路线及停靠点 *" : "Route and planned stops *"}</span><input required name="route" maxLength={300} placeholder={zh ? "例如：昆明－大理－沙溪－丽江" : "Kunming – Dali – Shaxi – Lijiang"} /></label>
    </div> : null}
    <div className="contact-field-row">
      <div className="driver-picker-field"><span>{zh ? "服务日期 *" : "Travel date *"}</span>
        <DriverPicker name="date" type="date" label={zh ? "选择服务日期" : "Choose travel date"} min={isArrival ? chinaServiceDate() : undefined} />
      </div>
      {kind === "custom" ? <label><span>{zh ? "结束日期（选填）" : "End date (optional)"}</span><input type="date" name="endDate" min={chinaServiceDate()} /></label> : null}
      {isArrival ? <div className="driver-picker-field"><span>{timeLabel}{zh ? "（选填，可稍后补充）" : " (optional; share later)"}</span>
        <DriverPicker name="serviceTime" type="time" label={timeLabel} required={false} />
        <small>{isKunmingTest ? (zh ? "暂未确定时间也可以继续 US$1 测试，正式接送前再确认。" : "You may complete the US$1 sandbox test without an exact time. Confirm it before a real transfer.") : requiresArrivalDetails ? (zh ? ((isDaliArrival || isLijiangArrival || isShangriLaArrival) ? "请填写航班或列车的计划抵达时间。" : "请填写航班或列车计划抵达时间。") : "Enter the scheduled arrival time of your flight or train.")
          : (isLijiangArrival || isShangriLaArrival)
            ? (zh ? "可稍后确认希望司机到酒店或古城入口接您的时间。" : "You can confirm your hotel or Old Town pickup time later.")
            : (zh ? "可以稍后确认酒店接客时间。" : "You can confirm your hotel pickup time later.")}</small>
      </div> : null}
      <DriverDropdown name="vehicle" label={zh ? "车型需求 *" : "Vehicle preference *"} placeholder={zh ? "请选择车型" : "Choose a vehicle"} required value={vehicle} onValueChange={value => { invalidateReview(); setVehicle(value); }} options={[
        { value: fiveSeat, label: zh ? "标准5座车（建议1–3人）" : "Five-seat car (1–3 recommended)" },
        { value: sevenSeat, label: zh ? "7座商务车" : "Seven-seat MPV" },
        ...(!isKunmingTest ? [{ value: "Larger vehicle - quote required", label: zh ? "更大车型（需另行报价）" : "Larger vehicle (custom quote)" }] : []),
      ]} />
    </div>
    {isArrival ? <p className="driver-area-hint">{zh
      ? "标准5座车建议1至3位乘客，最多3个大行李箱。实际车辆品牌、型号和颜色可能根据当天车源调整，最终车型类别将在订单确认时说明。"
      : "A standard five-seat car is recommended for 1–3 passengers and up to 3 large suitcases. The make, model and colour may vary with availability. We will confirm the vehicle category when confirming your booking."}</p> : null}
    <p className="driver-area-hint" aria-live="polite">{isKunmingTest
      ? (zh ? "沙盒订单测试价 US$1／车（5座或7座相同），不是实际服务报价。" : "Sandbox test price: US$1 per vehicle (five-seat or seven-seat), not an actual quote.")
      : isArrival && (!hub || !arrivalDirection || !priceArea)
      ? (zh ? "请选择交通枢纽、接送方向和酒店区域以查看参考价。" : "Select a hub, direction and hotel area to see the guide price.")
      : guidePrice === undefined
      ? (zh ? ((isDaliArrival || isLijiangArrival || isShangriLaArrival) ? "价格需人工确认" : isArrival ? "需人工确认价格" : "此选项需人工报价。") : "Request a custom quote for this option.")
      : (zh ? `当前参考报价 ¥${guidePrice}／车。确认车源和行程后提供正式报价。` : `Current guide quote: RMB ${guidePrice} per vehicle. We confirm the final price after checking availability and itinerary.`)}</p>
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
    <button className="button button-blue" type="submit" disabled={status === "sending" || status === "paying"}>
      {status === "sending" ? (zh ? "发送中…" : "Sending…") : isKunmingTest ? (zh ? "核对 US$1 测试订单" : "Review US$1 Test Order") : (zh ? "查询车辆与报价" : "Check Availability & Request Price")}
    </button>
    {isKunmingTest && paymentReview && (status === "review" || status === "paying") ? <section className="driver-form-success" aria-label={zh ? "测试订单确认" : "Review test booking"}>
      <p className="kicker">PREVIEW · STRIPE TEST MODE</p>
      <h3>{zh ? "确认接送信息与付款金额" : "Confirm Transfer Details & Amount"}</h3>
      <p><strong>{zh ? "路线：" : "Route: "}</strong>{paymentReview.route}</p>
      <p><strong>{zh ? "日期与时间：" : "Date & time: "}</strong>{paymentReview.date} · {paymentReview.time}{paymentReview.time === "To be confirmed" || paymentReview.time === "待补充" ? "" : " (China time)"}</p>
      <p><strong>{zh ? "车型：" : "Vehicle: "}</strong>{paymentReview.vehicle}</p>
      {paymentReview.transportNumber && <p><strong>{transportLabel}: </strong>{paymentReview.transportNumber}</p>}
      {paymentReview.notes && <p><strong>{zh ? "备注：" : "Notes: "}</strong>{paymentReview.notes}</p>}
      <p><strong>{zh ? "乘客：" : "Passengers: "}</strong>{paymentReview.travelers}</p>
      <p><strong>{zh ? "大行李箱：" : "Large suitcases: "}</strong>{paymentReview.luggage}</p>
      <p><strong>{zh ? "联系方式：" : "Contact: "}</strong>{paymentReview.contact}</p>
      <p><strong>{zh ? "本次支付总额：" : "Total due: "}</strong>US$1.00 (USD · Stripe test mode)</p>
      <p>{zh ? "仅验证下单、付款与订单查询，不代表真实车源确认，也不会安排车辆。" : "This checks order creation, payment and tracking only. No vehicle or real transfer will be arranged."}</p>
      <label className="driver-form-consent"><input type="checkbox" checked={testTermsAccepted} onChange={event => { event.stopPropagation(); setTestTermsAccepted(event.target.checked); }} />
        <span>{zh ? "我确认订单信息，并理解 US$1 是沙盒测试，不构成真实预订。" : "I confirm these details and understand the US$1 sandbox payment is not a real booking."}</span>
      </label>
      {error && <p role="alert" className="contact-form-error">{error}</p>}
      <button className="button button-blue" type="button" disabled={!testTermsAccepted || status === "paying"} onClick={confirmTestPayment}>
        {status === "paying" ? (zh ? "正在打开 Stripe…" : "Opening Stripe…") : (zh ? "确认并支付 US$1（测试）" : "Confirm & Pay US$1 (Test)")}
      </button>
    </section> : null}
  </form>;
}

export function StandardTransferSection({ locale, stripeTestCheckoutEnabled = false }: { locale: Locale; stripeTestCheckoutEnabled?: boolean }) {
  const zh = locale === "zh";
  const catalog = useRef<HTMLDivElement>(null);
  const resetCatalogScroll = () => {
    const region = catalog.current;
    if (region && window.matchMedia("(max-width: 800px)").matches && region.getBoundingClientRect().top < 0) {
      requestAnimationFrame(() => region.scrollIntoView({ block: "start" }));
    }
  };
  const [category, setCategory] = useState<Category | "all">("all");
  const [city, setCity] = useState("");
  const visibleProducts = filterDriverProducts(products, category, city);
  const [selected, setSelected] = useState<ProductId | "custom" | null>(null);
  const scrollToForm = () => requestAnimationFrame(() => document.getElementById("driver-quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" }));

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "driver-quote-form") setSelected(current => current ?? "custom");
      const filter = serviceFilters.find(item => item.id === hash);
      if (filter) {
        setCategory(filter.key);
        setCity("");
      }
    };
    const handleQuoteLink = (event: MouseEvent) => {
      // Shared HashLink prevents its default navigation before this delegated handler runs.
      // Still mount the custom form for valid hash-link clicks.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element && event.target.closest('a[href="#driver-quote-form"]');
      if (!link) return;
      event.preventDefault();
      setSelected("custom");
      scrollToForm();
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    document.addEventListener("click", handleQuoteLink);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      document.removeEventListener("click", handleQuoteLink);
    };
  }, []);
  const priceLabel = (product: Product, vehicle: "five" | "seven") => {
    if (stripeTestCheckoutEnabled && product.id === "kunming-arrival") return zh ? "US$1 测试价" : "US$1 test";
    const price = product.category === "arrival" ? transferStartingPrice(product.id, vehicle) : product.guidePrices?.[vehicle];
    if (price === undefined) return zh ? "价格待确认" : "Price to be confirmed";
    if (product.category === "arrival") return zh ? `¥${price}起` : `from RMB ${price}`;
    return zh ? `¥${price}` : `RMB ${price}`;
  };
  const pick = (id: ProductId) => {
    setSelected(id);
    trackEvent("driver_product_select", { product_id: id, page_path: window.location.pathname });
    scrollToForm();
  };

  return <section className="driver-section" id="standard-transfers">
    <div className="shell">
      <div className="driver-section-head">
        <p className="kicker">{zh ? "私人交通服务目录" : "YUNNAN DRIVER SERVICES"}</p>
        <h2>{zh ? "选择合适的接送与包车服务" : "Find Your Private Car Service"}</h2>
        <p>{zh ? "按城市选机场或车站接送、跨城接送和周边一日游包车。提交日期和车型后，我们会核实车源与总价。" : "Choose airport and station transfers, intercity routes or a private day trip. We confirm the car and total price before requesting payment."}</p>
      </div>
      <div ref={catalog}>
        <div className="driver-catalog-filters">
          <div className="driver-underlined-options" role="group" aria-label={zh ? "服务类别" : "Service categories"}>
            {serviceFilters.map(filter => <button id={filter.id} type="button" key={filter.key} aria-pressed={category === filter.key} onClick={() => { setCategory(filter.key); window.history.replaceState(null, "", `#${filter.id}`); resetCatalogScroll(); }}>
              {zh ? filter.zh : filter.en}
            </button>)}
          </div>
          <div className="driver-city-filter">
            <label htmlFor="driver-departure-city">{zh ? "出发城市" : "Departure city"}</label>
            <select id="driver-departure-city" name="departure-city" value={city} onChange={event => { setCity(event.currentTarget.value); resetCatalogScroll(); }}>
              <option value="">{zh ? "全部城市" : "All cities"}</option>
              {serviceCities.map(item => <option key={item.value} value={item.value}>{item[locale]}</option>)}
            </select>
          </div>
        </div>
        <p className="driver-filter-status" aria-live="polite">{zh ? `当前显示 ${visibleProducts.length} 项服务` : `${visibleProducts.length} services shown`}</p>
        <p className="sr-only" role="status">{zh ? `显示 ${visibleProducts.length} 项服务` : `${visibleProducts.length} services shown`}</p>
        {visibleProducts.length ? <div className="driver-product-grid">
          {visibleProducts.map(product => {
            const filter = serviceFilters.find(item => item.key === product.category);
            const cities = product.cities.map(value => {
              const item = serviceCities.find(entry => entry.value === value);
              return item ? (zh ? item.zh : item.en) : "";
            }).join(" / ");
            return <article className="driver-product" key={product.id}>
              <div className="driver-product-photo"><Image src={product.photo} alt="" fill sizes="(max-width:590px) 100vw, (max-width:900px) 50vw, 33vw" /></div>
              <div className="driver-product-copy">
                <p className="driver-product-meta">{cities} · {zh ? filter?.zh : filter?.en}</p>
                <h3>{zh ? product.zh : product.en}</h3>
                <p>{zh ? product.detailZh : product.detailEn}</p>
                <div className="driver-product-price">
                  <span>{stripeTestCheckoutEnabled && product.id === "kunming-arrival" ? (zh ? "PREVIEW 沙盒测试价格" : "PREVIEW sandbox price") : (zh ? "每车参考价" : "Guide prices per vehicle")}</span>
                  <dl>
                    <div><dt>{zh ? "5座" : "5-seat"}</dt><dd>{priceLabel(product, "five")}</dd></div>
                    <div><dt>{zh ? "7座" : "7-seat"}</dt><dd>{priceLabel(product, "seven")}</dd></div>
                  </dl>
                  <small>{stripeTestCheckoutEnabled && product.id === "kunming-arrival"
                     ? (zh ? "测试付款不会生成真实车辆预订" : "Test checkout only — no real vehicle booking")
                     : product.category === "day" ? (zh ? "路线与时长确认后可付全款" : "Full payment available once the route and hours are agreed") : (zh ? "确认后付全款" : "Full payment after confirmation")}</small>
                </div>
                <button type="button" className="button button-blue driver-product-action" onClick={() => pick(product.id)}>
                  {stripeTestCheckoutEnabled && product.id === "kunming-arrival"
                     ? (zh ? "选择并测试下单" : "Select & Test Booking")
                     : (zh ? "选择选项并询价" : "Select Options & Check Price")} <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>;
          })}
        </div> : <div className="driver-catalog-empty">
          <p>{zh ? "这个出发城市暂无此类标准服务。" : "There are no standard services in this category for the selected departure city."}</p>
          <button type="button" className="driver-text-link" onClick={() => setCity("")}>{zh ? "查看全部城市" : "View all cities"}</button>
        </div>}
        <p className="driver-product-footnote">{zh ? "5座和7座显示每车参考价，更大车型需人工报价。正式价格按日期、路线和车型确认。标准5座车建议1–3位旅客；更多乘客和大件行李可申请更大车型。车辆照片仅为示例，实际车型以确认单为准。" : "Guide prices are per five-seat or seven-seat vehicle. Larger vehicles are quoted individually. The written quote depends on date, route and vehicle. A five-seat car is recommended for 1–3 travellers; larger vehicles can be quoted. Photos are category examples. Vehicle details are confirmed in writing."}</p>
      </div>
      <div id="driver-quote-form">
        {selected ? <div className="driver-booking-panel" key={selected}>
          <DriverEnquiryForm locale={locale} kind={selected === "custom" ? "custom" : "standard"} serviceId={selected === "custom" ? undefined : selected} stripeTestCheckoutEnabled={stripeTestCheckoutEnabled} />
        </div> : null}
      </div>
    </div>

</section>;
}
