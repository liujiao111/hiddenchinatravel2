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
  const title = zh ? "云南私人包车与司机服务｜昆明大理丽江接送与包车价格" : "Yunnan Private Driver & Car Hire | Transfers & Day Trips";
  const description = zh
    ? "云南私人包车与司机服务：昆明、大理、丽江、香格里拉机场接送、跨城包车、一日游及多日包车。查看5座、7座美元报价，在线预订或定制路线。"
    : "Hire a private driver in Yunnan for Kunming, Dali, Lijiang and Shangri-La. Compare car prices, book private transfers or plan flexible multi-day journeys with local support.";
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
  ["Standard five-seat intercity journeys cost US$105–135 per vehicle depending on route. Day hire starts at approximately US$150 per day. Vehicle, driver, fuel, tolls and parking are included, with no hidden fees. Seven-seat adds US$23 on direct transfers and US$30 on scenic transfers or per day on day and multi-day hire; airport transfers have separate prices.", "标准5座跨城路线按具体行程 US$105–135/车，周边一日游包车从 US$150/天起。车辆、司机、燃油、高速费及停车费均包含，无隐藏费用。7座直达路线增加约 US$23，途经沙溪／虎跳峡的线路以及一日、多日包车每次／每天增加约 US$30；机场接送另有报价。"],
  ["Yes. Select a priced standard service, enter your trip details and continue to Stripe to pay in full. We confirm driver allocation after payment. Custom and unpriced routes require a quotation first. If we cannot provide a paid service, your payment is refunded in full.", "可以。选择已定价标准服务并填写用车信息后，前往 Stripe 支付全款，再由我们确认派车。定制及未定价路线先询价；如无法提供已付款的服务，所付款项全额退还。"],
  ["Priced standard services are paid in full through Stripe before driver allocation. Multi-day driver products accept a 20% online deposit in USD; any bespoke service follows the written quote.", "已定价标准服务通过 Stripe 支付全款后安排派车。多日包车产品以美元在线支付20%定金，其他定制服务以书面报价为准。"],
  ["For deposit bookings, the written quote specifies the balance and when it is due.", "采用定金的订单会在书面报价中列明尾款金额和付款时间。"],
  ["Not always. Many local drivers speak Chinese; English-language coordination is available via Hidden China Travel on WhatsApp.", "不一定，很多当地司机主要讲中文；Hidden China Travel 可以通过 WhatsApp 提供英文沟通协调。"],
  ["No. A driver provides transport and agreed stops, not professional sightseeing commentary. Request an English-speaking guide separately if needed.", "不是。司机负责交通与约定停靠点，不默认包含专业景点讲解；可单独询价英文导游。"],
  ["A standard five-seat car is best for 1–3 travellers and up to three large cases, subject to suitcase dimensions. A seven-seat MPV seats up to six travellers, subject to luggage space. Larger vehicles are quoted individually.", "标准5座车建议1–3人及最多3个大箱，但实际需按行李尺寸和后备箱核实。7座商务车最多可坐6位旅客，仍需核实行李空间；更大车型另行报价。"],
  ["Our standard intercity and city-area prices include the car, driver, fuel, expressway tolls and parking. No hidden fees for the agreed route and hours. Airport and railway station transfers follow separately quoted terms.", "标准跨城及市区包车包含车辆、司机、燃油、高速费和停车费，约定路线和用车时间内无任何隐藏费用；机场及高铁站接送按各自报价规则执行。"],
  ["Direct transfers do not include sightseeing stops. Choose one of our via-Shaxi or Tiger Leaping Gorge services for planned visits; additional changes are quoted separately.", "直达接送不包含观光停靠。可直接选择经沙溪、虎跳峡的跨城产品；其他加停需求另行核价。"],
  ["A private day trip normally runs from 9:00 AM–6:00 PM and includes 30 complimentary minutes if agreed. Thereafter US$15 per started hour applies to approved overtime.", "周边一日游包车通常为09:00–18:00，按约定可免费延时30分钟；此后需提前获同意，按每开始1小时加收 US$15计费。"],
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
    { name: T("Kunming", "昆明"), detail: T("Stone Forest, Dianchi Lake, Western Hills, Green Lake and city sights.", "石林、滇池、西山、翠湖及昆明周边景点。"), img: "/assets/blog/kunming-travel-guide/kunming-city.webp" },
    { name: T("Dali", "大理"), detail: T("Erhai Lake, Xizhou, Shuanglang, Dali Old Town and Cangshan.", "洱海环线、喜洲、双廊、大理古城和苍山周边。"), img: "/assets/destinations/yunnan/dali-erhai-cover.webp" },
    { name: T("Shaxi", "沙溪"), detail: T("Shaxi Ancient Town, Sideng Street and the old Tea Horse Road.", "沙溪古镇、寺登街与茶马古道沿线。"), img: "/assets/destinations/yunnan/shaxi.webp" },
    { name: T("Lijiang", "丽江"), detail: T("Jade Dragon Snow Mountain, Blue Moon Valley, Shuhe and Baisha.", "玉龙雪山、蓝月谷、束河、白沙及周边。"), img: "/assets/destinations/yunnan/shuhe.webp" },
    { name: T("Tiger Leaping Gorge", "虎跳峡"), detail: T("Dramatic Jinsha River canyon and scenic roadside stops, subject to access.", "金沙江峡谷风光及沿线观景停靠，具体以开放和道路情况为准。"), img: "/assets/destinations/yunnan/tiger-leaping.webp" },
    { name: T("Shangri-La", "香格里拉"), detail: T("Pudacuo, Napa Lake, Songzanlin Monastery and Dukezong.", "普达措、纳帕海、松赞林寺、独克宗古城及周边。"), img: "/assets/destinations/yunnan/shangri-la.webp" },
    { name: T("Other Yunnan Destinations", "其他云南目的地"), detail: T("Travel elsewhere across Yunnan? Tell us your route and we'll arrange a suitable driver, subject to access and availability.", "云南省内其他未列出的城市、县镇和景点也可安排；告诉我们路线，确认道路、车源后为你服务。"), img: "/assets/destinations/yunnan/lijiang-shangri-la/yangtze-first-bend-shigu.webp" },
  ];
  const included = [
    T("Private vehicle and local driver", "私人用车和当地司机"),
    T("Vehicle, driver, fuel, expressway tolls and parking for standard intercity and city hire (airport/station transfers excluded)", "标准跨城及市区包车一价全包：车辆、司机、燃油、高速费及停车费（机场／车站接送除外）"),
    T("Agreed hotel or station pickup and drop-off", "双方约定的酒店或车站接送"),
    T("English-language coordination through Hidden China Travel", "Hidden China Travel 英文沟通协调"),
    T("Day trip times agreed before booking", "一日游用车时段提前确认"),
    T("Up to 30 minutes of agreed complimentary overtime for day hire", "一日包车经约定可免费延时30分钟")
  ];
  const excluded = [
    T("Other costs not explicitly listed as included in your confirmed quotation", "确认报价中未明确列出的其他费用"),
    T("Attraction tickets, meals and personal expenses", "门票、餐饮及个人消费"),
    T("Professional English-speaking tour guide", "专业英文导游"),
    T("Unplanned sightseeing or major route changes", "临时观光停靠或重大路线变更"),
    T("Overtime beyond the complimentary 30 minutes", "超过免费延时30分钟的费用")
  ];
  const questions = faqs.map(([en,cn],i)=>({question:T(en,cn),answer:T(faqAnswers[i][0],faqAnswers[i][1])}));

  return <main className="driver-page">
    <SiteHeader cta={{href:"#standard-transfers",label:T("View Driver Services","查看包车服务"),location:"driver_header"}} searchPlaceholder="Yunnan private driver" />
    <JourneyHero
      title={T("Yunnan Private Driver & Car Hire — Transfers, Day Trips & Road Trips", "云南私人包车与司机服务｜接送、一日游及多日包车")}
      eyebrow={T("PRIVATE CAR & DRIVER SERVICE", "云南私人交通服务")}
      image="/home/hero.webp"
      imageAlt={T("Jade Dragon Snow Mountain in Yunnan", "云南玉龙雪山")}
      description={T("Hire a car with driver for private transfers, day trips and multi-day journeys around Kunming, Dali, Lijiang and Shangri-La. Review USD vehicle prices and route options, with English-language coordination from Joy.", "从昆明、大理、丽江到香格里拉，安排5座或7座私人包车、跨城接送、一日游及多日路线。查看美元报价，Joy 协助英文沟通与接送安排。")}
      primary={{ href: "#standard-transfers", label: T("Explore Routes & Prices", "查看路线与参考价") }}
      secondary={{ href: "#multi-day-driver", label: T("Plan a Multi-Day Road Trip", "规划多日包车路线") }}
      note={T("Standard services can be paid online; vehicle allocation is confirmed after payment. Complex routes are quoted first.", "标准服务可在线付款，付款后确认派车；复杂路线先提供报价。")}
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
          <p>{T("For standard multi-day drivers, select a vehicle and number of days for an instant USD total and pay a 20% deposit online. For special routes or larger vehicles, send a free enquiry for a written quotation.", "标准多日包车可选车型和天数，按美元总价在线支付20%定金。特殊路线或更大车型可免费提交询价，我们会核实车源后提供书面报价。")}</p>
          <p>{T("Multi-day driver guide rate: US$180/day for 1–6 days, or US$150/day for trips longer than 6 days (all days at the longer-trip rate). Vehicle, driver, fuel, tolls and parking are included, with no hidden charges for the agreed route and hours. Select your vehicle, days and route to pay a 20% deposit online. We confirm availability and details after payment; if unavailable, the deposit is refunded.", "多日包车参考价：1–6天 US$180/天，超过6天按 US$150/天计算全程天数。约定路线和用车时长内，车辆、司机、燃油、高速费、停车费全部包含，无隐藏费用。选择车型、天数及路线后可在线支付20%定金，我们随后确认车源和具体安排；如无法提供服务则退还定金。")}</p>
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
        {heading("04 / SERVICE DETAILS","What the Service Includes","服务包含与不包含", "All-inclusive driver rates: car, driver, fuel, tolls and parking; no hidden charges on agreed routes. Airport/station transfers use separate terms.", "跨城与市区包车一价全包：车、司机、油费、高速费、停车费，约定路线无隐藏费用；机场及车站接送单独核价。")}
        <div className="driver-inclusions-grid">
          <div className="driver-list-card"><h3>{T("Included","通常包含")}</h3><ul>{included.map(x=><li key={x}>{x}</li>)}</ul></div>
          <div className="driver-list-card"><h3>{T("Not Included","通常不包含")}</h3><ul>{excluded.map(x=><li key={x}>{x}</li>)}</ul></div>
        </div>
        <p className="driver-detail-note">{T("For agreed full-day hire only: overtime beyond the first 30 complimentary minutes is US$15 per started hour, subject to driver availability and route approval. Your written quote takes precedence.", "仅适用于已确认的一日包车：经约定的免费延时30分钟之后，每开始1小时加收 US$15，需事先取得司机和运营方同意；具体以书面报价为准。")}</p>
      </div>
    </section>

    <section className="driver-section" id="vehicles">
      <div className="shell">
        {heading("05 / VEHICLE & LUGGAGE","How to Choose a Vehicle","如何选择车辆", "Five-seat and seven-seat USD prices are shown for standard routes. Seven-seat adds about US$23 on direct transfers and US$30 on scenic routes or per day on day/multi-day hire. Request a quote for larger vehicles.", "5座与7座标准路线均显示美元价格，7座直达路线增加约 US$23，途经景点路线增加约 US$30，一日／多日包车每天加约 US$30；更大车型请询价。")}
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
        {heading("07 / SERVICE AREAS","Private Driver Services Across Yunnan","云南私人包车覆盖地区", "From classic routes to lesser-known Yunnan destinations, private driving is available across the province.", "从热门城市到未列出的云南省内目的地，均可提供私人包车服务，具体路线按道路和车源确认。")}
        <div className="driver-area-grid">{coverage.map(item=><article className="driver-area-card" key={item.name}><div><Image src={item.img} alt={item.name} fill sizes="(max-width:600px) 100vw, 25vw" /></div><h3>{item.name}</h3><p>{item.detail}</p></article>)}</div>
        <p className="driver-detail-note">{T("Planning a stop at Tiger Leaping Gorge? Our Lijiang-to-Gorge guide explains bus options, private day trips and the one-way route to Shangri-La.", "计划从丽江前往虎跳峡？交通攻略对比大巴、当日往返包车，以及经虎跳峡去香格里拉的单程路线。")} <Link href="/lijiang-to-tiger-leaping-gorge">{T("Read the Lijiang to Tiger Leaping Gorge guide", "查看丽江到虎跳峡交通攻略")}</Link>.</p>
      </div>
    </section>

    <section className="driver-section driver-section-soft driver-seo-guides" id="private-driver-route-guides">
      <div className="shell">
        {heading("ROUTE PLANNING & TRANSPORT OPTIONS","Plan Your Yunnan Private Transfers","云南私人包车与交通路线攻略",
          "Compare train and road travel before choosing a driver. A private car is especially useful for hotel-to-hotel transfers, families with luggage and scenic stops agreed in advance.",
          "先比较高铁与公路交通，再决定是否包车。酒店到酒店、家庭大件行李和计划沿途游览时，私人包车通常更方便。")}
        <div className="driver-seo-guide-grid">
          <article className="driver-list-card">
            <div className="driver-seo-guide-media"><Image src="/assets/blog/yunnan-private-driver/dali-lijiang.webp" alt="Dali–Lijiang private transfer route in Yunnan" fill sizes="(max-width: 680px) 100vw, (max-width: 1200px) 48vw, 530px" loading="lazy" /></div>
            
            <h3>{T("Dali to Lijiang: Train or Private Car?","大理到丽江：高铁还是私人包车？")}</h3>
            <p>{T("Trains work well for light luggage and station-to-station travel. Choose a private transfer for hotel pickup, a family group or a flexible arrival time.", "行李较少、车站之间出行时，高铁通常更经济；家庭出行、酒店直接接送或时间灵活时，可考虑包车。")}</p>
            <Link href="/dali-to-lijiang">{T("Compare Dali–Lijiang travel options","查看大理到丽江交通对比")} →</Link>
          </article>
          <article className="driver-list-card">
            <div className="driver-seo-guide-media"><Image src="/assets/blog/yunnan-private-driver/dali-shaxi.webp" alt="Shaxi Ancient Town traditional square in Yunnan" fill sizes="(max-width: 680px) 100vw, (max-width: 1200px) 48vw, 530px" loading="lazy" /></div>
            
            <h3>{T("Dali to Shaxi: Road Access & Luggage","大理到沙溪：公路交通与行李安排")}</h3>
            <p>{T("Shaxi has no railway station. Compare buses and private road transfers, or arrange a Shaxi stop on your journey north to Lijiang.", "沙溪没有火车站，最后一段必须走公路。可比较班车与私人接送，或安排从大理到丽江途经沙溪。")}</p>
            <Link href="/dali-to-shaxi">{T("Explore Dali–Shaxi transport","查看大理到沙溪交通攻略")} →</Link>
          </article>
          <article className="driver-list-card">
            <div className="driver-seo-guide-media"><Image src="/assets/blog/yunnan-private-driver/lijiang-shangri-la.webp" alt="Shangri-La landscape in Yunnan" fill sizes="(max-width: 680px) 100vw, (max-width: 1200px) 48vw, 530px" loading="lazy" /></div>
            
            <h3>{T("Lijiang to Shangri-La: Direct or Scenic","丽江到香格里拉：直达还是沿途游览？")}</h3>
            <p>{T("A direct train can be efficient, while a private driver offers hotel-to-hotel travel and the option to plan an agreed scenic stop.", "高铁适合快速直达，包车则可酒店接送，并提前商定沿途观景停靠。")}</p>
            <Link href="/lijiang-to-shangri-la">{T("Compare Shangri-La travel options","查看丽江到香格里拉交通对比")} →</Link>
          </article>
          <article className="driver-list-card">
            <div className="driver-seo-guide-media"><Image src="/assets/blog/yunnan-private-driver/lijiang-tiger-leaping-gorge.webp" alt="Tiger Leaping Gorge canyon in Yunnan" fill sizes="(max-width: 680px) 100vw, (max-width: 1200px) 48vw, 530px" loading="lazy" /></div>
            
            <h3>{T("Tiger Leaping Gorge: Day Trip or Onward Transfer","虎跳峡：丽江往返还是继续去香格里拉？")}</h3>
            <p>{T("Upper Gorge sightseeing and onward travel need different timing. Check road access and confirmed sightseeing areas before planning a stop.", "上虎跳峡观景与继续前往香格里拉的时间安排不同，应提前核实路况、开放区域与停留计划。")}</p>
            <Link href="/lijiang-to-tiger-leaping-gorge">{T("Read the Tiger Leaping Gorge transport guide","查看丽江到虎跳峡交通攻略")} →</Link>
          </article>
        </div>
        <p className="driver-detail-note">{T("Need a private car for any of these routes? Select a standard service above, or send your hotels, travel date, group size and preferred stops for a tailored quote. Prices include the agreed transport scope; tickets, meals and unplanned detours are extra.", "希望安排这些路线的包车？可在上方选择标准产品，也可以提供酒店、出行日期、人数和途中停留需求获取报价。费用以约定用车范围为准，门票、餐饮与临时改线不包含在内。")} <a href="#standard-transfers">{T("See routes and prices","查看路线与价格")} →</a></p>
      </div>
    </section>

    <section className="driver-section driver-section-soft journey-support-flow driver-process" id="booking-process">
      <div className="shell journey-section-layout">
        <header className="driver-flow-heading"><p className="kicker">08 / HOW BOOKING WORKS</p><h2>{T("From Route to Confirmed Pickup","从选线路到司机接送")}</h2><p>{T("Choose your service, pay securely, then connect with Joy to confirm your driver and pickup details.","选好服务、安全付款后，与 Joy 联系确认司机和接送安排。")}</p></header>
        <div className="journey-support-grid">{[
          [T("Choose a service","选服务"),T("Pick a standard transfer or describe your custom route.","选择标准接送，或发送定制路线。")],
          [T("Share your date","提交日期"),T("Tell us pickup, drop-off, passengers and luggage.","提供接送点、人数和行李情况。")],
          [T("Review USD price","核对美元价格"),T("Review the displayed standard-route total, or request a written quote for custom routes.","核对标准产品显示的美元价格；定制路线先获得书面报价。")],
          [T("Pay securely online","安全在线付款"),T("Pay the full amount or 20% multi-day deposit securely via Stripe.","通过 Stripe 安全支付全款，或多日包车20%定金。")],
          [T("Connect & confirm pickup","联系确认接送"),T("After payment, Joy will contact you. You can also message us on WhatsApp or WeChat with your order number. We’ll confirm your driver and pickup details.","付款后 Joy 会联系你；你也可以主动加 WhatsApp 或微信并提供订单号，我们将确认司机与接送安排。")]
        ].map(([h,p],i)=><article key={h}><span>{String(i+1).padStart(2,"0")}</span><h3>{h}</h3><p>{p}</p></article>)}</div>
        <p className="driver-detail-note driver-flow-note">{T("Custom enquiries are free. For priced standard routes, Stripe collects the listed full amount or the 20% multi-day deposit before vehicle allocation; if we cannot provide the service, your payment is refunded.","定制路线询价免费。标准路线选择后，Stripe 收取显示的全款或多日包车20%定金，随后确认车源；如无法提供服务将退款。")}</p>
      </div>
    </section>

    <section className="driver-section" id="payment-policy">
      <div className="shell">
        {heading("09 / TERMS & PAYMENT","Payment and Cancellation Policy","付款与取消政策", "Driver-only service terms are separate from multi-day tour packages and are confirmed before payment.", "本页单独包车服务条款与多日旅游套餐不同，具体在付款前书面确认。")}
        <div className="driver-terms-grid">
          <article><h3>{T("Payment","付款")}</h3><p>{T("Priced intercity transfers and day trips are paid in full at checkout. Multi-day private-driver products take a 20% deposit at checkout; the remaining balance and due date are agreed in writing. Vehicle allocation follows payment.", "已定价跨城接送和周边一日游在线支付全款。多日包车在线支付20%定金，余款金额及截止时间以书面确认内容为准；付款后再安排确认车源。")}</p></article>
          <article><h3>{T("Cancellation","取消")}</h3><p>{T("Your written quote states the cancellation and refund terms for the agreed payment type before you pay.", "付款前，书面报价会列明对应付款方式的取消、改期和退款条件。")}</p></article>
          <article><h3>{T("Operator cannot provide the car","经营方无法派车")}</h3><p>{T("If the licensed operator cannot confirm or provide the booked vehicle, all payments collected for the unavailable service are refunded in full.", "如果持证经营方无法确认或提供已预订车辆，应全额退回该服务所收款项。")}</p></article>
        </div>
        <p className="driver-detail-note">{T("Example only: for a US$540 multi-day service with a US$108 deposit, a late cancellation fee of 30% of the deposit is US$32.40, leaving a US$75.60 deposit refund.", "举例说明：若多日包车总价 US$540、20%定金 US$108，假如约定的临近取消费用为定金30%，则扣 US$32.40、退 US$75.60。")}</p>
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
