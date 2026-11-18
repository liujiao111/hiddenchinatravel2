import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { SiteHeader } from "@/components/site-header";
import { JourneyFactCards } from "@/components/journey-landing";
import { ContentFooter } from "@/components/content-footer";
import { JsonLd } from "@/components/json-ld";
import { localizedStaticMetadata, localeUrl, type AppLocale } from "@/lib/i18n-seo";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";
import { StandardTransferSection, CustomDriverForm } from "@/components/yunnan-private-driver-booking";
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
    ? "云南包车服务：昆明、大理、丽江、香格里拉机场与车站接送，跨城直达、经沙溪与虎跳峡路线，以及9小时日包车、多日私人司机定制。"
    : "Yunnan private driver services: Kunming, Dali, Lijiang and Shangri-La airport or station transfers, intercity routes via Shaxi and Tiger Leaping Gorge, 9-hour day charters and custom multi-day drivers.";
  return localizedStaticMetadata(lang, "/yunnan-private-driver", {
    title, description,
    openGraph: { title, description, type: "website", images: [{ url: "/assets/partners/vehicles/five-seat-toyota.webp", alt: "Five-seat private driver vehicle in Yunnan service" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/assets/partners/vehicles/five-seat-toyota.webp"] }
  });
}

const faqs: Pair[] = [
  ["How much does a private driver in Yunnan cost?", "云南私人包车大概多少钱？"],
  ["Can I book and pay online?", "可以在线下单付款吗？"],
  ["How much deposit do I pay?", "需要支付多少定金？"],
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
  ["Rates depend on the exact route, vehicle, date, waiting time and tolls. We confirm a written total before asking you to pay; no fixed online fare has been published yet.", "费用取决于具体路线、车型、日期、等候时间与高速费。会先提供书面报价；目前没有上线固定在线支付价。"],
  ["You can request a transfer date online. Once the route, vehicle and total price are confirmed, the licensed operator sends the agreed secure payment link. The request form does not collect payment.", "你可以在线提交接送日期与需求。核实路线、车源和总价后，持证经营方提供约定的安全付款链接；查询表单不会扣费。"],
  ["For confirmed driver-only services, the deposit is 20% of the agreed total and is payable after vehicle and price confirmation.", "单独包车服务的定金为确认总价的20%，在车源和报价确认后支付。"],
  ["The remaining 80% is normally payable after the driver picks you up, as specified in your booking confirmation.", "尾款通常在司机接到旅客后支付 80%，以预订确认单约定为准。"],
  ["Not always. Many local drivers speak Chinese; English-language coordination is available via Hidden China Travel on WhatsApp.", "不一定，很多当地司机主要讲中文；Hidden China Travel 可以通过 WhatsApp 提供英文沟通协调。"],
  ["No. A driver provides transport and agreed stops, not professional sightseeing commentary. Request an English-speaking guide separately if needed.", "不是。司机负责交通与约定停靠点，不默认包含专业景点讲解；可单独询价英文导游。"],
  ["A standard five-seat car is best for 1–3 travellers and up to three large cases, subject to suitcase dimensions. For more people or luggage, request a larger vehicle.", "标准5座车建议1–3人及最多3个大箱，但实际需按行李尺寸和后备箱核实。更多人数或行李请申请更大车型。"],
  ["For the standard offers on this page, expressway tolls are extra unless explicitly included in the final written quote.", "此页标准服务的高速过路费原则上另计，除非正式书面报价明确包含。"],
  ["Direct transfers do not include sightseeing stops. Choose one of our via-Shaxi or Tiger Leaping Gorge services for planned visits; additional changes are quoted separately.", "直达接送不包含观光停靠。可直接选择经沙溪、虎跳峡的跨城产品；其他加停需求另行核价。"],
  ["A confirmed 9-hour day charter normally runs from 9:00 AM–6:00 PM and includes 30 complimentary minutes if agreed. Thereafter RMB 200 per started hour applies to approved overtime.", "确认的9小时日包车通常为09:00–18:00，按约定可免费延时30分钟；此后需提前获同意，按每开始1小时人民币200元计费。"],
  ["Changes can affect availability, tolls, time and price. We confirm any difference in writing before you proceed.", "变更路线可能影响车源、过路费、时长和价格，我们会先书面确认变更。"],
  ["For confirmed driver-only bookings, cancellation at least three full days before service returns the deposit. Later cancellations retain 30% of the deposit. The signed booking agreement states the exact terms; multi-day tour policies differ.", "已确认的单独包车服务：至少提前3个完整自然日取消可退还全部定金；更晚取消扣留定金的30%。具体以签订的预订协议为准；多日旅游套餐政策不同。"],
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
    { name: T("Dali", "大理"), detail: T("Old Town, Xiaguan, Xizhou, Shuanglang and Erhai Lake.", "古城、下关、喜洲、双廊及洱海沿线。"), img: "/assets/destinations/yunnan/dali-erhai-cover.webp" },
    { name: T("Lijiang", "丽江"), detail: T("Old Town, Shuhe, Baisha, train station and airport.", "丽江古城、束河、白沙、火车站与机场。"), img: "/assets/destinations/yunnan/shuhe.webp" },
    { name: T("Shaxi & Tiger Leaping Gorge", "沙溪与虎跳峡"), detail: T("Custom transfers and scenic stops by advance agreement.", "提前确认路线的跨城接送及沿途停留。"), img: "/assets/destinations/yunnan/shaxi.webp" },
    { name: T("Shangri-La", "香格里拉"), detail: T("Private road transfers, subject to road and weather conditions.", "山区私人接送，需视天气和道路状况安排。"), img: "/assets/destinations/yunnan/shangri-la.webp" }
  ];
  const included = [
    T("Private five-seat vehicle and local driver", "5座私人用车和当地司机"),
    T("Fuel and standard parking charges", "燃油及常规停车费用"),
    T("Agreed hotel or station pickup and drop-off", "双方约定的酒店或车站接送"),
    T("English-language coordination through Hidden China Travel", "Hidden China Travel 英文沟通协调"),
    T("9 AM–6 PM for confirmed full-day bookings", "确认的一日包车为 09:00–18:00"),
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
  const whyDescriptions: Pair[] = [
    ["Talk to us on WhatsApp instead of coordinating with several local drivers.", "通过 WhatsApp 沟通，不用自己反复联系多个当地司机。"],
    ["We review pickup points, suitcase size and planned stops before confirming.", "先核对上下车点、行李大小与沿途停靠。"],
    ["We clarify vehicle capacity, service hours, exclusions and overtime.", "提前说明车型、服务时间、不含费用及超时规则。"],
    ["If pickup or route communication is needed, we coordinate with the local driver.", "接送或路线沟通有问题时，我们协助联系当地司机。"]
  ];
  const questions = faqs.map(([en,cn],i)=>({question:T(en,cn),answer:T(faqAnswers[i][0],faqAnswers[i][1])}));

  return <main className="driver-page">
    <SiteHeader cta={{href:"#standard-transfers",label:T("View Driver Services","查看包车服务"),location:"driver_header"}} searchPlaceholder="Yunnan private driver" />
    <section className="driver-hero">
      <div className="shell driver-hero-grid">
        <div className="driver-hero-copy">
          <p className="kicker">{T("PRIVATE ROAD TRAVEL · YUNNAN", "云南 · 私人交通服务")}</p>
          <h1>{T("Private Driver and Car Service in Yunnan", "云南私人包车与司机服务")}</h1>
          <p className="driver-hero-intro">{T("Travel between Dali, Lijiang, Shaxi, Shangri-La, Kunming and surrounding destinations with a private vehicle, local driver and English-language support.", "提供大理、丽江、沙溪、香格里拉、昆明及周边地区的私人用车、当地司机与英文沟通协调。")}</p>
          <p>{T("Choose from eleven transfer and day-charter options, or tell us about a custom multi-day route. We confirm availability and price before arranging any deposit.", "从11个标准接送与包车产品中选择，或提交多日定制路线；确认车源与价格后再安排定金支付。")}</p>
          <ul className="driver-hero-tags">
            {[T("Private car and local driver","私人用车及当地司机"),T("Airport, station & hotel pickups","机场、车站和酒店接送"),T("1–3 travellers in standard car","标准车建议1–3人"),T("English support on WhatsApp","WhatsApp 英文支持")].map(x=><li key={x}>{x}</li>)}
          </ul>
          <div className="driver-action-row">
            <a className="button button-blue" href="#standard-transfers">{T("Explore Driver Services", "查看包车产品")}</a>
            <a className="button button-light" href="#custom-routes">{T("Custom & Multi-Day", "定制与多日包车")}</a>
          </div>
          <a className="driver-text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">{T("Prefer to talk first? Chat on WhatsApp", "想先沟通？在 WhatsApp 联系我们")}</a>
        </div>
        <div className="driver-hero-visual">
          <figure className="driver-hero-car"><Image src="/assets/partners/vehicles/five-seat-toyota.webp" alt={T("Example of a real five-seat car used for private transfers", "可用于私人接送的真实5座车型示例")} fill priority sizes="(max-width:800px) 100vw, 46vw" /></figure>
          <div className="driver-hero-landscape"><Image src="/assets/destinations/yunnan/dali-erhai-cover.webp" alt={T("Roadside landscape near Erhai Lake in Dali", "大理洱海沿线景观")} fill sizes="(max-width:800px) 100vw, 46vw" /></div>
          <p>{T("Real vehicle example · exact car confirmed before booking", "真实车型示例 · 实际派车以预订前确认为准")}</p>
        </div>
      </div>
      <div className="shell driver-hero-trust">
        <span>{T("Written quote before payment", "付款前提供书面报价")}</span>
        <span>{T("20% deposit after confirmation", "确认后支付20%定金")}</span>
        <span>{T("Driver-only cancellation terms explained upfront", "包车取消规则提前告知")}</span>
      </div>
    </section>

    <StandardTransferSection locale={lang} stripeTestCheckoutEnabled={stripeTestCheckoutEnabled} />

    <section className="driver-section driver-custom-entry" id="custom-routes">
      <div className="shell">
        <div className="driver-custom-entry-layout">
          <div>
            <p className="kicker">{T("04 / BESPOKE SERVICE", "04 / 定制服务")}</p>
            <h2>{T("Custom & Multi-Day Driver", "定制路线与多日包车")}</h2>
            <p>{T("Need a route beyond the eleven options above? We can arrange a private driver for multi-city journeys, family trips, longer stays, photography days or special sightseeing stops, with the vehicle and quote matched to your plan.", "没有找到合适的标准路线？昆明、大理、丽江、香格里拉多日用车，家庭旅行、摄影路线和特殊停靠都可以按实际行程匹配车辆与报价。")}</p>
            <p className="driver-custom-examples">{T("Multi-day routes · Larger groups · Flexible sightseeing · Non-standard pickups", "多日路线 · 更多乘客 · 灵活游览 · 特殊接送点")}</p>
            <div className="driver-action-row">
              <a className="button button-blue" href="#custom-quote">{T("Request a Custom Quote", "申请定制包车报价")}</a>
              <a className="driver-text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">{T("Chat on WhatsApp", "WhatsApp 咨询")}</a>
            </div>
          </div>
          <figure className="driver-custom-entry-photo">
            <Image src="/assets/destinations/yunnan/lijiang-shangri-la/yangtze-first-bend-shigu.webp" alt={T("Yunnan landscape on a scenic private driving route", "云南自驾路线上山地景观")} fill sizes="(max-width:800px) 100vw, 38vw" />
          </figure>
        </div>
      </div>
    </section>

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
        {heading("05 / VEHICLE & LUGGAGE","Is This Vehicle Right for Your Group?","这辆车适合你们吗？", "Our starting category is a five-seat private car, with a larger vehicle arranged when needed.", "标准车型为5座私人汽车；如果人数和行李较多，可另行安排更大车型。")}
        <div className="driver-vehicle-grid">
          <div className="driver-vehicle-photo"><Image src="/assets/partners/vehicles/five-seat-hongqi.webp" alt={T("Actual five-seat car example", "真实5座车示例")} fill sizes="(max-width:760px) 100vw, 48vw" /></div>
          <div className="driver-vehicle-copy"><h3>{T("A realistic fit, not just a seat count","合适的乘坐空间，不只是座位数")}</h3><dl>
            <div><dt>{T("Vehicle category","车型")}</dt><dd>{T("Five-seat private car","5座私人汽车")}</dd></div>
            <div><dt>{T("Recommended group","建议人数")}</dt><dd>{T("1–3 travellers","1–3人")}</dd></div>
            <div><dt>{T("Luggage guide","行李参考")}</dt><dd>{T("Up to 3 large cases · dimensions checked","最多3个大箱 · 需核实尺寸")}</dd></div>
            <div><dt>{T("Larger party","更多旅客")}</dt><dd>{T("Request a custom vehicle","单独匹配更大车型")}</dd></div>
          </dl><p>{T("We verify your suitcase sizes and vehicle boot space before confirming. The exact make, model and colour may vary from the photos.", "我们会核实箱子尺寸和后备箱空间后再确认车型。车辆品牌、型号与颜色可能和照片不同。")}</p><a href="#custom-quote" className="driver-text-link">{T("Need a larger vehicle? Request a quote","需要更大车型？提交需求")}</a></div>
        </div>
        <div className="driver-vehicle-gallery">
          <figure><Image src="/assets/partners/vehicles/five-seat-toyota.webp" alt="Five-seat Toyota example" fill sizes="(max-width:760px) 50vw, 24vw" /></figure>
          <figure><Image src="/assets/partners/vehicles/five-seat-aion.webp" alt="Five-seat Aion example" fill sizes="(max-width:760px) 50vw, 24vw" /></figure>
          <figure><Image src="/assets/partners/vehicles/five-seat-hongqi.webp" alt="Five-seat Hongqi example" fill sizes="(max-width:760px) 50vw, 24vw" /></figure>
        </div>
        <p className="driver-image-note">{T("Real vehicle examples from local partners. Interior and loaded-luggage photos will be added after the assigned vehicle is verified; no particular model or capacity is guaranteed by the images.", "以上为当地合作方提供的真实车型示例。内饰及装箱照片待核实实际派车后补充；图片不保证具体车型或行李容量。")}</p>
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
        <header className="driver-flow-heading"><p className="kicker">08 / HOW BOOKING WORKS</p><h2>{T("From Route to Confirmed Pickup","从选线路到司机接送")}</h2><p>{T("A request is not a confirmed booking. We check the driver, route and price before requesting any deposit.","提交咨询不代表预订成功。我们会先确认司机、路线与价格，再安排定金支付。")}</p></header>
        <div className="journey-support-grid">{[
          [T("Choose a service","选服务"),T("Pick a standard transfer or describe your custom route.","选择标准接送，或发送定制路线。")],
          [T("Share your date","提交日期"),T("Tell us pickup, drop-off, passengers and luggage.","提供接送点、人数和行李情况。")],
          [T("Review the quote","核对报价"),T("We check the vehicle and send confirmed total and terms.","核实车源后发送完整报价和条款。")],
          [T("Pay the deposit","支付定金"),T("Pay 20% using the licensed operator's agreed secure channel.","通过持证经营方确认的安全渠道支付20%定金。")],
          [T("Receive confirmation","获取确认"),T("Get written booking confirmation and pickup information.","取得书面预订确认及接送安排。")]
        ].map(([h,p],i)=><article key={h}><span>{String(i+1).padStart(2,"0")}</span><h3>{h}</h3><p>{p}</p></article>)}</div>
        <p className="driver-detail-note driver-flow-note">{T("Submitting your route is free. You only pay after you review a confirmed price, service terms and payment request.","提交路线免费。核实车源并确认完整报价、服务条款及付款通知后，才需要支付定金。")}</p>
      </div>
    </section>

    <section className="driver-section" id="payment-policy">
      <div className="shell">
        {heading("09 / TERMS & PAYMENT","Payment and Cancellation Policy","付款与取消政策", "Driver-only service terms are separate from multi-day tour packages and are confirmed before payment.", "本页单独包车服务条款与多日旅游套餐不同，具体在付款前书面确认。")}
        <div className="driver-terms-grid">
          <article><h3>{T("Payment","付款")}</h3><p>{T("The planned schedule is a 20% deposit once price and vehicle are confirmed, then the remaining 80% after pickup. Payment requests are issued by the licensed operator.", "计划付款安排：车源和总价确认后付20%定金，司机接客后付80%尾款。支付通知由持证经营方提供。")}</p></article>
          <article><h3>{T("Cancellation","取消")}</h3><p>{T("For confirmed driver-only reservations, cancelling at least three full days ahead returns the full deposit. Within three days, 30% of the deposit is retained and 70% refunded, subject to the signed agreement.", "已确认的单独包车服务：至少提前3个完整自然日取消，全额退还定金；3天内取消，扣留定金的30%，退还70%，以双方签署的约定为准。")}</p></article>
          <article><h3>{T("Operator cannot provide the car","经营方无法派车")}</h3><p>{T("If the licensed operator cannot confirm or provide the booked vehicle, all payments collected for the unavailable service are refunded in full.", "如果持证经营方无法确认或提供已预订车辆，应全额退回该服务所收款项。")}</p></article>
        </div>
        <p className="driver-detail-note">{T("Example only: for a RMB 1,300 service with a RMB 260 deposit, a late-cancellation fee of 30% of the deposit is RMB 78 and the deposit refund is RMB 182.", "举例说明：若服务总价为人民币1300元，定金260元，临近出发取消扣除定金30%即78元，剩余182元退回。")}</p>
        <p className="driver-detail-note"><Link href="/private-yunnan-tours">{T("Need hotels, guides and a complete itinerary? Explore our private Yunnan tours.","需要包含酒店、向导和完整行程？查看云南私人定制游。")}</Link></p>
        <p className="driver-operator-note">{T("Contracts and payments are handled by", "旅游合同及收款由持证经营方负责：")} <strong>{zh ? licensedOperator.nameZh : licensedOperator.nameEn}</strong> · {T("Licence", "许可证")} {licensedOperator.permitNumber}. <Link href="/licensed-operator">{T("View operator details", "查看资质信息")}</Link>.</p>
      </div>
    </section>

    <JourneyFactCards id="why-us" className="driver-why-shared" title={T("Why Arrange Your Driver With Us?","为什么通过我们安排包车？")} cards={whys.map(([en,cn],i)=>({icon: (["person","route","note","party"] as const)[i],title:T(en,cn),lines:[T(whyDescriptions[i][0],whyDescriptions[i][1])]}))} action={{href:"/licensed-operator",label:T("Meet our licensed local operator","查看当地持证旅行社")}} />

    <section className="driver-section driver-faq journey-faq" id="driver-faq">
      <div className="narrow">
        {heading("11 / YOUR QUESTIONS","Private Driver FAQs","云南包车常见问题", "Practical answers before you send an enquiry.", "提交需求前，先看看常见的路线与费用问题。")}
        {questions.map(x=><details key={x.question}><summary>{x.question}<span aria-hidden="true">+</span></summary><p>{x.answer}</p></details>)}
      </div>
    </section>

    <section className="driver-section driver-section-soft driver-final" id="custom-quote">
      <div className="shell">
        {heading("12 / START HERE","Ready to Arrange Your Private Driver?","准备安排云南私人包车了吗？", "Choose a standard transfer above, or share your own route below. You can also contact us directly on WhatsApp.", "可以在上方选择标准接送，也可以在下面提交定制路线，或直接通过 WhatsApp 沟通。")}
        <div className="driver-final-grid"><div className="driver-final-copy">
          <h3>{T("A route that fits your trip","安排真正适合你行程的车")}</h3>
          <p>{T("We review pickup points, driving time, sightseeing stops, passenger count and luggage — then suggest a suitable vehicle and a written quote.", "我们会核实接送点、行驶时间、途中停留、人数和行李，再匹配合适车型并提供书面报价。")}</p>
          <a className="button button-light" href="#standard-transfers">{T("View Standard Transfers","查看标准接送服务")}</a>
          <p>{T("Prefer to talk first?", "想先咨询？")}</p>
          <a className="driver-text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">{T("Chat with us on WhatsApp","通过 WhatsApp 联系我们")}</a>
          <p className="driver-final-muted">{T("No payment is required to request a quotation or check a route.", "路线查询与索取报价不需要支付任何费用。")}</p>
        </div><CustomDriverForm locale={lang}/></div>
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
