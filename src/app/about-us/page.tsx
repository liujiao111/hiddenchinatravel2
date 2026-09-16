import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About Hidden China Travel | Born in Yunnan",
  description: "Meet the story behind Hidden China Travel: born in Yunnan, shaped by experiences abroad, and created for slower, more personal journeys through China.",
};

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20planning%20a%20Yunnan%20trip";

const steps = [
  ["1", "Tell us how you like to travel", "We begin with your interests, pace, comfort, dates and the parts of traveling in China that feel unfamiliar."],
  ["2", "We share honest local advice", "We explain what is worth your time, what can be skipped and how each place actually feels on the ground."],
  ["3", "Your route takes shape", "Markets, villages, food, local craft and breathing room are combined into a journey that reflects you."],
  ["4", "We make the details work", "Travel times, hotel areas, private transport and daily intensity are adjusted into a realistic plan."],
  ["5", "You arrive with confidence", "Practical guidance on payments, internet, maps and trains helps remove the usual first-trip uncertainty."],
  ["6", "Trusted partners welcome you", "Licensed local operators contract and deliver the booked services, with support available along the way."],
];

const promises = [
  ["A pace that suits you", "Choose a lighter rhythm or fuller days. We design around your energy, not a coach-tour timetable."],
  ["Yunnan knowledge, clearly explained", "Places we have known for years are translated into straightforward advice for international visitors."],
  ["Experiences beyond the checklist", "We look for villages, makers, food and everyday encounters—not only famous ticketed sights."],
  ["A responsible way to book", "Your booking and travel contract are handled by the licensed local operator delivering the service."],
];

export default function AboutPage() {
  return <main><SiteHeader />
    <section className="about-hero"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp" alt="A traditional Bai courtyard in Xizhou, Yunnan" fill priority sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">ABOUT HIDDEN CHINA TRAVEL</p><h1>Born in Yunnan. Shaped by experiences abroad.</h1></div></section>

    <nav className="about-subnav" aria-label="About us sections"><div className="shell"><span>ABOUT US</span><Link href="#our-story">Our story</Link><Link href="#our-approach">Our philosophy</Link><Link href="#how-it-works">How it works</Link><Link href="#local-partners">Local partners</Link><Link href="#why-us">Why travel with us</Link></div></nav>

    <section className="about-feature" id="our-story"><div className="about-feature-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill priority sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">OUR STORY</p><h2>I&apos;m Joy Liu. Yunnan is home.</h2><p>I was born and raised in southwest China. Local markets, mountain roads, village festivals, family restaurants and the old towns of the Tea Horse Road were simply part of everyday life.</p><p>When I moved abroad, I became the foreigner for the first time. Simple things—getting around, choosing a neighborhood and understanding local customs—suddenly felt complicated. I learned that someone local you trust can transform a trip: not by helping you see more, but by helping you feel comfortable enough to truly experience a place.</p><p>That experience became the foundation of Hidden China Travel.</p></div></section>

    <section className="about-feature reverse" id="our-approach"><div className="about-feature-image"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/zhoucheng-bai-tie-dye.webp" alt="Traditional Bai tie-dye craft in Zhoucheng" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">WHY WE STARTED</p><h2>Travel becomes better when you understand a place</h2><p>Back in Yunnan, Joy saw that international visitors faced the same uncertainty she had experienced abroad—not because China is unwelcoming, but because it can feel unfamiliar at first.</p><p>Hidden China Travel was created to replace weeks of stressful research with clear local guidance, so you can travel with more confidence, more comfort and a deeper connection to the places you visit.</p><Link href="/#guides">Explore our China travel guides →</Link></div></section>

    <section className="about-feature"><div className="about-feature-image"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="Everyday rural life beside the river in Shaxi" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="about-feature-copy"><p className="kicker">OUR TRAVEL PHILOSOPHY</p><h2>Remember how a place felt</h2><p>A quiet evening in Shaxi. A conversation in a tie-dye workshop. A slow breakfast overlooking Erhai Lake. These are the moments that stay with you.</p><p>We do not believe more destinations automatically create better memories. Our journeys leave time to slow down, observe and connect—with famous sights included where they add meaning, not simply to fill a checklist.</p></div></section>

    <section className="support-banner" id="local-partners"><Image src="/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp" alt="The ecological corridor beside Erhai Lake in Dali" fill sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">WHY YUNNAN</p><h2>We began with the place we know best: home</h2><p>Ancient towns, snow-capped mountains, Tea Horse Road history and living local traditions make Yunnan a gentle, rewarding introduction to China. These are not places we recently discovered; they are places we have known for years.</p><Link href={whatsapp} className="button button-blue">START A CONVERSATION</Link></div></section>

    <section className="section about-steps section-sand" id="how-it-works"><div className="shell"><div className="section-heading"><p className="kicker">HOW IT WORKS</p><h2>From first idea to arrival</h2></div><div className="steps-grid">{steps.map(([number,title,text]) => <article key={number}><i>{number}</i><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>

    <section className="responsible"><div className="shell responsible-grid"><div><p className="kicker">OUR COMMITMENT</p><h2>Less filling the itinerary. More enjoying the journey.</h2><p>No forced shopping stops, commission-based detours or tourist factories disguised as cultural experiences. We prioritize what we would genuinely recommend to friends and family.</p><p>If something is not worth your time, we will say so—even when that means recommending less. Slower, realistic routes are often better for the traveler and leave more room for local people and businesses.</p></div><div className="responsible-image"><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/weishan-xinggong-tower.webp" alt="Historic Xinggong Tower in Weishan" fill sizes="(max-width: 800px) 100vw, 42vw" /></div></div></section>

    <section className="section why about-why" id="why-us"><div className="shell"><div className="section-heading light"><p className="kicker">WHY HIDDEN CHINA TRAVEL</p><h2>China, at your pace</h2><p>We are not here to help you see more of China. We are here to help you feel more comfortable, connected and confident exploring it.</p></div><div className="promise-grid">{promises.map(([title,text],index) => <article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="center"><Link href={whatsapp} className="button button-light">TELL US ABOUT YOUR TRIP</Link></div></div></section>
    <ContentFooter />
  </main>;
}
