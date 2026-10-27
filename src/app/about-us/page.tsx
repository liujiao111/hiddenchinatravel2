import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { OperatorCredentials } from "@/components/operator-credentials";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { brandIdentity, cancellationCopy, contractCopy, paymentCopy } from "@/lib/booking-terms";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";
import { getSelectedTestimonials, selectedTestimonialsCopy } from "@/lib/testimonials";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import styles from "./about.module.css";

const title = "Meet Joy Liu | About Hidden China Travel";
const description = "Meet Joy Liu, Yunnan-born founder of Hidden China Travel, and discover the local insight and thoughtful planning behind our private Yunnan journeys.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about-us" },
  openGraph: {
    title,
    description,
    url: "/about-us",
    type: "website",
    images: [{ url: "/brand/founder/portrait.webp", alt: "Joy Liu, founder of Hidden China Travel" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/founder/portrait.webp"],
  },
};

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi Joy, I read your story on the About page and would love to discuss a Yunnan trip.")}`;
const reasons = [
  ["A local perspective. A traveller’s understanding.", "Yunnan is home, and travelling across China and abroad has shaped how I see it. I understand both the places you want to explore and the questions you may not know to ask."],
  ["A real person, not a booking queue.", "You speak directly with me about your trip. Your interests, questions and preferences guide the conversation instead of getting lost between sales messages and standard packages."],
  ["The details behind a good day.", "A beautiful route is only the beginning. We work through driving time, hotel location, walking demands, ticket arrangements and seasonal conditions before anything is confirmed."],
  ["A journey built around you.", "Private travel gives us room to shape the pace, choose meaningful experiences and leave space to enjoy them. Famous sights and quieter discoveries both belong—when they are right for you."],
];
const questions = [
  ["Will I speak with Joy directly?", "Yes. Joy Liu is your travel consultant at the licensed agency. He helps you clarify your ideas and stays with you from the first enquiry through the journey."],
  ["Who operates the trip and handles payment?", `${brandIdentity.short} ${contractCopy.full} ${paymentCopy.product} ${cancellationCopy.full}`],
  ["Do I need a finished itinerary?", "No. Tell Joy roughly when you want to travel, who is coming and what you enjoy. You can start with an existing journey or discuss adjustments to the route, hotels and pace."],
  ["What if weather or availability changes?", "Weather, attraction access and hotel availability can change. Alternatives and any effect on price or schedule are discussed with the operator; your booking terms explain changes and cancellations."],
];

export default function AboutPage() {
  const stories = getSelectedTestimonials();

  return <><SiteHeader /><main className={styles.page}>
    <section className={styles.hero}>
      <Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp" alt="A traditional Bai courtyard in Xizhou, Yunnan" fill preload sizes="100vw" />
      <div className={styles.shade} />
      <div className={styles.heroCopy}>
        <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>About us</span></nav>
        <h1>A local connection.<br />A more personal China.</h1>
        <p>I’m Joy Liu. Born in Yunnan, shaped by journeys across China and beyond. I created Hidden China Travel to help you feel confident here—and discover a China that stays with you.</p>
        <Link href="#joy" className="button button-light">MEET JOY</Link>
      </div>
    </section>
    <nav className={styles.subnav} aria-label="About sections"><Link href="#joy">Meet Joy</Link><Link href="#philosophy">Our philosophy</Link><Link href="#why-us">Why travel with us</Link><Link href="#booking">Booking with confidence</Link><Link href="#local-partners">Local operator</Link><Link href="#stories">Stories</Link></nav>

    <section className={`shell ${styles.founder}`} id="joy">
      <figure className={styles.portrait}><Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 42vw" /><figcaption><strong>Joy Liu</strong><span>Founder, Hidden China Travel</span><span>Based in Kunming, Yunnan, China</span></figcaption></figure>
      <div className={styles.copy}><h2>Yunnan is home.<br />Travel changed how I see it.</h2>
        <p>I’ve travelled through most of China’s major tourist cities—from Beijing, Shanghai and Xi’an to Guangzhou, Xiamen, Qingdao, Chongqing, Chengdu and Wuhan—and explored places as different as Guilin and Xinjiang.</p>
        <p>Abroad, I’ve watched sunsets in Kota Kinabalu, dived off Bohol, gone sea fishing in Phuket and chased waves at Shirahama in Japan. But the most important thing I brought home wasn’t a longer list of places.</p>
        <p>At first, I travelled the way many of us do: following the crowds, moving quickly and making sure I had seen every famous sight. Gradually, I began to care less about how much I could fit in—and more about how a journey made me feel.</p>
        <p>A slow coffee in an old town. A stream beside an open field. Blue sky, with nowhere I needed to rush. Leaving an office building behind for a mountain landscape, I was still the same person, but in a very different frame of mind.</p>
        <p className={styles.signature}>That is the feeling I want to help you find in China.</p>
      </div>
    </section>

    <section className={styles.origin}><div className={`shell ${styles.split}`}><h2>I know how much work goes into feeling carefree.</h2><div className={styles.copy}>
      <p>I know the other side of travel, too: comparing hotel reviews, checking ticket times, wondering whether weather will close an attraction, or realising the last bus from a remote spot may leave before you do.</p>
      <p>In a country where you don’t speak the language, even a small problem can feel much bigger. I’ve felt that uncertainty myself.</p>
      <p>Hidden China Travel grew from a simple idea: you should arrive in China feeling curious, not overwhelmed. Our free guides answer the practical questions. Our personal trip planning brings your ideas together into a journey you can look forward to.</p>
      <Link className={styles.textLink} href="/survival-kit">See how we help you prepare for China →</Link>
    </div></div></section>

    <section className={styles.philosophy} id="philosophy"><div className={styles.landscape}><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt="Everyday life beside the river in Shaxi, Yunnan" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className={styles.philosophyCopy}>
      <h2>China has its icons.<br />And its quieter moments.</h2>
      <p>The Forbidden City and the Great Wall deserve their place in your imagination. But there is also a China of village markets, mountain mornings, small family restaurants and unhurried afternoons beside the water.</p>
      <p>You don’t have to choose between famous places and personal discoveries. The difference is leaving enough time to enjoy both.</p>
      <p>We begin in Yunnan, the place I call home: a natural starting point for journeys through old towns, living traditions and extraordinary landscapes.</p>
      <Link className={styles.textLink} href="/journeys">Explore our Yunnan journeys →</Link><p><Link className={styles.textLink} href="/custom-china-tour" data-cta-location="about_custom">Plan a Yunnan journey around your own ideas →</Link></p>
    </div></section>
    <section className={styles.quote}><blockquote>“Remember how Yunnan felt,<br />not just where you went.”</blockquote><p>Joy Liu · Founder, Hidden China Travel</p></section>

    <section className={`shell ${styles.section}`} id="why-us"><div className={styles.heading}><h2>Why plan your journey with us?</h2><p>Personal attention, practical thinking and local insight—so you spend less time figuring things out and more time enjoying where you are.</p></div><div className={styles.reasons}>{reasons.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={styles.booking} id="booking"><div className="shell"><div className={styles.heading}><h2>Personal service.<br />Clear responsibilities.</h2><p>Trust means knowing who you are speaking to, what you are paying for and who will welcome you on the ground.</p></div><div className={styles.roles}>
      <article><h3>Your travel consultant: Joy</h3><p>I listen to what matters to you and help shape the route. You speak with me from the first enquiry through the journey, not a booking queue.</p></article>
      <article><h3>Your licensed agency: {licensedOperator.nameEn}</h3><p>Hidden China Travel is the English-language site of {licensedOperator.nameEn} ({licensedOperator.nameZh}). The office is {licensedOperator.addressEn}. The travel contract and all payments go to that agency’s corporate account, in the company’s name. Its travel agency permit number is {licensedOperator.permitNumber}.</p><p><Link href="/licensed-operator">Company documents and 2026 liability insurance →</Link></p></article>
    </div><div className={styles.checklist}><h3>Before you commit, we work through:</h3><ul><li>Your route, pace and hotel arrangements</li><li>What the price includes—and excludes</li><li>The operator’s identity, payment and cancellation terms</li><li>Local contacts and arrangements for changes</li></ul><p>No pressure to decide before your questions are answered.</p></div>
    <div id="local-partners"><OperatorCredentials /></div></div></section>

    <Testimonials
      items={stories}
      eyebrow={selectedTestimonialsCopy.eyebrow}
      heading={selectedTestimonialsCopy.heading}
      intro={selectedTestimonialsCopy.intro}
      note={selectedTestimonialsCopy.note}
      archiveHref="/traveler-stories"
      archiveLabel="Read the traveler stories"
    />

    <section className={styles.faq}><div className={`shell ${styles.faqGrid}`}><div><h2>A few things you might be wondering</h2><p>Good journeys begin with clear answers.</p></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    <section className={styles.cta}><div className="shell"><h2>Let’s start with your kind of journey.</h2><p>A few dates, a place you’ve been dreaming about, or simply how you want the trip to feel. Tell me what’s on your mind.</p><Link href={whatsapp} className="button button-light">Start Planning Your Journey</Link><Link href="/contact">Prefer email? Get in touch →</Link><span>Speak directly with Joy Liu. No commitment to book.</span></div></section>
  </main><ContentFooter />
  <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbList([{ name: "Home", href: "/" }, { name: "About us", href: "/about-us" }])] }} />
  </>;
}
