import type { Metadata } from "next";
import Image from "next/image";
import { DriverVehicleGallery } from "@/components/driver-vehicle-gallery";
import { setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { SiteHeader } from "@/components/site-header";
import { JourneyFactCards, JourneyHero } from "@/components/journey-landing";
import { ContentFooter } from "@/components/content-footer";
import { JsonLd } from "@/components/json-ld";
import { localizedStaticMetadata, localeUrl, type AppLocale } from "@/lib/i18n-seo";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";
import { StandardTransferSection } from "@/components/yunnan-private-driver-booking";
import { isDriverStripeTestEnabled } from "@/lib/stripe-test";
import "./yunnan-private-driver.css";

type Props = { params: Promise<{ lang: AppLocale }> };
type Pair = [string, string];

const waText = "Hello, I need a private driver in Yunnan.\n\nTravel date:\nRoute:\nPickup location:\nDrop-off location:\nPassengers:\nLarge suitcases:\nPlanned stops:\nNumber of days:";
const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === "zh";
  const title = zh ? "云南私人包车与司机服务｜大理丽江接送和定制路线" : "Yunnan Private Driver & Car Service | Transfers & Quotes";
  const description = zh
    ? "云南包车服务：昆明、大理、丽江、香格里拉机场与车站接送，跨城直达、经沙溪与虎跳峡路线，以及周边一日游包车、多日私人司机定制。"
    : "Yunnan private driver services: Kunming, Dali, Lijiang and Shangri-La airport or station transfers, intercity routes via Shaxi and Tiger Leaping Gorge, private day trips with a driver and custom multi-day drivers.";
  return localizedStaticMetadata(lang, "/yunnan-private-driver", {
    title, description,
    openGraph: { title, description, type: "website", images: [{ url: "/assets/partners/vehicles/five-seat-toyota.webp", alt: "Five-seat private driver vehicle in Yunnan service" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/assets/partners/vehicles/five-seat-toyota.webp"] }
  });
}

const faqs: Pair[] = [
  ["How much does a private driver in Yunnan cost?", "云南私人包车大概多少钱？"],
  ["Can I book and pay online?", "可以在线下单付款吗？"],
  ["Do I pay in full or pay a deposit?", "需要付全款还是定金？"],
  ["When is the remaining balance due?", "什么时候支付尾款？"],
  ["Does my driver speak English?", "司机会讲英语吗？"],
  ["Is the driver also my tour guide?", "司机也负责讲解吗？"],
  ["How many travellers and suitcases fit?", "车能坐几人、放几个大箱？"],
  ["Are expressway tolls included?", "报价包含高速费吗？"],
  ["Can we stop at attractions?", "中途能停景点吗？"],
  ["What happens after 6:00 PM?", "超过晚上6点怎么办？"],
  ["Can I change my confirmed route?", "确认之后还能改路线吗？"],
  ["What is the cancellation policy?", "取消与退款规则是什么？"],
  ["When will I receive vehicle details?", "什么时候能拿到司机车辆信息？"],
  ["What if a vehicle cannot be confirmed?", "无法安排车辆怎么办？"]
];

const faqAnswers: Pair[] = [
  ["Rates depend on the exact route, vehicle, date, waiting time and tolls. The cards show guide prices for five-seat and seven-seat vehicles. Larger vehicles are quoted individually. We confirm your written total before requesting payment.", "费用取决于具体路线、车型、日期、等候时间与高速费。卡片显示5座和7座每车参考价，更大车型需人工报价；付款前会提供书面总价。"],
  ["You can request a transfer date online. Once the route, vehicle and total price are confirmed, the licensed operator sends the agreed secure payment link. The request form does not collect payment.", "你可以在线提交接送日期与需求。核实路线、车源和总价后，持证经营方提供约定的安全付款链接；查询表单不会扣费。"],
  ["Airport, station and fixed-route transfers are paid in full after we confirm availability, the total and the change and cancellation terms. A single-day charter with agreed route and hours can be paid in full. Multi-day or flexible bookings require a 20% deposit.", "机场、车站和固定线路接送在确认车源、总价及退改条款后付全款。单日包车在路线和时长明确后可付全款；多日包车或行程仍可能调整的订单付20%定金。"],
  ["For deposit bookings, the written quote specifies the balance and when it is due.", "采用定金的订单会在书面报价中列明尾款金额和付款时间。"],
  ["Not always. Many local drivers speak Chinese; English-language coordination is available via Hidden China Travel on WhatsApp.", "不一定，很多当地司机主要讲中文；Hidden China Travel 可以通过 WhatsApp 提供英文沟通协调。"],
  ["No. A driver provides transport and agreed stops, not professional sightseeing commentary. Request an English-speaking guide separately if needed.", "不是。司机负责交通与约定停靠点，不默认包含专业景点讲解；可单独询价英文导游。"],
  ["A standard five-seat car is best for 1–3 travellers and up to three large cases, subject to suitcase dimensions. A seven-seat MPV seats up to six travellers, subject to luggage space. Larger vehicles are quoted individually.", "标准5座车建议1–3人及最多3个大箱，但实际需按行李尺寸和后备箱核实。7座商务车最多可坐6位旅客，仍需核实行李空间；更大车型另行报价。"],
  ["For the standard offers on this page, expressway tolls are extra unless explicitly included in the final written quote.", "此页标准服务的高速过路费原则上另计，除非正式书面报价明确包含。"],
  ["Direct transfers do not include sightseeing stops. Choose one of our via-Shaxi or Tiger Leaping Gorge services for planned visits; additional changes are quoted separately.", "直达接送不包含观光停靠。可直接选择经沙溪、虎跳峡的跨城产品；其他加停需求另行核价。"],
  ["A private day trip normally runs from 9:00 AM–6:00 PM and includes 30 complimentary minutes if agreed. Thereafter RMB 200 per started hour applies to approved overtime.", "周边一日游包车通常为09:00–18:00，按约定可免费延时30分钟；此后需提前获同意，按每开始1小时人民币200元计费。"],
  ["Changes can affect availability, tolls, time and price. We confirm any difference in writing before you proceed.", "变更路线可能影响车源、过路费、时长和价格，我们会先书面确认变更。"],
  ["We confirm cancellation and refund terms in writing before payment. For deposit bookings under our standard driver terms, cancellation at least three full days ahead returns the deposit. Later cancellations retain 30% of the deposit.", "付款前会书面确认退改条款。适用标准定金条款的包车订单，至少提前3个完整自然日取消可全退定金；更晚取消扣留定金的30%。"],
  ["We send the vehicle and pickup details after confirmation, with driver contact details before the journey.", "确认车源后提供车辆和接送安排，出发前提供司机联系方式。"],
  ["If the licensed operator cannot provide the confirmed service, all payments collected for that service are refunded in full.", "如持证经营方无法提供确认的服务，该服务已收款项全额退还。"]
];

export default async function YunnanPrivateDriverPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const zh = lang === "zh";
  const stripeTestCheckoutEnabled = isDriverStripeTestEnabled();
  const T = (en: string, cn: string) => zh ? cn : en;
  const heading = (kicker: string, en: string, cn: string, introEn?: string, introCn?: string) => <div className="driver-section-head"><p className="kicker">{kicker}</p><h2>{T(en, cn)}</h2>{introEn ? <p>{T(introEn, introCn || introEn)}</p> : null}</div>;
  const coverage = [
    { name: T("Kunming", "昆明"), detail: T("Changshui Airport, Kunming and Kunming South railway stations, city hotels and day trips to the Stone Forest.", "长水机场、昆明站与昆明南站接送，覆盖市区酒店及石林周边一日游。"), img: "/assets/blog/kunming-travel-guide/kunming-city.webp" },
    { name: T("Dali", "大理"), detail: T("Old Town, Xiaguan, Xizhou, Shuanglang and Erhai Lake.", "古城、下关、喜洲、双廊及洱海沿线。"), img: "/assets/destinations/yunnan/dali-erhai-cover.webp" },
    { name: T("Lijiang", "丽江"), detail: T("Old Town, Shuhe, Baisha, train station and airport.", "丽江古城、束河、白沙、火车站与机场。"), img: "/assets/destinations/yunnan/shuhe.webp" },
    { name: T("Shaxi & Tiger Leaping Gorge", "沙溪与虎跳峡"), detail: T("Custom transfers and scenic stops by advance agreement.", "提前确认路线的跨城接送及沿途停留。"), img: "/assets/destinations/yunnan/shaxi.webp" },
    { name: T("Shangri-La", "香格里拉"), detail: T("Private road transfers, subject to road and weather conditions.", "山区私人接送，需视天气和道路状况安排。"), img: "/assets/destinations/yunnan/shangri-la.webp" }
  ];
  const included = [
    T("Private vehicle and local driver", "私人用车和当地司机"),
    T("Fuel and standard parking charges", "燃油及常规停车费用"),
    T("Agreed hotel or station pickup and drop-off", "双方约定的酒店或车站接送"),
    T("English-language coordination through Hidden China Travel", "Hidden China Travel 英文沟通协调"),
    T("Day trip times agreed before booking", "一日游用车时段提前确认"),
    T("Up to 30 minutes of agreed complimentary overtime for day hire", "一日包车经约定可免费延时30分钟")
  ];
  const excluded = [
    T("Expressway tolls unless quoted as included", "高速过路费（书面报价列明包含的除外）"),
    T("Attraction tickets, meals and personal expenses", "门票、餐饮及个人消费"),
    T("Professional English-speaking tour guide", "专业英文导游"),
    T("Unplanned sightseeing or major route changes", "临时观光停靠或重大路线变更"),
    T("Overtime beyond the complimentary 30 minutes", "超过免费延时30分钟的费用")
  ];
  const whys: Pair[] = [
    ["One English-speaking contact", "一位英文沟通联系人"],
    ["Route checked before confirmation", "车源与线路提前核实"],
    ["Clear service conditions", "服务与费用透明"],
    ["Support during the journey", "旅途中协调支持"]
  ];
  const whyIcons = [
    "M4 5h16v11H9l-5 4V5Zm4 4h8m-8 3h5",
    "M12 22s7-5.5 7-13a7 7 0 1 0-14 0c0 7.5 7 13 7 13Zm-3-13 2 2 4-4",
    "M6 3h12v18H6V3Zm3 5h6m-6 4h6m-6 4h4",
    "M4 13v-2a8 8 0 0 1 16 0v2m-16 0h4v5H4v-5Zm12 0h4v5h-4v-5Zm4 5c0 2-3 3-6 3",
  ];
  const whyDescriptions: Pair[] = [
    ["Talk to us on WhatsApp instead of coordinating with several local drivers.", "通过 WhatsApp 沟通，不用自己反复联系多个当地司机。"],
    ["We review pickup points, suitcase size and planned stops before confirming.", "先核对上下车点、行李大小与沿途停靠。"],
    ["We clarify vehicle capacity, service hours, exclusions and overtime.", "提前说明车型、服务时间、不含费用及超时规则。"],
    ["If pickup or route communication is needed, we coordinate with the local driver.", "接送或路线沟通有问题时，我们协助联系当地司机。"]
  ];
  const questions = faqs.map(([en,cn],i)=>({question:T(en,cn),answer:T(faqAnswers[i][0],faqAnswers[i][1])}));

  return <main className="driver-page">
    <SiteHeader cta={{href:"#standard-transfers",label:T("View Driver Services","查看包车服务"),location:"driver_header"}} searchPlaceholder="Yunnan private driver" />
    <JourneyHero
      title={T("Explore Yunnan with a Private Driver", "云南私人包车与司机服务")}
      eyebrow={T("PRIVATE CAR & DRIVER SERVICE", "云南私人交通服务")}
      image="/home/hero.webp"
      imageAlt={T("Jade Dragon Snow Mountain in Yunnan", "云南玉龙雪山")}
      description={T("Airport and station pickups, city-to-city transfers, private day trips and multi-day routes with a local driver and English-language support.", "机场车站接送、跨城用车、周边一日游和多日包车。由当地司机接送，我们协助英文沟通。")}
      primary={{ href: "#standard-transfers", label: T("View Private Driver Services", "查看包车服务") }}
      secondary={{ href: "#custom-routes", label: T("See How It Works", "了解包车服务") }}
      note={T("We confirm the vehicle, route and total price before payment.", "先确认车型、路线和总价，再安排付款。")}
    />

    <nav className="driver-desktop-nav" aria-label={T("Private driver page navigation", "包车页面导航")}>
      <div className="shell driver-desktop-nav-inner">
        <Link href="/" aria-label="Hidden China Travel"><Image src="/brand/logo.webp" width={92} height={46} alt="" /></Link>
        <div className="driver-desktop-nav-links">
          <a href="#standard-transfers">{T("Services", "包车服务")}</a>
          <a href="#vehicles">{T("Vehicles", "如何选择车辆")}</a>
          <a href="#service-areas">{T("Coverage", "覆盖地区")}</a>
          <a href="#driver-faq">{T("FAQs", "常见问题")}</a>
        </div>
        <a className="button button-blue" href="#driver-quote-form">{T("Request a Quote", "开始询价")}</a>
      </div>
    </nav>

    <JourneyFactCards id="custom-routes" title={T("Private Driver Service at a Glance", "包车服务一览")} cards={[
      { icon: "route", title: T("From One Ride to Several Days", "一趟接送，也可多日包车"), lines: [T("Airport and station pickups, intercity rides and day trips.", "机场车站接送、跨城接送与周边一日游。"), T("For multi-day trips, agree on your route and stops before booking.", "多日行程可提前商定路线、停留点与用车安排。")] },
      { icon: "party", title: T("A Vehicle for Your Group", "按人数和行李配车"), lines: [T("Private five-seat cars and seven-seat MPVs.", "提供 5 座私家车和 7 座商务车。"), T("We check luggage space and can quote a larger vehicle.", "提前核实行李空间，也可询价安排更大车型。")] },
      { icon: "person", title: T("Local Driver, English Support", "当地司机，英文协调"), lines: [T("We help confirm pickup points and communicate with your driver.", "我们协助确认集合地点，并与当地司机沟通接送安排。"), T("An English-speaking guide can be quoted separately.", "如需专业英文导游，可另行询价。")] },
      { icon: "note", title: T("Written Quote Before Payment", "先确认书面报价，再付款"), lines: [T("Confirm the vehicle, route, price and terms with us first.", "先核实车源，并确认路线、总价和服务条款。"), T("Fixed transfers are paid in full after confirmation. Multi-day or flexible bookings use a 20% deposit.", "固定接送确认后付全款，多日或灵活包车付 20% 定金。")] },
    ]}>
      <a href="#driver-quote-form" data-custom-driver-quote>{T("Request a Custom or Multi-Day Quote", "申请定制路线或多日包车报价")} →</a>
    </JourneyFactCards>

    <StandardTransferSection locale={lang} stripeTestCheckoutEnabled={stripeTestCheckoutEnabled} />

    <section className="driver-section driver-section-soft" id="inclusions">
      <div className="shell">
        {heading("04 / SERVICE DETAILS","What the Service Includes","服务包含与不包含", "Clear boundaries are part of a good private transfer.", "正式报价应明确服务范围，避免临时争议。")}
        <div className="driver-inclusions-grid">
          <div className="driver-list-card"><h3>{T("Included","通常包含")}</h3><ul>{included.map(x=><li key={x}>{x}</li>)}</ul></div>
          <div className="driver-list-card"><h3>{T("Not Included","通常不包含")}</h3><ul>{excluded.map(x=><li key={x}>{x}</li>)}</ul></div>
        </div>
        <p className="driver-detail-note">{T("For agreed full-day hire only: overtime beyond the first 30 complimentary minutes is RMB 200 per started hour, subject to driver availability and route approval. Your written quote takes precedence.", "仅适用于已确认的一日包车：经约定的免费延时30分钟之后，每开始1小时加收人民币200元，需事先取得司机和运营方同意；具体以书面报价为准。")}</p>
      </div>
    </section>

    <section className="driver-section" id="vehicles">
      <div className="shell">
        {heading("05 / VEHICLE & LUGGAGE","How to Choose a Vehicle","如何选择车辆", "Five-seat cars and seven-seat MPVs have online guide prices. Request a custom quote for larger vehicles.", "5座车和7座商务车均可在线查看参考价，更大车型可提交需求后询价。")}
        <DriverVehicleGallery zh={zh} />
      </div>
    </section>

    <section className="driver-section driver-section-soft" id="english-support">
      <div className="shell driver-support-grid">
        <div><p className="kicker">06 / PEOPLE & COMMUNICATION</p><h2>{T("Your Driver and English-language Support","你的司机与英文沟通支持")}</h2><p>{T("Your local driver handles safe transport, agreed pickups and the confirmed driving route. Many drivers speak limited English and do not provide professional sightseeing commentary.", "当地司机负责安全驾驶、约定接送与行驶路线；部分司机英文有限，也不默认提供专业景区讲解。")}</p><p>{T("Hidden China Travel helps coordinate pickup details, hotel locations and route communication in English via WhatsApp. An English-speaking guide can be quoted separately.", "Hidden China Travel 通过 WhatsApp 协助以英文沟通接送地点、酒店和路线；如需专业英文导游，可以另行询价。")}</p></div>
        <div className="driver-support-card"><span className="driver-index">01</span><h3>{T("Local driver","当地司机")}</h3><p>{T("Driving, pickup and the agreed route.", "负责车辆接送与确认的路线。")}</p><span className="driver-index">02</span><h3>{T("Hidden China Travel","Hidden China Travel")}</h3><p>{T("English-language help with coordination.", "负责英文沟通与协调支持。")}</p><span className="driver-index">03</span><h3>{T("Optional licensed guide","可选持证导游")}</h3><p>{T("Sightseeing explanations by separate quotation.", "景区文化讲解需另外报价。")}</p></div>
      </div>
    </section>

    <section className="driver-section" id="service-areas">
      <div className="shell">
        {heading("07 / SERVICE AREAS","Private Driver Services Across Yunnan","云南私人包车覆盖地区", "From a simple transfer to a multi-day journey, routes are quoted individually.", "从点对点接送到多日路线，按照实际行程确认。")}
        <div className="driver-area-grid">{coverage.map(item=><article className="driver-area-card" key={item.name}><div><Image src={item.img} alt={item.name} fill sizes="(max-width:600px) 100vw, 25vw" /></div><h3>{item.name}</h3><p>{item.detail}</p></article>)}</div>
      </div>
    </section>

    <section className="driver-section driver-section-soft journey-support-flow driver-process" id="booking-process">
      <div className="shell journey-section-layout">
        <header className="driver-flow-heading"><p className="kicker">08 / HOW BOOKING WORKS</p><h2>{T("From Route to Confirmed Pickup","从选线路到司机接送")}</h2><p>{T("A request is not a confirmed booking. We check the driver, route and price before requesting payment.","提交咨询不代表预订成功。我们会先确认司机、路线与价格，再安排付款。")}</p></header>
        <div className="journey-support-grid">{[
          [T("Choose a service","选服务"),T("Pick a standard transfer or describe your custom route.","选择标准接送，或发送定制路线。")],
          [T("Share your date","提交日期"),T("Tell us pickup, drop-off, passengers and luggage.","提供接送点、人数和行李情况。")],
          [T("Review the quote","核对报价"),T("We check the vehicle and send confirmed total and terms.","核实车源后发送完整报价和条款。")],
          [T("Pay the agreed amount","支付约定金额"),T("Use the licensed operator’s secure payment link for the agreed full amount or deposit.","通过持证经营方提供的安全链接支付约定的全款或定金。")],
          [T("Receive confirmation","获取确认"),T("Get written booking confirmation and pickup information.","取得书面预订确认及接送安排。")]
        ].map(([h,p],i)=><article key={h}><span>{String(i+1).padStart(2,"0")}</span><h3>{h}</h3><p>{p}</p></article>)}</div>
        <p className="driver-detail-note driver-flow-note">{T("Submitting your route is free. You only pay after you review a confirmed price, service terms and payment request.","提交路线免费。核实车源并确认完整报价、服务条款及付款通知后，才需要支付约定金额。")}</p>
      </div>
    </section>

    <section className="driver-section" id="payment-policy">
      <div className="shell">
        {heading("09 / TERMS & PAYMENT","Payment and Cancellation Policy","付款与取消政策", "Driver-only service terms are separate from multi-day tour packages and are confirmed before payment.", "本页单独包车服务条款与多日旅游套餐不同，具体在付款前书面确认。")}
        <div className="driver-terms-grid">
          <article><h3>{T("Payment","付款")}</h3><p>{T("Confirmed transfers are paid in full. A single-day charter with agreed route and hours can be paid in full. Multi-day and flexible bookings require a 20% deposit, with the balance and due date in the quote.", "固定接送确认后付全款。单日包车路线和时长明确后可付全款。多日或灵活包车付20%定金，尾款金额和付款时间以书面报价为准。")}</p></article>
          <article><h3>{T("Cancellation","取消")}</h3><p>{T("Your written quote states the cancellation and refund terms for the agreed payment type before you pay.", "付款前，书面报价会列明对应付款方式的取消、改期和退款条件。")}</p></article>
          <article><h3>{T("Operator cannot provide the car","经营方无法派车")}</h3><p>{T("If the licensed operator cannot confirm or provide the booked vehicle, all payments collected for the unavailable service are refunded in full.", "如果持证经营方无法确认或提供已预订车辆，应全额退回该服务所收款项。")}</p></article>
        </div>
        <p className="driver-detail-note">{T("Example only: for a RMB 1,300 service with a RMB 260 deposit, a late-cancellation fee of 30% of the deposit is RMB 78 and the deposit refund is RMB 182.", "举例说明：若服务总价为人民币1300元，定金260元，临近出发取消扣除定金30%即78元，剩余182元退回。")}</p>
        <p className="driver-detail-note"><Link href="/private-yunnan-tours">{T("Need hotels, guides and a complete itinerary? Explore our private Yunnan tours.","需要包含酒店、向导和完整行程？查看云南私人定制游。")}</Link></p>
        <p className="driver-operator-note">{T("Contracts and payments are handled by", "旅游合同及收款由持证经营方负责：")} <strong>{zh ? licensedOperator.nameZh : licensedOperator.nameEn}</strong> · {T("Licence", "许可证")} {licensedOperator.permitNumber}. <Link href="/licensed-operator">{T("View operator details", "查看资质信息")}</Link>.</p>
      </div>
    </section>

    <JourneyFactCards
      id="why-us"
      className="driver-why-shared"
      title={T("Why Arrange Your Driver With Us?", "为什么通过我们安排包车？")}
      cards={whys.map(([en, cn], index) => ({
        icon: (["person", "route", "note", "party"] as const)[index],
        title: T(en, cn),
        lines: [T(whyDescriptions[index][0], whyDescriptions[index][1])],
        badge: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d={whyIcons[index]} />
        </svg>,
      }))}
      action={{ href: "/licensed-operator", label: T("Meet our licensed local operator", "查看当地持证旅行社") }}
    />

    <section className="driver-section driver-faq journey-faq" id="driver-faq">
      <div className="narrow">
        {heading("11 / YOUR QUESTIONS","Private Driver FAQs","云南包车常见问题", "Practical answers before you send an enquiry.", "提交需求前，先看看常见的路线与费用问题。")}
        {questions.map(x=><details key={x.question}><summary>{x.question}<span aria-hidden="true">+</span></summary><p>{x.answer}</p></details>)}
      </div>
    </section>

    <section id="custom-quote">
      <div className="driver-editorial-close">
        <Image src="/assets/destinations/yunnan/lijiang-shangri-la/yangtze-first-bend-shigu.webp" alt="" fill sizes="100vw" />
        <div className="journey-hero-shade" />
        <div className="shell driver-editorial-close-inner"><div className="driver-editorial-close-copy">
          <h2 className="journey-final-title">{T("Ready to Arrange Your Yunnan Private Driver?", "准备安排云南私人包车了吗？")}</h2>
          <p>{T("Share your route, travel dates and group size. We’ll check availability and send you a written quote.", "告诉我们你的路线、日期和人数，我们会核实车源并提供书面报价。")}</p>
          <div className="driver-editorial-actions">
            <a className="button button-blue" href="#driver-quote-form">{T("Request a Private Driver Quote", "开始询价")} <span aria-hidden="true">→</span></a>
            <a className="button button-outline-light" href={whatsapp} target="_blank" rel="noopener noreferrer">{T("Chat on WhatsApp", "WhatsApp 咨询")}</a>
          </div>
        </div></div>
      </div>
    </section>
    <ContentFooter />
    <JsonLd data={{
      "@context":"https://schema.org",
      "@graph":[
        {"@type":"WebPage",name:T("Yunnan Private Driver and Car Service","云南私人包车与司机服务"),url:localeUrl(lang,"/yunnan-private-driver"),inLanguage:zh?"zh-Hans":"en"},
        {"@type":"Service",name:T("Private car with driver in Yunnan","云南私人包车服务"),serviceType:"Private vehicle with local driver",areaServed:[{"@type":"Place",name:"Yunnan, China"}],provider:{"@type":"TravelAgency",name:licensedOperator.nameEn}},
        {"@type":"FAQPage",mainEntity:questions.map(x=>({"@type":"Question",name:x.question,acceptedAnswer:{"@type":"Answer",text:x.answer}}))}
      ]
    }} />
  </main>;
}
