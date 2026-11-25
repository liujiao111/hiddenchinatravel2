import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { CustomJourneyLink } from "@/components/custom-journey-link";
import { breadcrumbList } from "@/components/json-ld";
import { LocaleLink as Link } from "@/components/locale-link";
import { ContentFooter } from "@/components/content-footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { QuickAsk } from "@/components/quick-ask";
import { GuideCard } from "@/components/guide-card";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { formatPriceLabel } from "@/lib/format-price";
import { localeUrl, type AppLocale } from "@/lib/i18n-seo";
import type { Journey } from "@/lib/journeys";
import { getPublishedYunnanCountryGuides } from "@/lib/yunnan-country-guides.server";
import { getYunnanGuideContent } from "@/lib/yunnan-guide-content";
import { getContentBySlug } from "@/lib/content";
import { EditorialSeasonGuide } from "@/components/editorial-season-guide";
import { experiences } from "@/lib/experiences";
import { RelatedExperienceProducts } from "@/components/related-experience-products";

const seasonImages = [
  { image: "/assets/destinations/yunnan/dali-erhai-cover.webp", zh: ["把日子，留给洱海与村落。", "大理 · 洱海", "洱海岸边的座椅与远处苍山"], en: ["Slow days by the lake.", "Erhai Lake · Dali", "Lakeside seating overlooking Erhai and the Cangshan mountains"] },
  { image: "/assets/blog/best-time-to-visit-yunnan/pudacuo-cloudy-lake.webp", zh: ["走进山野，也给天气留点余地。", "香格里拉 · 普达措", "云层下的普达措湖泊与绿色山林"], en: ["Green landscapes. Room to wander.", "Pudacuo · Shangri-La", "A wooden jetty beside a lake and green hills under clouds at Pudacuo"] },
  { image: "/assets/blog/best-time-to-visit-yunnan/cover-pudacuo-autumn.webp", zh: ["天高云淡，去看远处的山。", "香格里拉 · 普达措", "普达措湖面映着蓝天与山林，岸边可见冰雪"], en: ["Clearer skies, further horizons.", "Pudacuo · Shangri-La", "Blue sky and forest reflected in a Pudacuo lake, with ice and snow along the shore"] },
  { image: "/assets/destinations/yunnan/snow-mountain-8-day.webp", zh: ["向阳慢行，抬头是雪山。", "云南 · 高山风景", "蓝天下连绵的雪山与山谷"], en: ["Winter light and mountain air.", "Yunnan · Mountain landscapes", "Snow-covered peaks and a mountain valley beneath a blue sky"] },
];

const countryNames: Record<string, string> = {
  "the UK": "英国",
  "the USA": "美国",
  Singapore: "新加坡",
  Malaysia: "马来西亚",
  Australia: "澳大利亚",
};

export function YunnanGuidePage({ journey }: { journey: Journey }) {
  const locale = useLocale() as AppLocale;
  const tMobile = useTranslations("mobileCta");
  const { facts, routeStops, placeCards, guides, seasons, practical, faqs, copy, whatsapp } = getYunnanGuideContent(locale);
  const countryGuides = getPublishedYunnanCountryGuides();
  const { frontmatter } = journey;
  const journeyHref = `/journeys/${journey.slug}`;
  const path = "/china-destinations/yunnan";
  const price = locale === "zh"
    ? `${frontmatter.priceBasis} ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} 起`
    : `${copy.priceFrom} ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        name: locale === "zh" ? "云南" : "Yunnan",
        description: copy.jsonDescription,
        url: localeUrl(locale, path),
        image: "https://hiddenchinatravel.com/home/hero.webp",
        touristType: copy.touristTypes,
        inLanguage: locale === "zh" ? "zh-Hans" : "en",
      },
      breadcrumbList([
        { name: copy.home, href: localeUrl(locale, "/") },
        { name: copy.current, href: localeUrl(locale, path) },
      ]),
    ],
  };
  const anchors = ["plan", "places", "route", "from-abroad", "guides", "season", "prepare", "faq"];

  return <main>
    <SiteHeader />
    <nav className="breadcrumbs yunnan-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">{copy.home}</Link><span>›</span><span>{copy.current}</span></nav>

    <header className="yunnan-hero">
      <Image src="/home/hero.webp" alt={copy.heroAlt} fill priority unoptimized sizes="100vw" />
      <div className="yunnan-hero-shade" />
      <div className="shell yunnan-hero-copy"><p>{copy.heroKicker}</p><h1>{copy.heroTitle}</h1><span>{copy.heroLead}</span><div><Link className="button yunnan-primary-action" href={journeyHref}>{copy.heroJourney}</Link><Link className="yunnan-text-action" href="#plan">{copy.heroGuide} <b>↓</b></Link></div></div>
    </header>

    <section className="yunnan-facts"><div className="shell">{facts.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></section>

    <nav className="yunnan-anchor-nav" aria-label="On this page"><div className="shell">{copy.nav.map((label, index) => <Link href={`#${anchors[index]}`} key={anchors[index]}>{label}</Link>)}</div></nav>

    <section className="yunnan-intro" id="plan"><div className="narrow"><span>{copy.introKicker}</span><h2>{copy.introTitle}</h2><p><Link href="/kunming-travel-guide">{locale === "zh" ? "昆明" : "Kunming"}</Link>{copy.introMiddle}<Link href="/lijiang-travel-guide">{locale === "zh" ? "丽江" : "Lijiang"}</Link>{copy.introEnd}</p><p>{copy.introSecond}<Link href="/shangri-la-travel-guide">{locale === "zh" ? "香格里拉" : "Shangri-La"}</Link>{copy.introSecondEnd}</p></div></section>

    <section className="yunnan-places section section-sand" id="places"><div className="shell"><div className="yunnan-section-heading"><span>{copy.placesKicker}</span><h2>{copy.placesTitle}</h2><p>{copy.placesIntro}</p></div><div className="yunnan-route-stops">{routeStops.map(([number, name, stay, text]) => <article key={number}><span>{number}</span><div><small>{stay}</small><h3>{name}</h3><p>{text}</p></div></article>)}</div><div className="yunnan-place-grid">{placeCards.map((place) => <Link href={place.href} key={place.name}><Image src={place.image} alt={place.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /><i aria-hidden="true" /><div><p>{place.note}</p><h3>{place.name}</h3><span>{copy.explore}</span></div></Link>)}</div></div></section>

    <RelatedExperienceProducts products={experiences} lang={locale} location="yunnan_hub_experience" id="local-experiences" />

    <section className="yunnan-featured section" id="route"><div className="shell yunnan-featured-layout"><div><span>{copy.routeKicker}</span><h2>{copy.routeTitle}</h2><p>{copy.routeP1}</p><p>{copy.routeP2}</p><Link href={journeyHref}>{copy.routeLink}</Link><CustomJourneyLink prompt={copy.customPrompt} location="yunnan_hub_route" /></div><JourneyCard journey={{title:copy.journeyTitle,subtitle:copy.journeySubtitle,href:journeyHref,image:frontmatter.coverImage,imageAlt:frontmatter.coverAlt || frontmatter.title,duration:frontmatter.duration,fromPrice:price,features:copy.journeyFeatures}} /></div></section>

    <section className="yunnan-from-abroad section" id="from-abroad">
      <div className="shell">
        <div className="yunnan-section-heading"><span>{copy.abroadKicker}</span><h2>{copy.abroadTitle}</h2><p>{copy.abroadIntro}</p></div>
        <div className="yunnan-country-grid">
          {countryGuides.map((guide) => {
            const translated = getContentBySlug(guide.slug, locale);
            const country = locale === "zh" ? countryNames[guide.country] ?? guide.country : guide.country;
            return <Link href={`/${guide.slug}`} key={guide.countryCode}>
              <span>{locale === "zh" ? `从${country}出发` : `FROM ${guide.country.toUpperCase()}`}</span>
              <h3>{translated?.frontmatter.title ?? (locale === "zh" ? `从${country}出发游云南` : `Yunnan from ${guide.country}`)}</h3>
              <p>{translated?.frontmatter.excerpt || translated?.frontmatter.metaDescription || (locale === "zh" ? `从${country}出发，了解入境选择、航班衔接，以及怎样按你的假期安排云南路线。` : guide.description)}</p>
              <b>{locale === "zh" ? `阅读${country}出发指南 →` : `READ THE ${guide.country.replace(/^the /, "").toUpperCase()} GUIDE →`}</b>
            </Link>;
          })}
        </div>
      </div>
    </section>

    <section className="yunnan-guides section section-sand" id="guides"><div className="shell"><div className="yunnan-section-heading"><span>{copy.guidesKicker}</span><h2>{copy.guidesTitle}</h2><p>{copy.guidesIntro}</p></div><div className="yunnan-guide-grid">{guides.map((guide) => <GuideCard key={guide.href} guide={guide} />)}</div></div></section>

    <section className="yunnan-season section" id="season">
      <div className="shell">
        <div className="editorial-season-heading">
          <p className="kicker">{copy.seasonKicker}</p>
          <h2>{locale === "zh" ? "云南，四季各有风景。" : "Yunnan, through the seasons."}</h2>
          <p>{copy.seasonIntro}</p>
        </div>
        <EditorialSeasonGuide
          label={locale === "zh" ? "选择旅行季节" : "Choose a travel season"}
          linkLabel={locale === "zh" ? "查看完整季节指南" : "Explore the seasonal guide"}
          seasons={seasons.map(([dates, name, description], index) => {
            const visual = seasonImages[index];
            const [headline, caption, alt] = locale === "zh" ? visual.zh : visual.en;
            return { dates, name, description, headline, caption, alt, image: visual.image };
          })}
        />
      </div>
    </section>

    <section className="yunnan-prepare section" id="prepare"><div className="shell"><div className="yunnan-section-heading light"><span>{copy.prepareKicker}</span><h2>{copy.prepareTitle}</h2><p>{copy.prepareIntro}</p></div><div className="yunnan-practical-grid">{practical.map(([title, text, href], index) => <Link href={href} key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><b>{copy.readGuide}</b></Link>)}</div><div className="center"><Link href="/china-travel-essentials" className="button button-light">{copy.survivalKit}</Link></div></div></section>

    <section className="yunnan-faq section" id="faq"><div className="narrow"><div className="yunnan-section-heading"><span>{copy.faqKicker}</span><h2>{copy.faqTitle}</h2></div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <QuickAsk source={path} sourceTitle={copy.sourceTitle} intent="trip" />
    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
    />
    <section className="yunnan-final-cta"><div><span>{copy.finalKicker}</span><h2>{copy.finalTitle}</h2><p>{copy.finalText}</p><div><Link href="/private-yunnan-tours#plan" data-cta-location="yunnan_hub_final" className="button button-light">{copy.finalCta}</Link><Link href={whatsapp}>{copy.whatsappCta}</Link><Link href={journeyHref}>{copy.viewJourney}</Link></div></div></section>

    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
