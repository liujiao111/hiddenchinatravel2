import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Journey } from "@/lib/journeys";
import type { LocaleAlternate } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { PlanJourneyClose } from "@/components/plan-journey-close";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { SiteHeader } from "@/components/site-header";
import { JourneyQuoteBand } from "@/components/journey-quote-band";
import { formatPriceLabel } from "@/lib/format-price";
import { JourneyFactCards, JourneyHero, JourneyOverview, JourneySectionNav } from "@/components/journey-landing";
import { JourneyTrustSection } from "@/components/journey-trust-section";
import { JourneyPractical } from "@/components/journey-practical";
import { JourneyWhy } from "@/components/journey-why";
import { Testimonials } from "@/components/testimonials";
import { licensedOperator } from "@/lib/journey-trust";
import { getTestimonialsForJourney } from "@/lib/testimonials";
import { YunnanTravelNotes } from "@/components/yunnan-travel-notes";
import { breadcrumbList } from "@/components/json-ld";

const guestProofImages = ["/assets/customers/客户2.1.webp", "/assets/customers/客户2.3.webp"] as const;

const eightDayPhotoFallback: Record<string, string> = {
  "Day 1": "/assets/blog/kunming-travel-guide/kunming-city.webp",
  "Day 7": "/assets/blog/kunming-travel-guide/kunming-city.webp",
  "Day 8": "/assets/blog/kunming-travel-guide/cover-stone-forest.webp",
};

export function JourneyPageV2({ journey, alternate }: { journey: Journey; alternate?: LocaleAlternate }) {
  const { frontmatter } = journey;
  const t = useTranslations("journey");
  const tMobile = useTranslations("mobileCta");
  const lang = useLocale() as "en" | "zh";
  const stories = getTestimonialsForJourney(journey.slug, lang);
  const whatsapp = buildWhatsAppUrl();
  const completePrice = frontmatter.fromPrice > 0
    ? t("completePrice", { price: formatPriceLabel(frontmatter.fromPrice, frontmatter.currency), duration: frontmatter.duration.split("/")[0].trim().toLowerCase() })
    : t("tailoredQuote");
  const guidePrice = frontmatter.fromPrice > 0 ? t("guidePrice", { price: formatPriceLabel(frontmatter.fromPrice, frontmatter.currency), basis: frontmatter.priceBasis }) : t("tailoredQuote");
  const overviewItems = frontmatter.overviewItems ?? [
    { label: frontmatter.duration.toUpperCase(), value: frontmatter.route },
    { label: t("overviewJourneyLabel"), value: t("overviewJourneyValue", { type: frontmatter.journeyType }) },
    { label: t("overviewGuidePriceLabel"), value: guidePrice },
  ];
  const heroIncludes = frontmatter.heroIncludes ?? (t.raw("defaultIncludes") as string[]);
  const guestProofSlides = t.raw("guestProofSlides") as { alt: string; caption: string }[];
  const dayPhotoAlts = t.raw("dayPhotos") as Record<string, string>;
  const factAgencyLines = (t.raw("factAgencyLines") as string[]).map((line) => line
    .replace("{agency}", lang === "zh" ? licensedOperator.nameZh : licensedOperator.nameEn.replace(" Co., Ltd.", ""))
    .replace("{permit}", licensedOperator.permitNumber));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: frontmatter.heroTitle || frontmatter.title,
        description: frontmatter.metaDescription,
        image: [
          `https://hiddenchinatravel.com${frontmatter.ogImage?.url || frontmatter.coverImage}`,
        ],
        touristType: frontmatter.travelStyles,
        itinerary: frontmatter.route,
        provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" },
        ...(frontmatter.fromPrice > 0 ? {
          offers: {
            "@type": "Offer",
            priceCurrency: frontmatter.currency,
            price: frontmatter.fromPrice,
            url: `https://hiddenchinatravel.com/journeys/${journey.slug}`,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: frontmatter.fromPrice,
              priceCurrency: frontmatter.currency,
              description: `From ${formatPriceLabel(frontmatter.fromPrice, frontmatter.currency)} ${frontmatter.priceBasis} for the complete journey`,
            },
          },
        } : {}),
        ...(frontmatter.itinerary.length ? {
          hasPart: frontmatter.itinerary.map((day) => ({
            "@type": "TouristTrip",
            name: `${day.days}: ${day.title}`,
            description: day.description,
          })),
        } : {}),
      },
      breadcrumbList([
        { name: t("breadcrumbHome"), href: "/" },
        { name: t("breadcrumbJourneys"), href: "/private-yunnan-tours#routes" },
        { name: frontmatter.title, href: `/journeys/${journey.slug}` },
      ]),
    ],
  };

  // Exactly the same structure as the 6-day journey in journey-page.tsx
  // when isSixDayYunnanJourney is true. No custom components invented.
  return <main className="journey-page journey-page-offer">
    <SiteHeader conversion alternate={alternate} cta={{ href: whatsapp, mailHref: "#ask-joy", label: t("startPlanning"), location: "header_journey_price" }} />

    <JourneyHero
      title={frontmatter.heroTitle || frontmatter.title}
      name={frontmatter.heroTitle ? frontmatter.title : undefined}
      image={frontmatter.coverImage}
      imageAlt={frontmatter.coverAlt || "Mountains and countryside along a Yunnan journey"}
      eyebrow={frontmatter.heroEyebrow || t("heroEyebrowDefault")}
      description={frontmatter.heroDescription || frontmatter.excerpt}
      price={frontmatter.fromPrice > 0 ? completePrice : undefined}
      includes={heroIncludes}
      bounds={frontmatter.heroBounds}
      primary={{ href: whatsapp, label: frontmatter.heroPrimaryLabel || t("startPlanning") }}
      secondary={{ href: "#itinerary", label: frontmatter.heroSecondaryLabel || t("seeDays") }}
      chat={{ href: "#ask-joy", label: t("chatEmail") }}
      note={frontmatter.heroNote || t("heroNoteDefault")}
    />

    {/* Overview — same as 6-day: right after hero */}
    <JourneyOverview
      title={frontmatter.overviewTitle || t("overviewTitleDefault")}
      description={frontmatter.overviewDescription || t("overviewDescriptionDefault")}
      items={overviewItems}
      action={{ href: whatsapp, label: t("startPlanning") }}
    />

    {/* Section nav — same as 6-day, but uses frontmatter.itineraryKicker for the label */}
    <JourneySectionNav
      links={[
        { href: "#glance", label: t("navGlance") },
        { href: "#why-travel", label: t("navWhy") },
        { href: "#itinerary", label: frontmatter.itineraryKicker || t("navItinerarySix") },
        { href: "#experiences", label: t("testimonialsHeading") },
        { href: "#private-journey", label: t("navDetails") },
        { href: "#questions", label: t("goodToKnow") },
      ]}
      action={{ href: "#ask-joy", label: t("navAction") }}
    />

    {/* Quote fold with guest proof — identical to 6-day */}
    <section className="journey-fold-ask" id="quote">
      <div className="shell">
        <div className="journey-guest-proof">
          <p>{t("guestProofKicker")}</p>
          <div className="journey-guest-proof-row">
            {guestProofImages.map((src, index) => <figure key={src}>
              <Image src={encodeURI(src)} alt={guestProofSlides[index].alt} fill sizes="(max-width:700px) 46vw, 420px" unoptimized />
              <figcaption>{guestProofSlides[index].caption}</figcaption>
            </figure>)}
          </div>
          <p className="journey-guest-caption">{t("guestProofCaption")}</p>
        </div>
      </div>
    </section>

    <JourneyFactCards id="why-travel" title={t("whyTitle")} cards={[
      { icon: "party", title: t("factPartyTitle"), lines: t.raw("factPartyLines") as string[] },
      { icon: "person", title: t("factJoyTitle"), lines: t.raw("factJoyLines") as string[] },
      { icon: "licence", title: t("factAgencyTitle"), lines: factAgencyLines },
      { icon: "star", title: t("factGuestTitle"), lines: t.raw(stories.length ? "factGuestWithStories" : "factGuestNoStories") as string[] },
    ]} />

    <JourneyWhy />

    {/* No mid-page JourneyOverview here — 6-day puts it at top only */}

    {frontmatter.whoFor || frontmatter.whenToGo ? <section className="journey-fit-season"><div className="shell">{frontmatter.whoFor ? <article><span>{t("whoForLabel")}</span><p>{frontmatter.whoFor}</p></article> : null}{frontmatter.whenToGo ? <article><span>{t("whenToGoLabel")}</span><p>{frontmatter.whenToGo}</p></article> : null}</div></section> : null}

    {frontmatter.experiences.length ? <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="section-heading"><h2>{t("experiencesHeading")}</h2><p>{t("experiencesIntroDefault")}</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={experience.image} alt={experience.imageAlt || experience.title} fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><span>0{index + 1}</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section> : null}

    {/* Itinerary — same structure as 6-day, but no 6-day-specific pair photos */}
    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>{frontmatter.itineraryKicker || t("itineraryKickerDefault")}</p><h2>{frontmatter.itineraryHeading || t("itineraryHeadingDefault")}</h2><span>{frontmatter.itineraryIntro || t("itineraryIntroDefault")}</span></header><div className="journey-days">{frontmatter.itinerary.map((day) => {
      const dayPhoto = day.image ? [day.image, day.imageAlt || day.title] as const : eightDayPhotoFallback[day.days] ? [eightDayPhotoFallback[day.days], dayPhotoAlts[day.days] || day.title] as const : undefined;
      const dayCopy = day.description.split(/\n\n+/);
      return <details key={day.days}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary>{dayCopy.map((paragraph, paragraphIndex) => <p key={`${day.days}-${paragraphIndex}`}>{paragraph}</p>)}{day.meals ? <p className="journey-day-meals"><strong>{/Overnight|Pace:|住宿|节奏/.test(day.meals) ? t("theDayLabel") : t("mealsLabel")}</strong> {day.meals}</p> : null}{dayPhoto ? <figure className="journey-day-photo"><Image src={encodeURI(dayPhoto[0])} alt={dayPhoto[1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>{dayPhoto[1]}</figcaption></figure> : null}</details>;
    })}</div></div></section>

    {stories.length > 0 ? <Testimonials items={stories} eyebrow={t("testimonialsEyebrow")} heading={t("testimonialsHeading")} intro={t("testimonialsIntro")} note={t("testimonialsNote")} /> : null}

    {/* Pricing — same as 6-day: tiers empty → JourneyQuoteBand (not compact, with form) */}
    <section className="journey-price-module" id="pricing">
      <JourneyQuoteBand id="ask-joy" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} />

      <section className="journey-inclusions section journey-inclusions-compact" id="details">
        <div className="shell journey-inclusion-grid">
          <div>
            <span className="journey-detail-label">{t("includedLabel")}</span>
            <h2>{t("includedHeading")}</h2>
            <ul>
              {frontmatter.inclusions.map((item) => <li key={item}><span className="inclusion-mark" aria-hidden="true">✓</span><p>{item}</p></li>)}
            </ul>
          </div>
          <div>
            <span className="journey-detail-label">{t("notIncludedLabel")}</span>
            <h2>{t("notIncludedHeading")}</h2>
            <ul>
              {frontmatter.exclusions.map((item) => <li key={item}><span className="inclusion-mark inclusion-mark-out" aria-hidden="true">–</span><p>{item}</p></li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust section — same props as 6-day: uses SixDay i18n keys */}
      <JourneyTrustSection
        showCredentials={false}
        showMuslimFriendly={false}
        kicker=""
        heading={t("trustHeadingSixDay")}
        description={t("trustDescriptionSixDay")}
        guideTitle={t("trustGuideTitleSixDay")}
        guideCopy={t("trustGuideCopySixDay")}
        vehicleTitle={t("trustVehicleTitleSixDay")}
        vehicleCopy={t("trustVehicleCopySixDay")}
        hotelTitle={t("trustHotelTitleSixDay")}
        hotelCopy={t("trustHotelCopySixDay")}
        hotelCities={["kunming", "dali", "lijiang", "shangri-la"]}
      />
    </section>

    <JourneyPractical
      title={frontmatter.goodToKnow?.length ? t("goodToKnow") : undefined}
      groups={frontmatter.goodToKnow?.map((group, index) => ({
        id: group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `group-${index}`,
        label: group.label,
        items: group.items.map((item) => ({ title: item.question, detail: item.answer })),
      }))}
      notes={frontmatter.goodToKnow?.length ? undefined : frontmatter.bookingNotes?.map((note) => ({ title: note.title, detail: note.detail }))}
      faqs={frontmatter.goodToKnow?.length ? undefined : frontmatter.faqs.map((faq) => ({ title: faq.question, detail: faq.answer }))}
    />
    {frontmatter.bookingNotes?.length ? null : <YunnanTravelNotes />}

    {/* Final CTA — same as 6-day: PlanJourneyClose */}
    <PlanJourneyClose id="ask-joy-final" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} routeHref="/private-yunnan-tours" showForm={false} />

    <MobileCtaBar
      whatsappHref={whatsapp}
      formHref="#ask-joy-final"
      whatsappLabel={tMobile("whatsappLabel")}
      formLabel={tMobile("formLabel")}
      statusLabel={tMobile("statusLabel")}
    />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
