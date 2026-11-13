import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { JourneyHero, JourneyFactCards } from "@/components/journey-landing";
import { RealJourneyEvidence } from "@/components/real-journey-evidence";
import { JourneyCard } from "@/components/journey-card";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { PreviewEnquiryForm } from "@/components/preview-enquiry-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

import { localizedStaticMetadata, localeUrl, type AppLocale } from "@/lib/i18n-seo";
import "./private-yunnan-tours.css";

type Props = { params: Promise<{ lang: AppLocale }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isZh = lang === "zh";
  const title = isZh ? "云南私人定制游｜6天 US$680 起 · 不拼团无购物" : "Private Yunnan Tours | Custom Trips from US$680";
  const description = isZh
    ? "云南私人定制游，每人 US$680 起。昆明、大理、沙溪、丽江、香格里拉，中文或英文司机兼向导，私人用车、灵活行程、无强制购物。"
    : "Private Yunnan tours from US$680 per person. Explore Dali, Shaxi, Lijiang and Shangri-La with a private driver-guide, flexible itinerary and no shopping stops.";
  return localizedStaticMetadata(lang, "/private-yunnan-tours", {
    title, description,
    openGraph: { title, description, images: [{ url:"https://hiddenchinatravel.com/home/hero.webp",alt:isZh?"云南玉龙雪山":"Jade Dragon Snow Mountain, Yunnan" }],type:"website" },
    twitter: {card:"summary_large_image", title, description,images:["https://hiddenchinatravel.com/home/hero.webp"]},
  });
}

const chineseCopy: Record<string,string> = {
  "6-Day First Encounter": "6天·初见云南",
  "8-Day Mountains & Ancient Towns": "8天·古城与雪山",
  "6 DAYS · KUNMING → DALI · SHAXI · LIJIANG": "6天 · 昆明 → 大理 → 沙溪 → 丽江",
  "8 DAYS · KUNMING · DALI · LIJIANG · TIGER LEAPING GORGE · SHANGRI-LA": "8天 · 昆明 · 大理 · 丽江 · 虎跳峡 · 香格里拉",
  "A stone-paved street in Shaxi": "沙溪古镇石板街",
  "Mountain gorge in Yunnan": "云南虎跳峡峡谷",
  "Meet Bai artisans beside Erhai Lake, spend a quiet night in Shaxi’s old Tea Horse Road town, then give Jade Dragon Snow Mountain a full day — without rushing between stops.": "在洱海边认识白族传统手艺，在茶马古道上的沙溪安静住一晚，再留出完整一天探访玉龙雪山，不赶路、不走马观花。",
  "Go from lakeside Dali and Lijiang’s old lanes to the dramatic road through Tiger Leaping Gorge. Continue into Shangri-La for Tibetan culture and a slower highland day.": "从洱海畔的大理与丽江古城出发，经过壮阔的虎跳峡，继续前往香格里拉，深入了解藏地文化，放慢高原旅行的脚步。",
  "First-time visitors with limited time": "首次来云南、时间有限的旅客",
  "Travelers wanting Yunnan’s classic highlights": "想一次体验云南经典风景的旅客",
  "From US$680 per person": "每人 US$680 起",
  "From US$799 per person": "每人 US$799 起",
  "How many days do I need for Yunnan?": "云南旅行安排几天比较合适？",
  "Six days works well for Dali, Shaxi and Lijiang. Seven to eight days can include Tiger Leaping Gorge and Shangri-La; ten to twelve days gives you more time to explore at a comfortable pace.": "6天适合游览大理、沙溪和丽江；7至8天可以加入虎跳峡和香格里拉；10至12天则有更多时间慢慢体验当地文化与自然风光。",
  "How much does a private Yunnan tour cost?": "云南私人定制游大约多少钱？",
  "Our sample 6-day journey starts at US$680 per person and the 8-day journey starts at US$799 per person. These are starting prices, not fixed quotes. Final costs depend on season, hotel choice, group size and the confirmed inclusions.": "参考行程6天每人 US$680 起，8天每人 US$799 起。这是参考起价，并非固定成交价；具体费用取决于出行季节、酒店、人数和最终确认的服务内容。",
  "Can I customize the 6-day or 8-day route?": "6天或8天的路线可以修改吗？",
  "Yes. Add or remove destinations, adjust the pace, select hotels and choose experiences. We will explain what fits comfortably within your available days.": "可以。你可以增减目的地、调整节奏、选择酒店和体验项目，我们会根据实际旅行时间帮你规划合理的路线。",
  "Is the journey completely private?": "全程都是私人团吗？",
  "Yes. Travel with your own partner, family or friends, without shared groups or mandatory shopping stops. Choose Chinese- or English-speaking service at no extra guide-language charge, with one dedicated driver-guide for the full journey. Your assigned guide and vehicle are confirmed before departure.": "是的。只与你的伴侣、家人或朋友同行，不拼团、不进强制购物店。中文或英文司机兼向导可选，语言选择不额外收费，全程安排一位专属司机兼向导；具体人员和车辆在出发前确认。",
  "What is normally included in the quotation?": "报价通常包含哪些服务？",
  "The sample 6-day tour includes private transport, one driver-guide throughout, premium hotels with breakfast, second-class high-speed rail and listed attraction tickets. Lunches and dinners, international flights, travel insurance and personal expenses are not included. Your written quote specifies all services for your chosen route.": "6天参考行程包含私人用车、全程司机兼向导、含早的优选酒店、高铁二等座和行程内所列景点门票；不含午晚餐、国际机票、旅行保险和个人消费。你的正式书面报价会列明实际包含的服务。",
  "What happens if the weather or train times change?": "天气变化或火车时刻调整怎么办？",
  "Joy and the local team coordinate changes to the agreed itinerary, including revised pickups or alternate visits where practical. Weather-sensitive sites and train tickets depend on availability. Proposed changes, charges and any refunds are discussed before confirmation.": "Joy 与当地团队会协调已确认行程的必要调整，例如接送时间变更或可行的替代景点。受天气影响的景点与车票均以实际供应情况为准，相关费用调整或退款会事先沟通确认。",
  "Do I need confirmed dates before enquiring?": "咨询前一定要确定出行日期吗？",
  "No. Your group size and approximate trip length are enough to get started.": "不用。先告诉我们大致出行天数和人数，就可以开始讨论路线。",
  "How does booking and payment work?": "如何预订和付款？",
  "Review the written itinerary and quotation first, then sign the licensed agency's travel contract. The usual arrangement is a 20% deposit and the remaining balance after your first pickup, subject to your agreed written terms.": "先查看书面行程和报价，再与持证旅行社签订旅游合同。通常支付20%定金，剩余款项在首次接站后支付，具体以双方签署的合同为准。",
  "Get a Suggested Route & Price": "获取定制路线与报价",
  "Private Yunnan Tours, Designed Around You": "云南私人定制游，按你的想法出发",
  "TAILOR-MADE YUNNAN": "云南私人定制旅行",
  "Yunnan's Jade Dragon Snow Mountain": "云南玉龙雪山",
  "Explore Dali, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La on a private journey shaped around your dates, interests and pace.": "从大理、沙溪、丽江一路探索虎跳峡与香格里拉，按你的日期、兴趣和节奏安排专属云南之旅。",
  "Explore Route Ideas": "查看参考路线",
  "6-Day Private Yunnan Tour · From US$680 per person": "6天云南私人游 · 每人 US$680 起",
  "Based on two adults sharing one room. Final prices depend on travel dates, group size, hotels and confirmed services.": "参考起价按两位成人同住一间客房计算；最终报价以出行日期、人数、酒店与确定的服务为准。",
  "At a glance": "旅行亮点",
  "Flexible Duration": "天数自由安排",
  "6–12 Days": "6–12天",
  "A route shaped around your available time, interests and preferred pace.": "根据你的假期长度、兴趣和旅行节奏调整路线。",
  "100% Tailor-Made & No Shopping": "100%私人定制 · 无购物",
  "Just Your Group": "只与你的同行伙伴出发",
  "Private travel shaped to your group, with no shared departures or compulsory shopping stops.": "不拼团、不安排强制购物店，行程按你的需求定制。",
  "One Guide, Your Language": "全程专属司机兼向导",
  "Chinese or English Included": "中文或英文均已包含",
  "Choose your guide language at no extra charge; one dedicated driver-guide throughout.": "中文或英文可选，不加收语言服务费，全程安排一位司机兼向导。",
  "Transparent Booking": "预订条款透明",
  "20% Deposit": "通常20%定金",
  "Booking and refunds follow the agreed cancellation policy in your contract.": "付款、取消和退款依双方签署的旅游合同约定执行。",
  "Get My Route & Price": "获取我的专属路线与报价",
  "YOUR KIND OF TRIP": "适合怎样的旅行者",
  "Who it's for": "适合谁",
  "For couples, families, friends and small private groups who want local guidance without joining a scheduled tour.": "适合情侣、家庭、朋友或小型私人团，希望有当地人协助安排，但不想参加固定拼团的旅客。",
  "You do not need to know the exact route. A rough trip length and group size are enough.": "不必提前想好完整路线，只需知道大概旅行几天、几个人即可。",
  "SEASONAL ADVICE": "云南旅行季节",
  "When to go": "什么时候来",
  "March to May and September to November are generally the most comfortable periods for classic Dali, Lijiang and Shangri-La routes.": "通常3至5月、9至11月更适合游览大理、丽江和香格里拉，整体气候较舒适。",
  "Summer is greener but wetter. Winter is quieter, with colder conditions at higher elevations.": "夏季植被葱郁但降雨较多；冬季游客相对较少，高海拔地区则更冷。",
  "A STARTING POINT, NOT A FIXED PACKAGE": "参考路线 · 非固定团",
  "Start with a Ready-Planned Yunnan Route": "先从一条合适的云南路线开始",
  "Explore two carefully planned journeys, then customize the route, pace and hotels around your trip.": "先看看两条精心规划的参考行程，再按你的时间、旅行节奏和酒店偏好调整。",
  "View the 6-Day Journey": "查看6天路线",
  "View the 8-Day Journey": "查看8天路线",
  "Customize This Route": "定制这条路线",
  "Starting prices are per person, based on two adults sharing a room. Final prices vary by travel dates, group size, hotel selection and confirmed services.": "参考起价均为每人费用，按两位成人同住一间房计算；实际报价随日期、人数、酒店和服务内容变化。",
  "NEED MORE TIME IN YUNNAN?": "想在云南多待几天？",
  "Planning a 10–12 Day Journey?": "准备安排10–12天云南行程？",
  "Explore Kunming, Dali, Shaxi, Lijiang and Shangri-La at a more comfortable pace, with extra time for local culture, photography, food or hiking.": "以更从容的节奏串联昆明、大理、沙溪、丽江和香格里拉，也为当地文化、摄影、美食或徒步留出更多时间。",
  "Share your trip length, group size and interests. Joy will suggest a suitable route and initial price range.": "告诉我们行程天数、人数和兴趣，Joy 会协助提出合适的路线与初步报价区间。",
  "Design My Longer Yunnan Journey →": "定制我的云南长线行程 →",
  "THE 6-DAY REFERENCE JOURNEY": "6天参考行程",
  "What’s Included — and What’s Not": "费用包含与不包含",
  "The same inclusions and exclusions listed on our 6-day journey page. For the 8-day route or custom plans, your written proposal confirms the exact services.": "以下内容与6天产品页的费用说明一致。8天或其他定制行程以最终书面报价列明的服务为准。",
  "INCLUDED IN THE 6-DAY TOUR": "6天行程费用包含",
  "NOT INCLUDED": "费用不包含",
  "A private vehicle throughout the journey, including fuel, tolls, parking, and your driver’s meals and accommodation": "全程私人用车，包含燃油、过路费、停车费及司机的餐饮住宿费用",
  "One Chinese- or English-speaking driver-guide for the whole journey, included at the same price": "全程一位中文或英文司机兼向导，语言选择不额外收费",
  "Premium hotels throughout, with breakfast included": "全程优选酒店住宿，包含早餐",
  "High-speed rail tickets during the journey, in second class": "行程内高铁二等座车票",
  "Entrance tickets for the sights listed in the itinerary": "行程所列景点门票",
  "Lunch and dinner": "午餐和晚餐",
  "International flights": "国际机票",
  "Travel insurance": "旅游保险",
  "Personal expenses": "个人消费",
  "Chinese- or English-speaking driver-guide service is included at the same price, with one dedicated guide for your journey. All tour details are confirmed in the written proposal.": "中文或英文司机兼向导均包含在报价中，全程一位专属人员；具体服务以书面行程与报价为准。",
  "TAILORED TO YOU": "按你的喜好定制",
  "Make the Journey Yours": "把云南旅程变成你的专属计划",
  "Route & Pace": "路线与节奏",
  "Add or remove destinations": "自由增减目的地",
  "Spend longer in fewer places, such as an extra night in Dali or Lijiang": "减少赶路，在大理或丽江多住一晚",
  "Choose gentler starts or fuller days": "选择慢节奏或安排更丰富的一天",
  "Adjust hiking and altitude exposure": "根据体力调整徒步及高海拔安排",
  "Hotels & Experiences": "酒店与体验",
  "Comfortable, premium or characterful hotels, confirmed by name": "舒适型、优选型或特色酒店，预订前确认具体酒店",
  "Bai tie-dye workshops in Zhoucheng and a night in Shaxi": "体验周城白族扎染，在沙溪住一晚",
  "Local food, photography and countryside walks": "当地美食、摄影与乡间漫步",
  "Family-friendly arrangements": "适合家庭的行程安排",
  "Dietary and mobility requirements": "饮食偏好与行动便利需求",
  "Local Planning. Licensed Delivery.": "云南本地策划 · 持证旅行社履约",
  "Yunnan-rooted route planning": "来自云南的本地路线规划",
  "Route advice informed by local knowledge of seasons, travel times and the real pace between stops": "综合季节、车程和实际游览节奏提供本地路线建议",
  "Planning backed by local operations": "本地团队协调执行",
  "Joy helps with the initial route; our licensed Yunnan operator’s team coordinates booking and delivery": "Joy 协助前期路线沟通，云南美珍国际旅行社的持证团队负责预订与履约安排",
  "Licensed tour operator": "持证旅行社",
  "Travel contract and payment with Kunming Dianguoguo International Travel Agency Co., Ltd.": "由昆明滇果果国际旅行社有限公司签约及收款",
  "Permit L-YN-101848": "旅行社许可证 L-YN-101848",
  "Confirmed before departure": "出发前逐项确认",
  "Named hotels, guide-language choice and vehicle class agreed in writing": "书面确认酒店名称、向导语言及车辆类型",
  "Local operations team coordinates pickups and logistics": "当地团队协调接送与旅行安排",
  "Check our licensed operator": "查看旅行社资质",
  "THREE SIMPLE STEPS": "三个简单步骤",
  "How planning works": "定制流程",
  "Share the basics": "告诉我们你的需求",
  "Tell us your trip length, group size and places or experiences that interest you. Dates can follow later.": "留下大致天数、人数，以及想去的地方或想体验的活动；具体日期可以稍后补充。",
  "Receive a route and price": "收到路线与初步报价",
  "Joy suggests a realistic route and an initial price range based on your trip length, group size and interests.": "Joy 会结合天数、人数及兴趣，提供合理的参考路线和初步价格范围。",
  "Adjust before booking": "预订前调整",
  "Review changes to hotels, pace and experiences before booking; any change to included services or price is confirmed in writing.": "在预订前调整酒店、节奏与体验项目，服务内容和报价变化均会书面确认。",
  "There is no payment or booking commitment when requesting an initial proposal.": "索取初步方案不需要付款，也没有预订义务。",
  "Joy, founder of Hidden China Travel": "Hidden China Travel 创始人 Joy",
  "LOCAL PLANNING, LICENSED DELIVERY": "云南本地策划 · 持证团队服务",
  "Get a Suggested Yunnan Route & Price": "获取云南定制路线与报价",
  "You do not need a finished itinerary. Share your approximate number of days and group size, and we will suggest a realistic starting route and price range based on your interests, with bookings and on-the-ground arrangements coordinated by our licensed local team.": "不必提前准备完整行程。只需告诉我们大致天数、人数和兴趣，我们会协助拟定合理路线与参考价格，并由持证旅行社的云南当地团队负责后续预订与接待。",
  "Yunnan-based operations team": "云南本地接待团队",
  "Chinese- or English-speaking service · Licensed local delivery": "中文或英文服务 · 持证旅行社履约",
  "Prefer WhatsApp?": "想用 WhatsApp 沟通？",
  "Chat with Joy →": "与 Joy 聊聊 →",
  "CLEAR TERMS, NO SURPRISES": "条款清楚 · 预订安心",
  "Clear Booking and Payment": "预订与付款说明",
  "Review your proposal": "确认书面方案",
  "Check the written route, named hotels, inclusions, exclusions and total price before you commit.": "签约前查看路线、酒店名称、费用包含与不包含项目及总价。",
  "Sign and confirm": "签订合同并确认",
  "Sign the licensed travel agency’s contract. A 20% deposit is our usual arrangement, subject to the agreed written terms.": "与持证旅行社签订旅游合同，通常支付20%定金，具体按书面约定执行。",
  "Complete the balance": "支付尾款",
  "The remaining balance is normally paid after your first pickup, as specified in your travel contract.": "剩余款项通常在首次接站后支付，以旅行合同约定为准。",
  "Your signed contract controls the payment schedule, cancellation terms and refunds.": "付款安排、取消及退款均以双方签署的旅游合同为准。",
  "Frequently Asked Questions": "常见问题",
  "Your Yunnan journey starts with a conversation.": "一段云南旅程，从一次沟通开始。",
  "Tell us about your party and interests. Get a suggested route and initial price range, with no commitment to book.": "告诉我们同行人数和旅行兴趣，即可获取参考路线与初步报价，无需立即预订。",
  "Best for ": "适合："
};

export default async function PrivateYunnanTours({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const L = (text: string) => lang === "zh" ? (chineseCopy[text] ?? text) : text;
  const routes = [
  { num: "01", title: L("6-Day First Encounter"), places: L("6 DAYS · KUNMING → DALI · SHAXI · LIJIANG"), image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp", alt: L("A stone-paved street in Shaxi"), description: L("Meet Bai artisans beside Erhai Lake, spend a quiet night in Shaxi’s old Tea Horse Road town, then give Jade Dragon Snow Mountain a full day — without rushing between stops."), best: L("First-time visitors with limited time"), price: L("From US$680 per person"), href: "/journeys/kunming-dali-shaxi-lijiang-6-days" },
  { num: "02", title: L("8-Day Mountains & Ancient Towns"), places: L("8 DAYS · KUNMING · DALI · LIJIANG · TIGER LEAPING GORGE · SHANGRI-LA"), image: "/assets/destinations/yunnan/tiger-leaping.webp", alt: L("Mountain gorge in Yunnan"), description: L("Go from lakeside Dali and Lijiang’s old lanes to the dramatic road through Tiger Leaping Gorge. Continue into Shangri-La for Tibetan culture and a slower highland day."), best: L("Travelers wanting Yunnan’s classic highlights"), price: L("From US$799 per person"), href: "/journeys/kunming-dali-lijiang-shangri-la-private-tour" },
];

const faqs = [
  [L("How many days do I need for Yunnan?"), L("Six days works well for Dali, Shaxi and Lijiang. Seven to eight days can include Tiger Leaping Gorge and Shangri-La; ten to twelve days gives you more time to explore at a comfortable pace.")],
  [L("How much does a private Yunnan tour cost?"), L("Our sample 6-day journey starts at US$680 per person and the 8-day journey starts at US$799 per person. These are starting prices, not fixed quotes. Final costs depend on season, hotel choice, group size and the confirmed inclusions.")],
  [L("Can I customize the 6-day or 8-day route?"), L("Yes. Add or remove destinations, adjust the pace, select hotels and choose experiences. We will explain what fits comfortably within your available days.")],
  [L("Is the journey completely private?"), L("Yes. Travel with your own partner, family or friends, without shared groups or mandatory shopping stops. Choose Chinese- or English-speaking service at no extra guide-language charge, with one dedicated driver-guide for the full journey. Your assigned guide and vehicle are confirmed before departure.")],
  [L("What is normally included in the quotation?"), L("The sample 6-day tour includes private transport, one driver-guide throughout, premium hotels with breakfast, second-class high-speed rail and listed attraction tickets. Lunches and dinners, international flights, travel insurance and personal expenses are not included. Your written quote specifies all services for your chosen route.")],
  [L("What happens if the weather or train times change?"), L("Joy and the local team coordinate changes to the agreed itinerary, including revised pickups or alternate visits where practical. Weather-sensitive sites and train tickets depend on availability. Proposed changes, charges and any refunds are discussed before confirmation.")],
  [L("Do I need confirmed dates before enquiring?"), L("No. Your group size and approximate trip length are enough to get started.")],
  [L("How does booking and payment work?"), L("Review the written itinerary and quotation first, then sign the licensed agency's travel contract. The usual arrangement is a 20% deposit and the remaining balance after your first pickup, subject to your agreed written terms.")],
];

faqs.push(
  [lang === "zh" ? "可以安排家庭或行动便利方面的特殊需求吗？" : "Can you accommodate family or accessibility needs?",
    lang === "zh" ? "请告诉我们孩子的年龄、行动便利需求和其他优先事项。我们会先核实相关酒店、车辆和活动能否满足，再在方案中确认。" : "Tell us your children's ages, mobility needs and other priorities. We check suitable hotels, vehicles and activities before confirming arrangements in your proposal."],
  [lang === "zh" ? "可以安排清真友好的云南行程吗？" : "Can you arrange a halal-friendly Yunnan tour?",
    lang === "zh" ? "可以在咨询时提出清真饮食和礼拜需求，我们会根据路线核实可用安排，并在方案中写明。酒店早餐可选择合适餐品或不使用；不承诺每家酒店都有清真认证厨房。" : "Tell us about halal meals and prayer requirements when you enquire. We check available arrangements along your route and confirm them in the proposal. You can choose suitable hotel breakfast items or skip breakfast; we do not promise certified-halal kitchens at every hotel."]
);

const cta = L("Get a Suggested Route & Price");

  const whatsapp = buildWhatsAppUrl(undefined, lang);

  return <main className="tailor-preview">
    <SiteHeader cta={{ href: "#plan", label: cta }} />
    <JourneyHero title={L("Private Yunnan Tours, Designed Around You")} eyebrow={L("TAILOR-MADE YUNNAN")} image="/home/hero.webp" imageAlt={L("Yunnan's Jade Dragon Snow Mountain")} description={L("Explore Dali, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La on a private journey shaped around your dates, interests and pace.")} primary={{href:"#plan",label:cta}} secondary={{href:"#routes",label:L("Explore Route Ideas")}} price={L("6-Day Private Yunnan Tour · From US$680 per person")} note={L("Based on two adults sharing one room. Final prices depend on travel dates, group size, hotels and confirmed services.")}/>
    <JourneyFactCards id="glance" title={L("At a glance")} cards={[
      { icon:"calendar", title:L("Flexible Duration"), lines:[L("6–12 Days"),L("A route shaped around your available time, interests and preferred pace.")] },
      { icon:"route", title:L("100% Tailor-Made & No Shopping"), lines:[L("Just Your Group"),L("Private travel shaped to your group, with no shared departures or compulsory shopping stops.")] },
      { icon:"star", title:L("One Guide, Your Language"), lines:[L("Chinese or English Included"),L("Choose your guide language at no extra charge; one dedicated driver-guide throughout.")] },
      { icon:"note", title:L("Transparent Booking"), lines:[L("20% Deposit"),L("Booking and refunds follow the agreed cancellation policy in your contract.")] },
    ]} action={{href:"#plan",label:L("Get My Route & Price")}} />
    <section className="section preview-fit"><div className="shell preview-two">
      <article><p className="kicker">{L("YOUR KIND OF TRIP")}</p><h2>{L("Who it's for")}</h2><p>{L("For couples, families, friends and small private groups who want local guidance without joining a scheduled tour.")}</p><p>{L("You do not need to know the exact route. A rough trip length and group size are enough.")}</p></article>
      <article><p className="kicker">{L("SEASONAL ADVICE")}</p><h2>{L("When to go")}</h2><p>{L("March to May and September to November are generally the most comfortable periods for classic Dali, Lijiang and Shangri-La routes.")}</p><p>{L("Summer is greener but wetter. Winter is quieter, with colder conditions at higher elevations.")}</p></article>
    </div></section>
    <section className="section preview-routes" id="routes"><span id="ideas" /><span id="places" /><div className="shell"><div className="preview-heading">
      <p className="kicker">{L("A STARTING POINT, NOT A FIXED PACKAGE")}</p>
      <h2>{L("Start with a Ready-Planned Yunnan Route")}</h2>
      <p>{L("Explore two carefully planned journeys, then customize the route, pace and hotels around your trip.")}</p>
    </div>
    <div className="journeys-card-grid preview-reused-journeys">{routes.map(r =>
      <JourneyCard key={r.num} journey={{
        title: r.title, subtitle: r.description, href: r.href, image: r.image, imageAlt: r.alt,
        destination: r.places, fromPrice: r.price, features: [`${L("Best for ")}${r.best}`],
        ctaLabel: r.num === "01" ? L("View the 6-Day Journey") : L("View the 8-Day Journey"),
        secondaryHref: "#plan", secondaryLabel: L("Customize This Route"),
        trackingLocation: "preview_route_" + r.num,
      }} />
    )}</div>
    <p className="preview-price-note">{L("Starting prices are per person, based on two adults sharing a room. Final prices vary by travel dates, group size, hotel selection and confirmed services.")}</p>
    <p className="preview-centered"><Link href="/yunnan-tour-packages">{lang === "zh" ? "比较全部云南旅游套餐 →" : "Compare all Yunnan tour packages →"}</Link></p>
    </div>
    <div className="preview-longer-journey">
      <div className="shell preview-longer-inner">
        <div className="preview-longer-copy">
          <p className="kicker">{L("NEED MORE TIME IN YUNNAN?")}</p>
          <h3>{L("Planning a 10–12 Day Journey?")}</h3>
          <p>{L("Explore Kunming, Dali, Shaxi, Lijiang and Shangri-La at a more comfortable pace, with extra time for local culture, photography, food or hiking.")}</p>
          <p>{L("Share your trip length, group size and interests. Joy will suggest a suitable route and initial price range.")}</p>
        </div>
        <div className="preview-longer-action">
          <a className="button button-light" href="#plan" data-cta-location="preview_longer_journey">{L("Design My Longer Yunnan Journey →")}</a>
        </div>
      </div>
    </div>
    </section>
    <section className="section sample-itinerary-section" id="sample-itinerary" aria-labelledby="sample-itinerary-heading">
      <div className="shell">
        <div className="preview-heading">
          <p className="kicker">{lang === "zh" ? "示例行程 · 可自由定制" : "A SAMPLE JOURNEY · FULLY CUSTOMIZABLE"}</p>
          <h2 id="sample-itinerary-heading">{lang === "zh" ? "云南秘境探索 · 8天7晚" : "8-Day Yunnan Hidden Explorer"}</h2>
          <p>{lang === "zh" ? "昆明、大理、沙溪、丽江、虎跳峡、哈巴雪山与白水台。先看完整路线，再定制属于你的旅程。" : "Kunming, Dali, Shaxi, Lijiang, Tiger Leaping Gorge, Haba Snow Mountain and Baishuitai. Explore the route, then tailor it to you."}</p>
        </div>
        <div className="sample-itinerary-card">
          <div className="sample-itinerary-photo"><Image src="/assets/destinations/yunnan/tiger-leaping.webp" alt={lang === "zh" ? "虎跳峡峡谷与金沙江" : "Tiger Leaping Gorge and Jinsha River"} fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
          <div className="sample-itinerary-content">
            <span className="sample-itinerary-label">{lang === "zh" ? "8天7晚 · 私人定制" : "8 DAYS / 7 NIGHTS · PRIVATE JOURNEY"}</span>
            <h3>{lang === "zh" ? "从洱海到雪山峡谷" : "From lakeside villages to wild mountain gorges"}</h3>
            <p>{lang === "zh" ? "4星级酒店（可升级5星）、私人专车、英文导游、昆明接机、丽江送机、高铁二等座及行程所列景点门票。" : "4-star hotels (5-star upgrades available), private transport, an English-speaking guide, airport transfers, second-class high-speed rail and listed attraction tickets."}</p>
            <p className="sample-itinerary-note">{lang === "zh" ? "英文版PDF · 可按日期、酒店和兴趣调整 · 不含机票及个人消费" : "English PDF · Flexible dates, hotels and experiences · Flights and personal expenses excluded"}</p>
            <div className="sample-itinerary-actions">
              <a className="button button-primary" href="/assets/samples/Hidden_China_Travel_Yunnan_Hidden_Explorer_8D7N_EN.pdf" target="_blank" rel="noopener noreferrer" data-cta-location="private_yunnan_sample_pdf">{lang === "zh" ? "查看示例行程 PDF ↗" : "View Sample Itinerary (PDF) ↗"}</a>
              <a className="sample-itinerary-plan" href="#plan" data-cta-location="private_yunnan_sample_plan">{lang === "zh" ? "定制类似行程 →" : "Plan a Similar Trip →"}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <span id="stories" /><RealJourneyEvidence locale={lang} />
    <section className="section preview-inclusions" id="included-excluded"><span id="quote" /><div className="shell">
      <div className="preview-heading"><p className="kicker">{L("THE 6-DAY REFERENCE JOURNEY")}</p><h2>{L("What’s Included — and What’s Not")}</h2><p>{L("The same inclusions and exclusions listed on our 6-day journey page. For the 8-day route or custom plans, your written proposal confirms the exact services.")}</p></div>
      <div className="preview-inclusion-grid">
        <article><span className="journey-detail-label">{L("INCLUDED IN THE 6-DAY TOUR")}</span><ul>
          <li>{L("A private vehicle throughout the journey, including fuel, tolls, parking, and your driver’s meals and accommodation")}</li>
          <li>{L("One Chinese- or English-speaking driver-guide for the whole journey, included at the same price")}</li>
          <li>{L("Premium hotels throughout, with breakfast included")}</li>
          <li>{L("High-speed rail tickets during the journey, in second class")}</li>
          <li>{L("Entrance tickets for the sights listed in the itinerary")}</li>
        </ul></article>
        <article><span className="journey-detail-label">{L("NOT INCLUDED")}</span><ul>
          <li>{L("Lunch and dinner")}</li><li>{L("International flights")}</li><li>{L("Travel insurance")}</li><li>{L("Personal expenses")}</li>
        </ul></article>
      </div>
      <p className="preview-inclusions-note">{L("Chinese- or English-speaking driver-guide service is included at the same price, with one dedicated guide for your journey. All tour details are confirmed in the written proposal.")}</p>
    </div></section>
    <section className="section preview-custom" id="possibilities"><div className="shell"><div className="preview-heading"><p className="kicker">{L("TAILORED TO YOU")}</p><h2>{L("Make the Journey Yours")}</h2><p>{lang === "zh" ? "你可以修改现有参考路线，也可以从零设计一趟云南行程。6天和8天路线只是起点，不是固定出发的拼团，也不是我们仅能安排的行程。" : "You can adapt one of our sample routes or ask us to design a Yunnan itinerary from scratch. The 6- and 8-day journeys are starting points, rather than fixed departures or the only trips we arrange."}</p></div><div className="preview-two">
    <article><h3>{L("Route & Pace")}</h3><ul><li>{L("Add or remove destinations")}</li><li>{L("Spend longer in fewer places, such as an extra night in Dali or Lijiang")}</li><li>{L("Choose gentler starts or fuller days")}</li><li>{L("Adjust hiking and altitude exposure")}</li></ul></article>
    <article><h3>{L("Hotels & Experiences")}</h3><ul><li>{L("Comfortable, premium or characterful hotels, confirmed by name")}</li><li>{L("Bai tie-dye workshops in Zhoucheng and a night in Shaxi")}</li><li>{L("Local food, photography and countryside walks")}</li><li>{L("Family-friendly arrangements")}</li><li>{L("Dietary and mobility requirements")}</li></ul></article>
    </div></div></section>
    
    <span id="local-team" /><JourneyFactCards id="why-travel" title={L("Local Planning. Licensed Delivery.")} cards={[
      { icon:"person", title:L("Yunnan-rooted route planning"), lines:[L("Route advice informed by local knowledge of seasons, travel times and the real pace between stops")] },
      { icon:"party", title:L("Planning backed by local operations"), lines:[L("Joy helps with the initial route; our licensed Yunnan operator’s team coordinates booking and delivery")] },
      { icon:"licence", title:L("Licensed tour operator"), lines:[L("Travel contract and payment with Kunming Dianguoguo International Travel Agency Co., Ltd."),L("Permit L-YN-101848")] },
      { icon:"note", title:L("Confirmed before departure"), lines:[L("Named hotels, guide-language choice and vehicle class agreed in writing"),L("Local operations team coordinates pickups and logistics")] },
    ]} action={{href:"/licensed-operator",label:L("Check our licensed operator")}} />
    <section className="section preview-process journey-support-flow" id="process"><div className="shell journey-section-layout"><header className="preview-heading"><p className="kicker">{L("THREE SIMPLE STEPS")}</p><h2>{L("How planning works")}</h2></header><div className="journey-support-grid">
      <article><span>01</span><h3>{L("Share the basics")}</h3><p>{L("Tell us your trip length, group size and places or experiences that interest you. Dates can follow later.")}</p></article>
      <article><span>02</span><h3>{L("Receive a route and price")}</h3><p>{L("Joy suggests a realistic route and an initial price range based on your trip length, group size and interests.")}</p></article>
      <article><span>03</span><h3>{L("Adjust before booking")}</h3><p>{L("Review changes to hotels, pace and experiences before booking; any change to included services or price is confirmed in writing.")}</p></article>
    </div><p className="preview-centered">{L("There is no payment or booking commitment when requesting an initial proposal.")}</p></div></section>
    {/* Traveler testimonials are withheld on this preview until original sources and permission are verified. */}
    <section className="section preview-plan" id="plan"><span id="ask-joy" /><div className="shell preview-plan-grid">
      <div className="preview-plan-joy"><div className="preview-joy-photo"><Image src="/brand/founder/portrait.webp" alt={L("Joy, founder of Hidden China Travel")} fill sizes="(max-width:700px) 100vw, 42vw" /></div><p className="kicker">{L("LOCAL PLANNING, LICENSED DELIVERY")}</p><h2>{L("Get a Suggested Yunnan Route & Price")}</h2><p>{L("You do not need a finished itinerary. Share your approximate number of days and group size, and we will suggest a realistic starting route and price range based on your interests, with bookings and on-the-ground arrangements coordinated by our licensed local team.")}</p><p><strong>{L("Yunnan-based operations team")}</strong> · Chinese- or English-speaking service · Licensed local delivery</p><p className="preview-quiet">{L("Prefer WhatsApp?")} <Link href={whatsapp} data-cta-location="preview_form_whatsapp">{L("Chat with Joy →")}</Link></p></div>
      <PreviewEnquiryForm locale={lang} />
    </div></section>
    <section className="section preview-payment journey-support-flow" id="booking-terms"><div className="shell journey-section-layout">
      <header className="preview-heading"><p className="kicker">{L("CLEAR TERMS, NO SURPRISES")}</p><h2>{L("Clear Booking and Payment")}</h2></header>
      <div className="journey-support-grid">
        <article><span>01</span><h3>{L("Review your proposal")}</h3><p>{L("Check the written route, named hotels, inclusions, exclusions and total price before you commit.")}</p><p>{lang === "zh" ? "报价还会写明币种、可选项目及最终确认的服务范围。" : "Your quote also states the currency, optional extras and the final scope of confirmed services."}</p></article>
        <article><span>02</span><h3>{L("Sign and confirm")}</h3><p>{L("Sign the licensed travel agency’s contract. A 20% deposit is our usual arrangement, subject to the agreed written terms.")}</p></article>
        <article><span>03</span><h3>{L("Complete the balance")}</h3><p>{L("The remaining balance is normally paid after your first pickup, as specified in your travel contract.")}</p></article>
      </div>
      <p className="preview-centered">{L("Your signed contract controls the payment schedule, cancellation terms and refunds.")}</p><p className="preview-centered"><Link href="/booking">{lang === "zh" ? "查看完整预订、付款和取消政策 →" : "Read the full booking, payment and cancellation information →"}</Link></p>
    </div></section>
    <section className="section journey-faq" id="questions"><div className="narrow"><h2>{L("Frequently Asked Questions")}</h2>{faqs.map(([q,a])=><details key={q} id={q === faqs[faqs.length - 1][0] ? "muslim-friendly" : undefined}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>{L("Your Yunnan journey starts with a conversation.")}</h2><span>{L("Tell us about your party and interests. Get a suggested route and initial price range, with no commitment to book.")}</span><a className="button button-light" href="#plan">{L("Get a Suggested Route & Price")}</a></div></section>
    <MobileCtaBar whatsappHref={whatsapp} formHref="#plan" whatsappLabel="" formLabel={L("Get a Suggested Route & Price")} formOnly formCtaLocation="preview_mobile_route_price" />
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [
      { "@type": "Service", name: lang === "zh" ? "云南私人定制旅行" : "Private and Tailor-Made Yunnan Tours", url: localeUrl(lang, "/private-yunnan-tours"), areaServed: { "@type": "Place", name: "Yunnan, China" }, provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" } },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ] }} />
    <ContentFooter />
  </main>;
}
