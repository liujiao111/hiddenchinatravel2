import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { getCountryVisaPage, getPhase1CountryEditorials, resolveCountrySlug } from "@/lib/visa-checker/country-pages";
import "../../travel-tools.css";

type Props = { params: Promise<{ country: string }> };

export function generateStaticParams() { return getPhase1CountryEditorials().map((country) => ({ country: country.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const model = getCountryVisaPage(country);
  if (!model) return { title: "China Visa Guide" };
  return { title: model.title, description: model.description, alternates: { canonical: `/china-visa-checker/${model.editorial.slug}` }, openGraph: { title: model.title, description: model.description, url: `/china-visa-checker/${model.editorial.slug}`, type: "article" } };
}

export default async function CountryVisaPage({ params }: Props) {
  const { country } = await params;
  const slug = resolveCountrySlug(country);
  if (slug !== country.toLowerCase()) permanentRedirect(`/china-visa-checker/${slug}`);
  const page = getCountryVisaPage(slug);
  if (!page) notFound();
  const yunnanGuide = slug === "singapore" ? { href: "/yunnan-travel-from-singapore", label: "Yunnan travel from Singapore", copy: "See how the entry rules fit a flight to Kunming and a Dali–Shaxi–Lijiang route." } : slug === "united-states" ? { href: "/yunnan-travel-from-usa", label: "Yunnan travel from the USA", copy: "Compare visa and transit routes before planning flights and time in Yunnan." } : null;

  return <main><SiteHeader /><header className="tool-country-hero"><nav className="breadcrumbs shell"><Link href="/">Home</Link><span>›</span><Link href="/china-visa-checker">Visa Checker</Link><span>›</span><span>{page.editorial.displayName}</span></nav><div className="shell"><span>VISA & ENTRY · {page.editorial.displayName.toUpperCase()}</span><h1>{page.h1}</h1><p>{page.description}</p><Link className="button button-light" href="/china-visa-checker#check-visa">CHECK MY EXACT ROUTE →</Link></div></header>
    <section className="tool-section"><div className="shell tool-main"><article className="tool-country-copy"><span className="tool-kicker">THE SHORT ANSWER</span><h2>{page.conclusionHeadline}</h2><p>{page.conclusionSummary}</p><div className="tool-country-points"><h3>What this means for your trip</h3><ul>{page.conclusionChecklist.map((item) => <li key={item}>{item}</li>)}</ul></div>{page.editorial.uniqueNotes.length > 0 && <div className="tool-country-points"><h3>Notes for {page.editorial.displayName} passport holders</h3><ul>{page.editorial.uniqueNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>}{page.editorial.commonRoutes && <div className="tool-country-points"><h3>Route planning</h3><p>{page.editorial.commonRoutes}</p></div>}{page.transit240 && <div className="tool-country-points"><h3>240-hour transit</h3><p>{page.transitResult?.summary || "A transit option may be available if you have a confirmed onward ticket to a different country or region and use an eligible port."}</p><p>The permitted stay area depends on your entry port. Enter your exact route in the checker before relying on this option.</p></div>}{yunnanGuide && <div className="tool-country-points tool-country-guide"><h3>Planning a Yunnan trip?</h3><p>{yunnanGuide.copy}</p><Link href={yunnanGuide.href}>{yunnanGuide.label} →</Link></div>}<small>Last reviewed: {page.editorial.lastReviewed}. Rules can change; confirm with official sources before you fly.</small></article><aside className="tool-aside"><span>CHECK YOUR PLAN</span><h2>A country rule is only the start.</h2><p>Your purpose, duration, arrival port and onward itinerary can change your result.</p><Link href="/china-visa-checker#check-visa">Use the interactive checker →</Link><Link href="/survival-kit">Open the China Survival Kit →</Link></aside></div></section>
    <section className="tool-section tool-sand"><div className="shell tool-two-cols"><div><span className="tool-kicker">COMMON QUESTIONS</span><h2>{page.editorial.displayName} travel questions</h2></div><div className="tool-faq">{page.faqs.map((faq) => <details key={faq.id}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></div></section>
    <section className="tool-section" id="official-sources"><div className="shell tool-two-cols"><div><span className="tool-kicker">OFFICIAL SOURCES</span><h2>Check before booking.</h2><p>This guide summarizes published policies for ordinary passports and is not an entry decision.</p></div><div className="tool-link-list"><a href="https://en.nia.gov.cn/" target="_blank" rel="noopener noreferrer">National Immigration Administration ↗</a><a href="https://www.fmprc.gov.cn/mfa_eng/" target="_blank" rel="noopener noreferrer">Chinese Ministry of Foreign Affairs ↗</a><a href="https://www.visaforchina.cn/" target="_blank" rel="noopener noreferrer">Visa Application Service Center ↗</a></div></div></section><ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, url: `https://hiddenchinatravel.com/china-visa-checker/${slug}`, dateModified: page.editorial.lastReviewed }) }} />
  </main>;
}
