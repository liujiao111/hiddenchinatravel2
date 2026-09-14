import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn how Hidden China Travel combines practical China travel guidance with locally delivered, personalized journeys across Yunnan.",
};

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20planning%20a%20Yunnan%20trip";

const steps = [
  ["1", "We start with how you want to travel", "Before suggesting places, we ask about your interests, pace, comfort, dates and the parts of China travel that feel uncertain."],
  ["2", "We turn interests into experiences", "Food, villages, photography, local craft or simply more breathing room—your priorities shape what belongs in the route."],
  ["3", "We build a journey around you", "The itinerary is adapted to you rather than forcing you into a rigid, one-size-fits-all package."],
  ["4", "We refine the practical details", "We help align travel times, accommodation areas, local transport and daily intensity so the route works on the ground."],
  ["5", "We help you arrive prepared", "Our China guides cover payments, internet access, maps, trains, hotels and other details that often worry first-time visitors."],
  ["6", "Local partners deliver the trip", "Licensed local travel partners handle contracts and on-the-ground services, with local support available during your journey."],
];

const promises = [
  ["A pace that suits you", "Choose a lighter rhythm or fuller days. We design around your energy, not a coach-tour timetable."],
  ["Local knowledge, clearly explained", "We translate local realities into straightforward advice for international visitors."],
  ["Experiences beyond the checklist", "We look for villages, makers, food and everyday encounters—not only famous ticketed sights."],
  ["A responsible way to book", "Your booking and travel contract are handled by the licensed local operator delivering the service."],
];

function Header() {
  return <header className="site-header"><div className="topbar shell"><Link href="/" className="brand"><span className="brand-mark">H</span><span><b>Hidden China</b><small>TRAVEL</small></span></Link><div className="header-contact"><span>Local insight for independent-minded travelers</span><Link className="button button-blue" href={whatsapp}>PLAN MY JOURNEY</Link></div></div><nav className="nav-row"><div className="shell nav-inner"><div className="nav-links"><Link href="/#destinations">DESTINATIONS⌄</Link><Link href="/#journeys">JOURNEYS⌄</Link><Link href="/#guides">TRAVEL GUIDES⌄</Link><Link href="/about-us">ABOUT US</Link><Link href={whatsapp}>LOCAL SUPPORT</Link></div><label className="search-box"><span className="sr-only">Search</span><input placeholder="Search China guides..." /><b>⌕</b></label></div></nav></header>;
}

function Footer() {
  return <><section className="newsletter"><div className="shell newsletter-inner"><div><p className="kicker">FREE DALI LOCAL GUIDE</p><h2>Practical ideas for your inbox</h2><p>Get our Dali guide and occasional, useful China travel advice.</p></div><form><label><span className="sr-only">First name</span><input type="text" placeholder="First name" /></label><label><span className="sr-only">Email</span><input type="email" placeholder="Email address" /></label><button type="button" className="button button-green">GET THE GUIDE</button></form></div></section><footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">H</span><h2>Hidden China Travel</h2><p>Travel guides, local expertise, and personalized journeys across Yunnan and beyond.</p></div><div><h3>Explore</h3><Link href="/#destinations">Yunnan</Link><Link href="/#journeys">Journey ideas</Link><Link href="/#guides">China travel guides</Link></div><div><h3>Plan</h3><Link href={whatsapp}>Talk to us</Link><Link href="/about-us">About us</Link><Link href="/china-visa-checker">China visa checker</Link></div><div><h3>Practical</h3><Link href="/payments-in-china">Payments</Link><Link href="/internet-in-china">Internet & eSIM</Link><Link href="/transport-in-china">Getting around</Link></div></div><div className="shell footer-bottom"><span>© 2026 Hidden China Travel</span><span>Independent guidance · Local connections · Yunnan first</span></div></footer></>;
}

export default function AboutPage() {
  return <main><Header />
    <section className="about-hero"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp" alt="A traditional Bai courtyard in Xizhou, Yunnan" fill priority sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">ABOUT HIDDEN CHINA TRAVEL</p><h1>China travel, shaped around you</h1></div></section>

    <nav className="about-subnav" aria-label="About us sections"><div className="shell"><span>ABOUT US</span><Link href="#our-approach">Our approach</Link><Link href="#how-it-works">How it works</Link><Link href="#local-partners">Local partners</Link><Link href="#why-us">Why travel with us</Link></div></nav>

    <section className="about-intro" id="our-approach"><div className="narrow"><p className="kicker">TRAVEL SHAPED AROUND YOU</p><h2>See China in a way that feels like your own</h2><p>China can feel both exciting and difficult to plan—especially the first time. Hidden China Travel exists to make it clearer. We combine practical, independent travel guidance with personalized journeys delivered by local partners, beginning in Yunnan.</p><p>That might mean a slower week around Dali, a village stay on the old Tea Horse Road, or simply knowing that payments, trains and internet access are sorted before you arrive.</p></div></section>

    <section className="about-feature"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/zhoucheng-bai-tie-dye.webp" alt="Traditional Bai tie-dye craft in Zhoucheng" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">LOCAL PERSPECTIVE</p><h2>Advice built for international travelers</h2><p>Knowing a place is only half the job. The other half is explaining it in a way that makes sense to someone visiting China for the first time.</p><p>Our destination guidance focuses on the questions international visitors actually ask: how long transfers take, where to stay, what requires a Chinese phone number, how demanding a day feels, and when a private driver genuinely makes the trip easier.</p><Link href="/#guides">Explore our China travel guides →</Link></div></section>

    <section className="about-feature reverse"><div className="about-feature-image"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="Everyday rural life beside the river in Shaxi" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">MEANINGFUL EXPERIENCES</p><h2>More than a list of famous sights</h2><p>A memorable journey is not measured by how many attractions fit into one day. We look for experiences that reveal the place: a market morning, a Bai courtyard, a local maker, a country road or enough time for an unhurried meal.</p><p>Famous landmarks can still belong in the trip. They simply do not have to dominate it.</p></div></section>

    <section className="support-banner" id="local-partners"><Image src="https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="The ecological corridor beside Erhai Lake in Dali" fill sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">CLEAR ROLES, LOCAL DELIVERY</p><h2>Supported before and during your journey</h2><p>We help you explore the options and shape the request. The licensed local travel operator confirms the final itinerary, quote and contract, then delivers the booked services on the ground.</p><Link href={whatsapp} className="button button-blue">START A CONVERSATION</Link></div></section>

    <section className="section about-steps section-sand" id="how-it-works"><div className="shell"><div className="section-heading"><p className="kicker">HOW IT WORKS</p><h2>From first idea to arrival</h2></div><div className="steps-grid">{steps.map(([number,title,text]) => <article key={number}><i>{number}</i><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

    <section className="responsible"><div className="shell responsible-grid"><div><p className="kicker">TRAVELLING THE RIGHT WAY</p><h2>Better for the traveler and the place</h2><p>Slower routes often create better trips. They reduce exhausting transfers, leave more spending with local businesses, and make room for genuine encounters instead of treating communities as scenery.</p><p>We favor realistic pacing, locally delivered services and honest guidance. We also avoid presenting unverified claims or invented first-hand experiences as fact.</p></div><div className="responsible-image"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/weishan-xinggong-tower.webp" alt="Historic Xinggong Tower in Weishan" fill sizes="(max-width: 800px) 100vw, 42vw" /></div></div></section>

    <section className="section why about-why" id="why-us"><div className="shell"><div className="section-heading light"><p className="kicker">WHY HIDDEN CHINA TRAVEL</p><h2>A more personal way to plan Yunnan</h2></div><div className="promise-grid">{promises.map(([title,text],index) => <article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="center"><Link href={whatsapp} className="button button-light">TELL US ABOUT YOUR TRIP</Link></div></div></section>
    <Footer />
  </main>;
}
