import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleLink as Link } from "@/components/locale-link";
import { localizedStaticMetadata, type AppLocale } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { EnquireLink } from "@/components/enquire-link";
import { JourneyCard } from "@/components/journey-card";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { licensedOperator } from "@/lib/journey-trust";
import { formatPriceLabel } from "@/lib/format-price";
import { getAllJourneys } from "@/lib/journeys";
import { organizationJsonLd } from "@/lib/seo";
import { getSelectedTestimonials } from "@/lib/testimonials";

const canonical = "https://hiddenchinatravel.com/";

type Props = { params: Promise<{ lang: AppLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "home" });
  return localizedStaticMetadata(lang, "/", {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.description"),
      url: canonical,
      type: "website",
      siteName: "Hidden China Travel",
      images: [{ url: "/home/hero.webp", alt: t("heroAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      description: t("meta.description"),
      images: ["/home/hero.webp"],
    },
  });
}

const whatsapp = "https://wa.me/8618880441791?text=" + encodeURIComponent("Hi Joy, I'd like help planning a private Yunnan journey.");

type Step = [string, string, string];
type SupportItem = { title: string; detail: string; href: string };
type Destination = { name: string; note: string; image: string; alt: string; href: string; cta: string };
type Faq = [string, string];

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "home" });

  const agencyName = lang === "zh" ? licensedOperator.nameZh : licensedOperator.nameEn;
  const fill = (s: string) =>
    s.replaceAll("{agencyEn}", licensedOperator.nameEn)
      .replaceAll("{agencyZh}", licensedOperator.nameZh)
      .replaceAll("{agency}", agencyName);

  const journeys = getAllJourneys();
  const firstEncounter = journeys.find((journey) => journey.slug === "kunming-dali-shaxi-lijiang-6-days");
  const classic = journeys.find((journey) => journey.slug === "kunming-dali-lijiang-shangri-la-private-tour");

  const howItWorks = (t.raw("howItWorks") as Step[]).map(([n, title, text]) => [n, title, fill(text)] as Step);
  const reasons = (t.raw("reasons") as Step[]).map(([n, title, text]) => [n, title, fill(text)] as Step);
  const supportItems = t.raw("supportItems") as SupportItem[];
  const destinations = t.raw("destinations") as Destination[];
  const faqs = (t.raw("faqs") as Faq[]).map(([q, a]) => [q, fill(a)] as Faq);

  const fromPrice = (price: number, currency: string, basis: string) =>
    t("fromPrice", { price: formatPriceLabel(price, currency), basis });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd,
      {
        "@type": "WebSite",
        name: "Hidden China Travel",
        url: "https://hiddenchinatravel.com",
        inLanguage: lang === "zh" ? "zh-Hans" : "en",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return <main><SiteHeader />
    <section className="hero">
      <Image src="/home/hero.webp" alt={t("heroAlt")} fill preload unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="hero-kicker">{t("heroKicker")}</p>
        <h1>{t("heroTitleLine1")}<br />{t("heroTitleLine2")}</h1>
        <p className="hero-lead hero-desktop-only">{t("heroLeadDesktop")}</p>
        <p className="hero-lead hero-mobile-only">{t("heroLeadMobile")}</p>
        <p className="hero-brand hero-desktop-only">{t("heroBrand")}</p>
        <div className="hero-actions">
          <EnquireLink data-cta-location="home_hero_custom" className="button button-blue">{t("cta")}</EnquireLink>
          <Link href="/journeys" className="button button-light hero-desktop-only">{t("exploreJourneys")}</Link>
        </div>
        <p className="hero-trust-line hero-desktop-only">{t("heroTrustDesktop")}</p>
        <p className="hero-trust-line hero-mobile-only">{t("heroTrustMobile")}</p>
        <small>{t("replyTime")}</small>
        <Link href="/journeys" className="hero-text-link hero-mobile-only">{t("exploreJourneysMobile")}</Link>
      </div>
    </section>

    <section className="section process" id="how-it-works">
      <div className="narrow">
        <p className="kicker">{t("howKicker")}</p>
        <h2>{t("howHeading")}</h2>
        <p>{t("howIntro")}</p>
      </div>
      <div className="shell">
        <div className="process-grid">{howItWorks.map(([number, title, text]) => <div key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></div>)}</div>
        <div className="center">
          <EnquireLink data-cta-location="home_how_it_works" className="button button-blue">{t("cta")}</EnquireLink>
          <p className="home-helper">{t("howHelper")}</p>
        </div>
      </div>
    </section>

    <section className="section section-sand home-journeys" id="journeys">
      <div className="shell">
        <div className="section-heading">
          <p className="kicker">{t("journeysKicker")}</p>
          <h2>{t("journeysHeading")}</h2>
          <p>{t("journeysIntro")}</p>
        </div>
        <div className="journeys-card-grid home-journeys-grid">
          {firstEncounter ? <JourneyCard priority journey={{
            title: t("card1Title"),
            subtitle: t("card1Subtitle"),
            href: `/journeys/${firstEncounter.slug}`,
            image: firstEncounter.frontmatter.coverImage,
            imageAlt: t("card1ImageAlt"),
            duration: t("card1Duration"),
            fromPrice: fromPrice(firstEncounter.frontmatter.fromPrice, firstEncounter.frontmatter.currency, firstEncounter.frontmatter.priceBasis),
            features: t.raw("card1Features") as string[],
            ctaLabel: t("cardCta"),
            trackingLocation: "home_featured_first_encounter",
          }} /> : null}
          {classic ? <JourneyCard journey={{
            title: t("card2Title"),
            subtitle: t("card2Subtitle"),
            href: `/journeys/${classic.slug}`,
            image: classic.frontmatter.coverImage,
            imageAlt: t("card2ImageAlt"),
            duration: t("card2Duration"),
            fromPrice: fromPrice(classic.frontmatter.fromPrice, classic.frontmatter.currency, classic.frontmatter.priceBasis),
            features: t.raw("card2Features") as string[],
            ctaLabel: t("cardCta"),
            trackingLocation: "home_featured_classic",
          }} /> : null}
          <JourneyCard journey={{
            title: t("card3Title"),
            subtitle: t("card3Subtitle"),
            href: "/custom-china-tour",
            image: "/home/local-support.webp",
            imageAlt: t("card3ImageAlt"),
            destination: t("card3Destination"),
            features: t.raw("card3Features") as string[],
            ctaLabel: t("card3Cta"),
            trackingLocation: "home_featured_custom",
          }} />
        </div>
        <p className="home-helper">{t("journeysHelper")}</p>
      </div>
    </section>

    <section className="section why" id="why-us">
      <div className="shell">
        <div className="section-heading light">
          <p className="kicker">{t("whyKicker")}</p>
          <h2>{t("whyHeading")}</h2>
          <p>{t("whyIntro")}</p>
        </div>
        <div className="reason-grid reason-grid-six">{reasons.map(([number, title, text]) => <article key={title}><i>{number}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <Testimonials
      items={getSelectedTestimonials(lang)}
      eyebrow={t("storiesEyebrow")}
      heading={t("storiesHeading")}
      intro={t("storiesIntro")}
      note={t("storiesNote")}
      archiveHref="/traveler-stories"
      archiveLabel={t("storiesArchive")}
    />

    <section className="about-feature reverse home-founder" id="joy">
      <div className="about-feature-image">
        <Image src="/brand/founder/portrait.webp" alt={t("founderAlt")} fill sizes="(max-width: 800px) 100vw, 50vw" />
      </div>
      <div className="about-feature-copy">
        <p className="kicker">{t("founderKicker")}</p>
        <h2>{t("founderHeading")}</h2>
        <p>{t("founderP1")}</p>
        <p>{t("founderP2")}</p>
        <p>{t("founderP3")}</p>
        <p>{t("founderP4")}</p>
        <p>{t("founderP5")}</p>
        <p className="home-signature"><b>Joy Liu</b><span>{t("founderRole")}</span></p>
        <Link href="/about-us">{t("founderStoryLink")}</Link>
        <Link href="/contact">{t("founderAskLink")}</Link>
      </div>
    </section>

    <section className="yunnan-prepare section" id="guides">
      <div className="shell">
        <div className="yunnan-section-heading light">
          <span>{t("prepareKicker")}</span>
          <h2>{t("prepareHeading")}</h2>
          <p>{t("prepareIntro")}</p>
        </div>
        <div className="yunnan-practical-grid">{supportItems.map((item, index) => <Link href={item.href} key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.detail}</p><b>{t("supportItemCta")}</b></Link>)}</div>
        <div className="center"><Link href="/survival-kit" className="button button-light">{t("checklistCta")}</Link></div>
      </div>
    </section>

    <section className="section destinations-section" id="destinations">
      <div className="shell">
        <div className="section-heading">
          <p className="kicker">{t("destKicker")}</p>
          <h2>{t("destHeading")}</h2>
          <p>{t("destIntro")}</p>
          <Link className="section-heading-link" href="/china-destinations/yunnan">{t("destGuideLink")}</Link>
        </div>
        <div className="destination-grid home-destination-grid">{destinations.map(({ name, note, image, alt, href, cta }) => <article className="image-card" key={name}><Image src={image} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><div className="card-shade" /><div className="image-card-copy"><p>{note}</p><h3>{name}</h3><Link href={href} className="button button-light">{cta}</Link></div></article>)}</div>
      </div>
    </section>

    <section className="journey-faq section" id="questions">
      <div className="narrow">
        <div className="section-heading">
          <p className="kicker">{t("faqKicker")}</p>
          <h2>{t("faqHeading")}</h2>
        </div>
        {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
      </div>
    </section>

    <section className="cta-band final-cta" id="plan">
      <Image src="/home/plan-journey.webp" alt={t("finalAlt")} fill unoptimized sizes="100vw" />
      <div className="hero-shade" />
      <div>
        <h2>{t("finalHeading")}</h2>
        <p>{t("finalText")}</p>
        <div className="hero-actions">
          <EnquireLink data-cta-location="home_final_custom" className="button button-blue">{t("cta")}</EnquireLink>
          <Link href={whatsapp} data-cta-location="home_final_whatsapp" className="button button-light">{t("finalWhatsapp")}</Link>
        </div>
        <p className="final-cta-trust">{t("finalTrust")}</p>
      </div>
    </section>
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
  </main>;
}
