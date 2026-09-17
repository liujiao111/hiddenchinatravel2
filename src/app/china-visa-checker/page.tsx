import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { VisaChecker } from "@/components/travel-tools/visa-checker";
import { getCountrySelectOptions, getPortSelectOptions } from "@/lib/visa-checker/load-rules";
import { getPhase1CountryEditorials } from "@/lib/visa-checker/country-pages";
import "../travel-tools.css";

export const metadata: Metadata = {
  title: "China Visa Checker 2026: Visa-Free, Transit or Tourist Visa?",
  description: "Check your passport, stay and route against China visa-free, Hainan and 240-hour transit rules. See the conditions to confirm before you fly.",
  alternates: { canonical: "/china-visa-checker" },
  openGraph: { title: "China Visa Checker | Hidden China Travel", description: "Check China entry options by passport and route.", url: "/china-visa-checker", type: "website" },
};

const faq = [
  ["Does visa-free entry cover all passport types?", "The published exemptions generally concern ordinary passports. If you have an emergency or temporary document, confirm with a Chinese consulate and your airline."],
  ["Is the 240-hour rule the same as a tourist visa?", "No. It applies to eligible nationalities transiting to a different country or region via eligible ports, subject to stay limits and a permitted area."],
  ["Do I need to show an onward ticket?", "For 240-hour transit you need a confirmed onward ticket to a third country or region. Border officers may also ask visa-free visitors for their itinerary and accommodation details."],
];

export default function ChinaVisaCheckerPage() {
  const countryLinks = getPhase1CountryEditorials();
  return <main><SiteHeader /><header className="tool-hero"><Image src="/assets/blog/do-i-need-a-visa-for-china/cover.webp" alt="Passport and travel documents for a China journey" fill priority unoptimized sizes="100vw" /><div className="tool-hero-shade" /><nav className="breadcrumbs tool-breadcrumb shell"><Link href="/">Home</Link><span>›</span><Link href="/survival-kit">Survival Kit</Link><span>›</span><span>Visa Checker</span></nav><div className="shell tool-hero-copy"><span>CHINA TRAVEL TOOLS</span><h1>China Visa Checker</h1><p>Find the entry path that fits your passport and route before you book the journey.</p><Link className="button button-light" href="#check-visa">CHECK MY ENTRY OPTIONS ↓</Link></div></header>
    <section className="tool-section"><div className="shell tool-main"><VisaChecker countries={getCountrySelectOptions()} ports={getPortSelectOptions()} /><aside className="tool-aside"><span>GOOD TO KNOW</span><h2>One question can change the answer.</h2><p>A return flight to your starting country is different from a confirmed transit to a third country. The arrival port and length of stay also matter.</p><Link href="/do-i-need-a-visa-for-china">Read the China visa guide →</Link><Link href="/survival-kit">Open the travel checklist →</Link></aside></div></section>
    <section className="tool-section tool-sand" id="countries"><div className="shell"><div className="tool-section-heading"><span>COUNTRY GUIDES</span><h2>Start with your passport.</h2><p>Country pages explain the general rule. Use the checker above for your specific route.</p></div><div className="tool-country-grid">{countryLinks.map((country) => <Link key={country.slug} href={`/china-visa-checker/${country.slug}`}>{country.displayName}<span>VIEW GUIDE →</span></Link>)}</div></div></section>
    <section className="tool-section" id="official-sources"><div className="shell tool-two-cols"><div><span className="tool-kicker">VERIFY BEFORE DEPARTURE</span><h2>Official sources</h2><p>Policies and eligible ports can change. Check the published rules for your passport and ask your airline to confirm travel-document requirements.</p></div><div className="tool-link-list"><a href="https://en.nia.gov.cn/" target="_blank" rel="noopener noreferrer">National Immigration Administration ↗</a><a href="https://www.fmprc.gov.cn/mfa_eng/" target="_blank" rel="noopener noreferrer">Chinese Ministry of Foreign Affairs ↗</a><a href="https://www.visaforchina.cn/" target="_blank" rel="noopener noreferrer">China Visa Application Service Center ↗</a></div></div></section>
    <section className="tool-section tool-sand"><div className="shell tool-two-cols"><div><span className="tool-kicker">COMMON QUESTIONS</span><h2>Before you rely on an entry rule</h2></div><div className="tool-faq">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section><ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "China Visa Checker", url: "https://hiddenchinatravel.com/china-visa-checker", applicationCategory: "TravelApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
  </main>;
}
