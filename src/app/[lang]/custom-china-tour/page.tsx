import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { BookingTerms } from "@/components/booking-terms";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { MuslimFriendly } from "@/components/muslim-friendly";
import { Testimonials } from "@/components/testimonials";
import { ContentFooter } from "@/components/content-footer";
import { JourneyInspirationProvider } from "@/components/journey-inspiration-context";
import { YunnanInspiration } from "@/components/yunnan-inspiration";
import { CustomJourneyForm } from "@/components/custom-journey-form";
import { JourneyCard } from "@/components/journey-card";
import { JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { SiteHeader } from "@/components/site-header";
import { getBookingFaq, getBookingSteps, getBrandIdentity, getOperatorFaq } from "@/lib/booking-terms-i18n";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys } from "@/lib/journeys";
import { getSelectedTestimonials } from "@/lib/testimonials";

const canonical = "https://hiddenchinatravel.com/custom-china-tour";

export async function generateMetadata({ params }: { params: Promise<{ lang: AppLocale }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "customTour" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return localizedStaticMetadata(lang, "/custom-china-tour", {
    title,
    description,
    openGraph: { title, description, url: canonical, images: [{ url: "https://hiddenchinatravel.com/home/hero.webp", alt: t("ogImageAlt") }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: ["https://hiddenchinatravel.com/home/hero.webp"] },
  });
}

export default async function CustomChinaTourPage({ params }: { params: Promise<{ lang: AppLocale }> }) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "customTour" });
  const tj = await getTranslations({ locale: lang, namespace: "journey" });
  const tq = await getTranslations({ locale: lang, namespace: "quickAsk" });
  const journeys = getAllJourneys(lang);
  const stories = getSelectedTestimonials();
  const brand = getBrandIdentity(lang);
  const whatsapp = "https://wa.me/8618880441791?text=" + encodeURIComponent(t("whatsappMessage"));
  const ideas = t.raw("ideas") as { title: string; route: string; text: string }[];
  const overviewItems = t.raw("overviewItems") as { label: string; value: string }[];
  const proposalCards = t.raw("proposalCards") as { title: string; text: string }[];
  const faqs: { question: string; answer: string }[] = [
    ...(t.raw("faqs") as [string, string][]).map(([question, answer]) => ({ question, answer })),
    getOperatorFaq(lang),
    getBookingFaq(lang),
    { question: t.raw("faqFinal")[0], answer: t.raw("faqFinal")[1] },
  ];
  const description = t("metaDescription");
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: t("serviceName"), url: canonical, description, areaServed: { "@type": "Place", name: "Yunnan, China" }, provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" } },
    { "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
  return <JourneyInspirationProvider><main className="custom-journey-page">
    <SiteHeader />
    <JourneyHero title={t("heroTitle")} image="/home/hero.webp" imageAlt={t("ogImageAlt")} eyebrow={t("heroEyebrow")} description={t("heroDescription")} primary={{ href: "#plan", label: tj("startPlanning") }} secondary={{ href: "#possibilities", label: t("heroSecondary") }} note={t("heroNote", { replyTime: tq("replyTime") })} />
    <JourneySectionNav links={[{ href: "#possibilities", label: t("navPossibilities") }, { href: "#muslim-friendly", label: t("navMuslim") }, { href: "#places", label: t("navPlaces") }, { href: "#process", label: t("navProcess") }, ...(stories.length > 0 ? [{ href: "#stories", label: t("navStories") }] : []), { href: "#local-team", label: t("navTeam") }, { href: "#quote", label: t("navQuote") }, { href: "#booking-terms", label: t("navTerms") }, { href: "#questions", label: t("navQuestions") }]} action={{ href: "#plan", label: t("navAction") }} />
    <JourneyOverview title={t("overviewTitle")} description={t("overviewDescription")} items={overviewItems} action={{ href: "#plan", label: t("overviewAction") }} />
    <MuslimFriendly />
    <section className="journey-manifesto" id="possibilities"><div className="shell journey-manifesto-grid"><div className="journey-manifesto-copy"><h2><span>{t("manifestoLeadA")}</span> <em>{t("manifestoLeadB")}</em></h2><i aria-hidden="true" /><p>{t("manifestoText")}</p><strong>{t("manifestoStrong")}</strong></div></div></section>
    <section className="section section-sand custom-travel-preferences"><div className="narrow journey-editorial-heading"><h2>{t("preferencesHeading")}</h2><p>{t("preferencesText")}</p></div></section>
    <YunnanInspiration selectable />
    <section className="journey-itinerary section" id="ideas"><div className="shell journey-section-layout"><header><h2>{t("ideasHeading")}</h2><span>{t("ideasIntro")}</span></header><div className="journey-days">{ideas.map((idea, index) => <details key={idea.title} open={index === 0}><summary><span>0{index + 1}</span><div><h3>{idea.title}</h3><p>{idea.route}</p></div><b aria-hidden="true">+</b></summary><p>{idea.text}</p></details>)}</div></div></section>
    <section className="journey-mid-cta"><div className="shell"><div><h2>{t("midHeading")}</h2><p>{t("midText")}</p></div><div><Link href="#plan" className="button button-light">{tj("startPlanning")}</Link><span>{t("midNote")}</span></div></div></section>
    <section className="journey-support section journey-support-flow custom-planning-flow" id="process"><div className="shell journey-section-layout"><header><h2>{t("processHeading")}</h2><span>{brand.short} {brand.consultant}</span></header><div className="journey-support-grid">{getBookingSteps(lang).map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    {stories.length > 0 ? <Testimonials items={stories} eyebrow={tj("testimonialsEyebrow")} heading={tj("testimonialsHeading")} intro={tj("testimonialsIntroGeneric")} note={tj("testimonialsNote")} /> : null}
    <JourneyTrustSection variant="compact" />
    <section className="journey-host"><div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt={t("hostAlt")} fill unoptimized sizes="(max-width:800px) 100vw, 48vw" /></div><div className="journey-host-copy"><span>{t("hostKicker")}</span><h2>{t("hostTitle")}</h2><blockquote>“{t("hostQuote")}”</blockquote><p>{t("hostCopy", { consultant: brand.consultant })}</p><Link href="/about-us">{t("hostLink")}</Link></div></section>
    <section className="journey-pricing section section-sand" id="quote"><div className="shell"><div className="journey-editorial-heading"><h2>{t("quoteHeading")}</h2><p>{t("quoteText")}</p></div><div className="custom-proposal-grid">{proposalCards.map((card) => <article key={card.title}><h3>{card.title}</h3><p>{card.text}</p></article>)}</div></div></section>
    <BookingTerms heading={t("termsHeading")} intro={t("termsIntro")} />
    <section className="section custom-planner-section" id="plan"><div className="shell contact-form-layout"><header><h2>{t("plannerHeading")}</h2><p>{t("plannerText", { replyTime: tq("replyTime") })}</p><p>{t("plannerSample")}</p><p>{t("plannerBeyond")}</p><div className="custom-planner-contact"><p>{t("plannerPrefer")}</p><Link href={whatsapp} data-cta-location="custom_journey_form_backup">{t("plannerWhatsapp")}</Link><a href="mailto:joy.liu@hiddenchinatravel.com">joy.liu@hiddenchinatravel.com</a></div></header><CustomJourneyForm /></div></section>
    <section className="journeys-list section section-sand"><div className="shell"><div className="journey-editorial-heading"><h2>{t("readyHeading")}</h2><p>{t("readyText")}</p></div><div className="journeys-card-grid custom-ready-journeys">{journeys.map(journey => <JourneyCard key={journey.slug} journey={{ title: journey.frontmatter.shortTitle, subtitle: journey.frontmatter.excerpt, href: `/journeys/${journey.slug}`, image: journey.frontmatter.coverImage, duration: journey.frontmatter.duration, fromPrice: journey.frontmatter.fromPrice > 0 ? t("readyPrice", { price: formatPriceLabel(journey.frontmatter.fromPrice, journey.frontmatter.currency), basis: journey.frontmatter.priceBasis }) : t("readyTailored"), ctaLabel: t("readyCta"), trackingLocation: "custom_journey_ready_route" }} />)}</div></div></section>
    <section className="journey-faq section" id="questions"><div className="narrow"><div className="section-heading"><h2>{t("faqHeading")}</h2></div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <section className="journey-final-cta"><div><h2>{tj("closeHeading")}</h2><span>{tj("closeText")}</span><Link href="#plan" className="button button-light">{tj("startPlanning")}</Link></div></section>
    <Link href="#plan" className="journey-mobile-cta">{tj("startPlanning")} <span>→</span></Link>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main></JourneyInspirationProvider>;
}
