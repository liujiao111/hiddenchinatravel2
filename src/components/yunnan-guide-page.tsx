import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { formatPriceLabel } from "@/lib/format-price";
import type { Journey } from "@/lib/journeys";

const whatsapp = "https://wa.me/8618880441791?text=Hi%20Joy%2C%20I%27m%20planning%20a%20trip%20to%20Yunnan.%20My%20travel%20dates%20are%20____%20and%20I%27m%20interested%20in%20____.";

const facts = [
  ["BEST FOR", "First China trips · Culture · Mountains"],
  ["TIME TO ALLOW", "6–10 days for a first route"],
  ["MAIN GATEWAY", "Kunming"],
  ["EASIEST SEASONS", "Spring and autumn"],
];

const routeStops = [
  ["01", "Kunming", "Gateway", "Land, reset after the flight and begin west by high-speed rail. Kunming is the practical start rather than the part to rush through."],
  ["02", "Dali", "2–3 nights", "Use Dali as a slower lake-and-village base: Erhai, Bai culture, a walkable old town and enough time to leave the main streets."],
  ["03", "Shaxi", "1–2 nights", "Private transport makes this Tea Horse Road town easier to reach. Stay after the day visitors leave and let the square become quiet again."],
  ["04", "Lijiang", "2–3 nights", "Finish beneath Jade Dragon Snow Mountain, balancing a mountain day with the quieter lanes and villages beyond central Dayan."],
];

const placeCards = [
  {
    name: "Dali",
    note: "Erhai Lake, Bai villages and room to slow down.",
    image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp",
    href: "/dali-travel-guide",
  },
  {
    name: "Shaxi",
    note: "A living Tea Horse Road town worth staying overnight for.",
    image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp",
    href: "/dali-hidden-gems-off-the-beaten-path#shaxi-ancient-town-what-dali-looked-like-before-the-crowds-arrived",
  },
  {
    name: "Lijiang",
    note: "Old-town life and the high mountain landscape of northwest Yunnan.",
    image: "/home/hero.webp",
    href: "/journeys/kunming-dali-shaxi-lijiang-6-days#itinerary",
  },
];

const guides = [
  {
    title: "Dali Travel Guide",
    excerpt: "How long to stay, what Dali is really good for and how it fits a wider Yunnan route.",
    href: "/dali-travel-guide",
    image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp",
    readTime: "DESTINATION GUIDE",
  },
  {
    title: "Where to Stay in Dali",
    excerpt: "Choose between the Ancient Town, Erhai's west shore and a quieter village base.",
    href: "/where-to-stay-in-dali",
    image: "/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp",
    readTime: "ACCOMMODATION GUIDE",
  },
  {
    title: "Dali Hidden Gems & Shaxi",
    excerpt: "Shaxi, Xizhou, Zhoucheng, Weishan and the places beyond Dali's busiest streets.",
    href: "/dali-hidden-gems-off-the-beaten-path",
    image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp",
    readTime: "LOCAL GUIDE",
  },
];

const seasons = [
  ["March–May", "Spring", "Comfortable days around Kunming and Dali, with popular dates filling early around public holidays."],
  ["June–August", "Summer", "Green landscapes and afternoon rain. Build weather flexibility into mountain and outdoor days."],
  ["September–November", "Autumn", "Often the easiest balance of stable weather, clearer mountain views and comfortable daytime temperatures."],
  ["December–February", "Winter", "Kunming and Dali remain usable, but mornings in Lijiang and the northwest can be genuinely cold."],
];

const practical = [
  ["Payments", "Set up mobile payment and keep a small cash backup before leaving the larger cities.", "/payments-in-china"],
  ["Internet & eSIM", "Arrive with data working so maps, bookings, translation and ride-hailing are available from day one.", "/internet-in-china"],
  ["Transportation", "High-speed rail works well between Kunming, Dali and Lijiang; Shaxi is easier by road.", "/transport-in-china"],
  ["Hotels", "Confirm that each property can register a foreign passport, especially in smaller towns.", "/hotels-in-china"],
];

const faqs = [
  ["How many days do you need in Yunnan?", "Six days is enough for a focused Kunming–Dali–Shaxi–Lijiang route when transfers are arranged well. Eight to ten days gives you more unstructured time and makes it easier to add extra nights in Dali or Shaxi."],
  ["Is Yunnan a good first destination in China?", "Yes. It combines convenient rail connections, distinctive local cultures and dramatic landscapes without requiring a special regional permit on the usual route. Practical preparation for payments, data and hotels still matters."],
  ["What is the best first Yunnan itinerary?", "For most first visits, begin in Kunming, spend time around Dali and Erhai, continue by road to Shaxi, then finish in Lijiang. It is a coherent route without trying to include every part of the province."],
  ["Can I travel around Yunnan independently?", "Yes, especially between Kunming, Dali and Lijiang. Places such as Shaxi require more transport planning. A private journey is useful when you want those connections and local experiences arranged without joining a coach group."],
  ["Is Shaxi worth visiting?", "Yes if you can stay overnight. It is roughly two to three hours by road from Dali, so treating it as a rushed return day trip misses the quieter evening and morning that make the town special."],
  ["Should I add Shangri-La or Xishuangbanna?", "Only if you have enough time. Shangri-La extends the highland route north; Xishuangbanna is a separate tropical region far to the south. Adding either to a short first week usually creates more travel than experience."],
  ["When is the best time to visit Yunnan?", "Spring and autumn are the easiest all-round seasons for this route. Summer is greener but wetter, while winter can be pleasant around Kunming and Dali and much colder in Lijiang and the northwest."],
];

export function YunnanGuidePage({ journey }: { journey: Journey }) {
  const { frontmatter } = journey;
  const journeyHref = `/journeys/${journey.slug}`;
  const price = `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Yunnan",
    description: "A practical guide to planning a first Yunnan journey through Kunming, Dali, Shaxi and Lijiang.",
    url: "https://hiddenchinatravel.com/china-destinations/yunnan",
    image: "https://hiddenchinatravel.com/home/hero.webp",
    touristType: ["First-time visitors to China", "Culture travelers", "Slow travel"],
  };

  return <main>
    <SiteHeader />
    <nav className="breadcrumbs yunnan-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><span>Yunnan Travel Guide</span></nav>

    <header className="yunnan-hero">
      <Image src="/home/hero.webp" alt="Snow mountains and countryside in Yunnan" fill priority unoptimized sizes="100vw" />
      <div className="yunnan-hero-shade" />
      <div className="shell yunnan-hero-copy"><p>YUNNAN TRAVEL GUIDE · 2026</p><h1>Yunnan, beyond the checklist.</h1><span>From Kunming and Dali to Shaxi and Lijiang, plan a first journey with realistic travel times, local insight and room to slow down.</span><div><Link className="button yunnan-primary-action" href={journeyHref}>EXPLORE THE 6-DAY JOURNEY</Link><Link className="yunnan-text-action" href="#plan">START WITH THE GUIDE <b>↓</b></Link></div></div>
    </header>

    <section className="yunnan-facts"><div className="shell">{facts.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></section>

    <nav className="yunnan-anchor-nav" aria-label="On this page"><div className="shell"><Link href="#plan">Plan</Link><Link href="#places">Places</Link><Link href="#route">Route</Link><Link href="#from-abroad">From abroad</Link><Link href="#guides">Dali guides</Link><Link href="#season">Season</Link><Link href="#prepare">Prepare</Link><Link href="#faq">FAQ</Link></div></nav>

    <section className="yunnan-intro" id="plan"><div className="narrow"><span>START WITH THE SHAPE OF THE TRIP</span><h2>Yunnan is a province, not one climate or one quick loop.</h2><p>Kunming is the usual gateway. Dali brings the lake basin and Bai villages. Shaxi rewards an overnight stay on the old Tea Horse Road, while Lijiang leads into the high mountain landscape of northwest Yunnan.</p><p>For a first trip, these four places form a coherent route. Xishuangbanna and Shangri-La are both worthwhile, but they pull the journey in different directions. Add one only when your dates and interests justify the extra travel.</p></div></section>

    <section className="yunnan-places section section-sand" id="places"><div className="shell"><div className="yunnan-section-heading"><span>WHERE TO GO</span><h2>Four stops, one natural direction.</h2><p>Move west from Kunming rather than treating every famous place in Yunnan as a separate box to tick.</p></div><div className="yunnan-route-stops">{routeStops.map(([number, name, stay, copy]) => <article key={number}><span>{number}</span><div><small>{stay}</small><h3>{name}</h3><p>{copy}</p></div></article>)}</div><div className="yunnan-place-grid">{placeCards.map((place) => <Link href={place.href} key={place.name}><Image src={place.image} alt={place.name} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /><i aria-hidden="true" /><div><p>{place.note}</p><h3>{place.name}</h3><span>EXPLORE →</span></div></Link>)}</div></div></section>

    <section className="yunnan-featured section" id="route"><div className="shell yunnan-featured-layout"><div><span>RECOMMENDED FIRST JOURNEY</span><h2>Kunming → Dali → Shaxi → Lijiang</h2><p>The route works because each place changes the rhythm rather than repeating the last stop. Rail handles the larger city connections; private road transport opens the stretch through Shaxi.</p><p>The six-day version is focused and comfortable when the logistics are already arranged. If you prefer longer mornings or more unscheduled time, add nights in Dali or Shaxi rather than adding another region.</p><Link href={journeyHref}>See the complete itinerary and pricing →</Link></div><JourneyCard journey={{title:"Dali, Shaxi & Lijiang",subtitle:"A private first journey through Yunnan.",href:journeyHref,image:frontmatter.coverImage,imageAlt:frontmatter.title,duration:frontmatter.duration,fromPrice:price,features:["Private journey","No shopping stops","Local experiences","Flexible pace"]}} /></div></section>

    <section className="yunnan-from-abroad section" id="from-abroad"><div className="shell"><div className="yunnan-section-heading"><span>STARTING OUTSIDE CHINA</span><h2>Plan Yunnan from where you live.</h2><p>Entry rules, connections and realistic trip length depend on where your journey begins—and which passport you hold.</p></div><div className="yunnan-country-grid"><Link href="/yunnan-travel-from-singapore"><span>FROM SINGAPORE</span><h3>Yunnan from Singapore</h3><p>Check the visa-free route, flights to Kunming and how to fit Dali, Shaxi and Lijiang into your time away.</p><b>READ THE SINGAPORE GUIDE →</b></Link><Link href="/yunnan-travel-from-usa"><span>FROM THE USA</span><h3>Yunnan from the USA</h3><p>Compare visa and transit options, connecting flights and a slower route that makes the long journey worthwhile.</p><b>READ THE USA GUIDE →</b></Link><Link href="/yunnan-travel-from-australia"><span>FROM AUSTRALIA</span><h3>Yunnan from Australia</h3><p>Check the 30-day visa-free policy, routes to Kunming and a realistic 6–8 day first journey.</p><b>READ THE AUSTRALIA GUIDE →</b></Link></div></div></section>

    <section className="yunnan-guides section section-sand" id="guides"><div className="shell"><div className="yunnan-section-heading"><span>PLAN DALI IN MORE DETAIL</span><h2>Go from the province to the decisions that shape each day.</h2><p>Use the destination guide first, then choose where to stay and which places beyond the old town deserve your time.</p></div><div className="yunnan-guide-grid">{guides.map((guide) => <GuideCard key={guide.href} guide={guide} />)}</div></div></section>

    <section className="yunnan-season section" id="season"><div className="shell"><div className="yunnan-section-heading"><span>WHEN TO GO</span><h2>“Spring all year” does not describe the whole province.</h2><p>Kunming may be mild while Lijiang mornings are cold and the mountains are dealing with entirely different weather.</p></div><div className="yunnan-season-grid">{seasons.map(([dates, name, copy]) => <article key={name}><span>{dates}</span><h3>{name}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="yunnan-prepare section" id="prepare"><div className="shell"><div className="yunnan-section-heading light"><span>BEFORE YOU ARRIVE</span><h2>Make the unfamiliar systems easier before travel day.</h2><p>A beautiful route still depends on working payments, data, transport and foreign-passport accommodation.</p></div><div className="yunnan-practical-grid">{practical.map(([title, copy, href], index) => <Link href={href} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>READ THE GUIDE →</b></Link>)}</div><div className="center"><Link href="/china-travel-essentials" className="button button-light">OPEN THE CHINA SURVIVAL KIT</Link></div></div></section>

    <section className="yunnan-faq section" id="faq"><div className="narrow"><div className="yunnan-section-heading"><span>COMMON QUESTIONS</span><h2>Planning a first Yunnan trip</h2></div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="yunnan-final-cta"><div><span>NOT SURE WHICH ROUTE FITS?</span><h2>Tell Joy where you are in the planning process.</h2><p>Dates decided or just researching—share your interests and preferred pace. You’ll get a personal answer without sales pressure.</p><div><Link href={whatsapp} className="button button-light">CHAT WITH JOY ON WHATSAPP</Link><Link href={journeyHref}>VIEW THE 6-DAY JOURNEY →</Link></div></div></section>

    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
