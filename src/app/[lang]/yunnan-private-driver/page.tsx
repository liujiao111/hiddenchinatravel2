import type { Metadata } from "next";
import Image from "next/image";
import { DriverVehicleGallery } from "@/components/driver-vehicle-gallery";
import { setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { SiteHeader } from "@/components/site-header";
import { JourneyFactCards, JourneyHero } from "@/components/journey-landing";
import { ContentFooter } from "@/components/content-footer";
import { Testimonials } from "@/components/testimonials";
import { getDriverLiveTestPaymentLink, getDriverStripeTestMode } from "@/lib/stripe-test";
import { JsonLd } from "@/components/json-ld";
import { localizedStaticMetadata, localeUrl, type AppLocale } from "@/lib/i18n-seo";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";
import { StandardTransferSection } from "@/components/yunnan-private-driver-booking";
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
  ["Yes. Select a priced standard service, enter your trip details and continue to Stripe to pay in full. We confirm driver allocation after payment. Custom and unpriced routes require a quotation first. If we cannot provide a paid service, your payment is refunded in full.", "可以。选择已定价标准服务并填写用车信息后，前往 Stripe 支付全款，再由我们确认派车。定制及未定价路线先询价；如无法提供已付款的服务，所付款项全额退还。"],
  ["Priced standard services are paid in full through Stripe before driver allocation. Multi-day and custom services follow the payment schedule in your written quote.", "已定价标准服务通过 Stripe 支付全款后安排派车。多日和定制服务以书面报价约定的付款安排为准。"],
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
  const stripeTestMode = getDriverStripeTestMode();
  const liveVerificationLink = stripeTestMode === "live" ? getDriverLiveTestPaymentLink()?.toString() : undefined;
  const zh = lang === "zh";
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
  const questions = faqs.map(([en,cn],i)=>({question:T(en,cn),answer:T(faqAnswers[i][0],faqAnswers[i][1])}));

  return <main className="driver-page">
    <SiteHeader cta={{href:"#standard-transfers",label:T("View Driver Services","查看包车服务"),location:"driver_header"}} searchPlaceholder="Yunnan private driver" />
    <JourneyHero
      title={T("Yunnan Private Driver & Car Hire — Travel at Your Own Pace", "云南私人包车｜路交给老司机，时间留给风景")}
      eyebrow={T("PRIVATE CAR & DRIVER SERVICE", "云南私人交通服务")}
      image="/home/hero.webp"
      imageAlt={T("Jade Dragon Snow Mountain in Yunnan", "云南玉龙雪山")}
      description={T("Travel between Kunming, Dali, Lijiang and Shangri-La with your own private vehicle and local driver. From airport pickups to scenic road trips, we help check your route, match a suitable car and coordinate in English.", "从昆明、大理、丽江到香格里拉，安排专属车辆与当地司机。无论机场接送还是多日自驾式旅行，我们协助核实路线、匹配车型，并提供英文沟通协调。")}
      primary={{ href: "#standard-transfers", label: T("Explore Routes & Prices", "查看路线与参考价") }}
      secondary={{ href: "#multi-day-driver", label: T("Plan a Multi-Day Road Trip", "规划多日包车路线") }}
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

    <JourneyFactCards id="custom-routes" title={T("More Than a Ride — A More Relaxed Way to Travel", "不只是包车，更是一路省心的旅行")} cards={[
      { icon: "note", title: T("The Little Details Matter", "小细节，少一点旅途麻烦"), lines: [T("From clear pickup instructions to practical travel needs, we help prepare the details before you get in.", "从清晰的接送点到旅途中的实际需求，我们提前沟通准备，减少临时麻烦。"), T("Need water, charging access or a child seat? Tell us in advance so we can confirm what's available.", "需要饮用水、充电设备或儿童座椅？提前告诉我们，以便确认安排。")] },
      { icon: "party", title: T("Room for Everyone", "一家人同行，也能从容舒适"), lines: [T("Parents, kids and suitcases all matter. We check passenger numbers, luggage space and suitable vehicle options before confirmation.", "爸妈坐得舒适，孩子有空间，行李放得下。确认前核对人数、行李与合适车型。"), T("A family trip should fit the people travelling, not just the route.", "一家人出行，节奏应该照顾每个人，而不只是赶路。")] },
      { icon: "route", title: T("Your Journey, Your Pace", "把时间留给沿途的风景"), lines: [T("Plan scenic stops, photo breaks and time to rest along your route, with the schedule agreed in advance.", "想拍照就多留一会儿，累了就安排休息；沿途停靠与用车时间提前商定。"), T("Flexible day trips and multi-day charters are designed around your plans, subject to road and safety conditions.", "一日游与多日包车可按需求规划，具体以路况、安全和约定行程为准。")] },
      { icon: "person", title: T("Local Knowledge, Less Hassle", "熟悉云南的路，也懂旅途的细节"), lines: [T("Local drivers know practical routes and pickup points, and may suggest stops or places to eat along the way.", "当地司机熟悉常走路线与接送点，也可根据经验提供沿途停靠或用餐建议。"), T("We coordinate in English when needed; professional sightseeing guiding is a separate service.", "需要时由我们协助英文沟通；专业景点讲解需另行安排。")] },
    ]}>
      <a href="#driver-quote-form" data-custom-driver-quote>{T("Tell Us About Your Trip", "告诉我们你的行程")} →</a>
    </JourneyFactCards>
    <Testimonials firstReview="lijiang-family" />

    <section id="multi-day-driver">
      <div className="driver-editorial-close">
        <Image src="/assets/destinations/yunnan/lijiang-shangri-la/yangtze-first-bend-shigu.webp" alt="" fill sizes="100vw" />
        <div className="journey-hero-shade" />
        <div className="shell driver-editorial-close-inner"><div className="driver-editorial-close-copy">
          <p className="kicker">{T("CUSTOM & MULTI-DAY ROUTES", "定制路线与多日包车")}</p>
          <h2 className="journey-final-title">{T("Already Have a Yunnan Road Trip in Mind?", "已有云南自驾式旅行路线？")}</h2>
          <p>{T("Share your travel dates, route, group size and luggage. We'll check road conditions and driver availability, recommend a suitable vehicle and prepare a written quote. No payment is needed to enquire.", "告诉我们出行日期、路线、人数和行李数量。我们会核实路况与车源、推荐合适车型，并提供书面报价。提交询价无需付款。")}</p>
          <p>{T("Remote mountain routes and additional sightseeing stops are confirmed individually.", "偏远山区路线和额外观光停靠需逐项核实后确认。")}</p>
          <div className="driver-editorial-actions">
            <a className="button button-blue" href="#driver-quote-form" data-custom-driver-quote>{T("Get a Custom Driver Quote", "获取定制包车报价")} <span aria-hidden="true">→</span></a>
            <a className="button button-outline-light" href={whatsapp} target="_blank" rel="noopener noreferrer">{T("Chat on WhatsApp", "WhatsApp 咨询")}</a>
          </div>
        </div></div>
      </div>
    </section>

    <StandardTransferSection locale={lang} stripeTestMode={stripeTestMode} />

    {liveVerificationLink ? <section className="driver-section driver-section-soft" id="stripe-live-test-product">
      <div className="shell">
        <div className="driver-section-head">
          <p className="kicker">STRIPE LIVE · PAYMENT VERIFICATION</p>
          <h2>{T("Test Payment — US$1", "支付测试产品 — US$1")}</h2>
          <p>{T("A separate checkout product for testing real payment processing. No transport, tour or booking is included.", "用于验证真实 Stripe 收款的独立测试产品，不包含包车、旅游服务或有效预订。")}</p>
        </div>
        <div className="driver-list-card" style={{ maxWidth: 560 }}>
          <h3>{T("US$1 Live Payment Test", "US$1 生产环境支付测试")}</h3>
          <p>{T("Amount charged: US$1.00 (real card charge). This is not Stripe sandbox mode and test card numbers will not work.", "实扣金额：US$1.00。此为 Stripe 生产环境真实扣款，不能使用沙盒测试卡号。")}</p>
          <p>{T("Only pay if you intend to verify this checkout. Any refund must be processed separately; paying does not create an order.", "仅在需要验证收款时支付；退款需另行处理，付款不会生成包车订单。")}</p>
          <a className="button button-blue" href={liveVerificationLink} target="_blank" rel="noopener noreferrer nofollow">
            {T("Pay US$1 to Test Stripe", "支付 US$1 测试 Stripe")}
          </a>
        </div>
      </div>
    </section> : null}

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

    <section className="driver-section driver-faq journey-faq" id="driver-faq">
      <div className="narrow">
        {heading("10 / YOUR QUESTIONS","Private Driver FAQs","云南包车常见问题", "Practical answers before you send an enquiry.", "提交需求前，先看看常见的路线与费用问题。")}
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
    <ContentFooter reviewsInPage />
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
