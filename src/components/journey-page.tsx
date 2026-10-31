import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Journey } from "@/lib/journeys";
import type { LocaleAlternate } from "@/lib/i18n-seo";
import { ContentFooter } from "@/components/content-footer";
import { HashLink } from "@/components/hash-link";
import { PlanJourneyClose } from "@/components/plan-journey-close";
import { JourneyMobileCta } from "@/components/journey-mobile-cta";
import { SiteHeader } from "@/components/site-header";
import { QuickAsk } from "@/components/quick-ask";
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

const sixDayPhotoSrc: Record<string, string> = {
  "Day 1": "/assets/blog/dali-travel-guide/dali-ancient-town-rooftops.webp",
  "Day 2": "/assets/blog/dali-travel-guide/erhai-lake-cangshan.webp",
  "Day 3": "/assets/journeys/kunming-dali-shaxi-lijiang-6-days/shaxi-yujin-bridge.webp",
  "Day 4": "/assets/blog/dali-hidden-gems-off-the-beaten-path/shibaoshan-grotto-temple.webp",
  "Day 5": "/assets/destinations/yunnan/blue-moon.webp",
  "Day 6": "/assets/blog/yunnan-travel-from-uk/lijiang-old-town.webp",
};

function JourneyQuoteBand({ id, source, sourceTitle, whatsapp, showRouteLink, compact }: { id: string; source: string; sourceTitle: string; whatsapp: string; showRouteLink?: boolean; compact?: boolean }) {
  const t = useTranslations("journey");
  const planPoints = t.raw("planPoints") as string[];
  return <section className={compact ? "journey-quote-band journey-quote-band-compact" : "journey-quote-band"}>
    <div className="shell journey-plan">
      <div className="journey-plan-head">
        <div>
          <h2>{t("quoteHeading")}</h2>
          <p>{t("quotePayment")}</p>
        </div>
        <a className="button journey-plan-whatsapp" href={whatsapp} data-cta-location={`journey_plan_whatsapp_${id}`}>{t("startPlanning")}</a>
      </div>
      {compact ? null : <>
        <ul className="journey-plan-points">{planPoints.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>
        <p className="journey-plan-switch">{t("emailSwitch")}</p>
        <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      </>}
      {showRouteLink ? <div className="journey-quote-links"><Link href="/custom-china-tour" data-cta-location="journey_custom_alternative">{t("customRouteLink")}</Link></div> : null}
    </div>
  </section>;
}

export function JourneyPage({ journey, alternate }: { journey: Journey; alternate?: LocaleAlternate }) {
  const { frontmatter } = journey;
  const t = useTranslations("journey");
  const lang = useLocale() as "en" | "zh";
  const isSixDayYunnanJourney = journey.slug === "kunming-dali-shaxi-lijiang-6-days";
  const isEightDayYunnanJourney = journey.slug === "kunming-dali-lijiang-shangri-la-private-tour";
  const stories = getTestimonialsForJourney(journey.slug);
  const whatsapp = `https://wa.me/8618880441791?text=${encodeURIComponent(t("whatsappMessage", { title: frontmatter.title }))}`;
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
        image: `https://hiddenchinatravel.com${frontmatter.coverImage}`,
        touristType: frontmatter.travelStyles,
        itinerary: frontmatter.route,
        provider: { "@type": "Organization", name: "Hidden China Travel", url: "https://hiddenchinatravel.com" },
        ...(frontmatter.fromPrice > 0 ? { offers: { "@type": "Offer", priceCurrency: frontmatter.currency, price: frontmatter.fromPrice, url: `https://hiddenchinatravel.com/journeys/${journey.slug}` } } : {}),
      },
      breadcrumbList([
        { name: t("breadcrumbHome"), href: "/" },
        { name: t("breadcrumbJourneys"), href: "/journeys" },
        { name: frontmatter.title, href: `/journeys/${journey.slug}` },
      ]),
    ],
  };

  return <main className={isSixDayYunnanJourney ? "journey-page journey-page-offer" : "journey-page"}>
    <SiteHeader conversion alternate={alternate} cta={{ href: isSixDayYunnanJourney ? whatsapp : "#ask-joy", mailHref: "#ask-joy", label: t("startPlanning"), location: "header_journey_price" }} />
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
      primary={{ href: isSixDayYunnanJourney ? whatsapp : "#ask-joy", label: t("startPlanning") }}
      secondary={{ href: "#itinerary", label: frontmatter.heroSecondaryLabel || t("seeDays") }}
      chat={{ href: isSixDayYunnanJourney ? "#ask-joy" : whatsapp, label: isSixDayYunnanJourney ? t("chatEmail") : t("chatWhatsapp") }}
      note={frontmatter.heroNote || t("heroNoteDefault")}
    />
    {isSixDayYunnanJourney ? <JourneyOverview title={frontmatter.overviewTitle || t("overviewTitleDefault")} description={frontmatter.overviewDescription || t("overviewDescriptionDefault")} items={overviewItems} action={{ href: whatsapp, label: t("startPlanning") }} /> : null}
    {isSixDayYunnanJourney ? <JourneySectionNav links={[
      { href: "#glance", label: t("navGlance") },
      { href: "#why-travel", label: t("navWhy") },
      { href: "#itinerary", label: t("navItinerarySix") },
      { href: "#experiences", label: t("testimonialsHeading") },
      { href: "#private-journey", label: t("navDetails") },
      { href: "#questions", label: t("goodToKnow") },
    ]} action={{ href: "#ask-joy", label: t("navAction") }} /> : null}
    <section className="journey-fold-ask" id="quote">
      <div className="shell">
        {isSixDayYunnanJourney ? <div className="journey-guest-proof">
          <p>{t("guestProofKicker")}</p>
          <div className="journey-guest-proof-row">
            {guestProofImages.map((src, index) => <figure key={src}>
              <Image src={encodeURI(src)} alt={guestProofSlides[index].alt} fill sizes="(max-width:700px) 46vw, 420px" unoptimized />
              <figcaption>{guestProofSlides[index].caption}</figcaption>
            </figure>)}
          </div>
          <p className="journey-guest-caption">{t("guestProofCaption")}</p>
        </div> : <div className="journey-quote-ask">
          <h3>{t("quoteHeading")}</h3>
          <p>{t("quoteFoldText", { price: completePrice })}</p>
          <QuickAsk layout="embedded" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} intent="trip" />
          <p className="journey-quote-contract">{t("joyReplies")}</p>
        </div>}
      </div>
    </section>
    <JourneyFactCards id="why-travel" title={t("whyTitle")} cards={[
      { icon: "party", title: t("factPartyTitle"), lines: t.raw("factPartyLines") as string[] },
      { icon: "person", title: t("factJoyTitle"), lines: t.raw("factJoyLines") as string[] },
      { icon: "licence", title: t("factAgencyTitle"), lines: factAgencyLines },
      { icon: "star", title: t("factGuestTitle"), lines: t.raw(stories.length ? "factGuestWithStories" : "factGuestNoStories") as string[] },
    ]} />
    <JourneyWhy />
    {isSixDayYunnanJourney ? null : <JourneyOverview title={frontmatter.overviewTitle || t("overviewTitleDefault")} description={frontmatter.overviewDescription || t("overviewDescriptionDefault")} items={overviewItems} action={{ href: "#ask-joy", label: t("startPlanning") }} />}
    {frontmatter.whoFor || frontmatter.whenToGo ? <section className="journey-fit-season"><div className="shell">{frontmatter.whoFor ? <article><span>{t("whoForLabel")}</span><p>{frontmatter.whoFor}</p></article> : null}{frontmatter.whenToGo ? <article><span>{t("whenToGoLabel")}</span><p>{frontmatter.whenToGo}</p></article> : null}</div></section> : null}

    {frontmatter.experiences.length ? <section className="journey-experiences section section-sand" id="experiences"><div className="shell"><div className="section-heading"><h2>{t("experiencesHeading")}</h2><p>{isSixDayYunnanJourney ? t("experiencesIntroSixDay") : t("experiencesIntroDefault")}</p></div><div className="journey-experience-grid">{frontmatter.experiences.map((experience, index) => <article key={experience.title}><div><Image src={experience.image} alt={experience.imageAlt || experience.title} fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><span>0{index + 1}</span><h3>{experience.title}</h3><p>{experience.description}</p></article>)}</div></div></section> : null}

    <section className="journey-itinerary section" id="itinerary"><div className="shell journey-section-layout"><header><p>{frontmatter.itineraryKicker || t("itineraryKickerDefault")}</p><h2>{frontmatter.itineraryHeading || (isSixDayYunnanJourney ? t("itineraryHeadingSixDay") : t("itineraryHeadingDefault"))}</h2><span>{frontmatter.itineraryIntro || (isSixDayYunnanJourney ? t("itineraryIntroSixDay") : t("itineraryIntroDefault"))}</span></header><div className="journey-days">{frontmatter.itinerary.map((day, dayIndex) => {
      const isErhaiDay = isSixDayYunnanJourney && dayIndex === 1;
      const dayPhoto = isErhaiDay ? undefined : day.image ? [day.image, day.imageAlt || day.title] as const : isSixDayYunnanJourney && sixDayPhotoSrc[`Day ${dayIndex + 1}`] ? [sixDayPhotoSrc[`Day ${dayIndex + 1}`], dayPhotoAlts[`Day ${dayIndex + 1}`]] as const : undefined;
      const isShaxiStay = isSixDayYunnanJourney && dayIndex === 2;
      const dayCopy = day.description.split(/\n\n+/);
      return <details key={day.days}><summary><span>{day.days}</span><div><h3>{day.title}</h3><p>{day.meta}</p></div><b aria-hidden="true">+</b></summary>{dayCopy.map((paragraph, paragraphIndex) => <p key={`${day.days}-${paragraphIndex}`}>{paragraph}</p>)}{day.meals ? <p className="journey-day-meals"><strong>{/Overnight|Pace:|住宿|节奏/.test(day.meals) ? t("theDayLabel") : t("mealsLabel")}</strong> {day.meals}</p> : null}{dayPhoto ? <figure className="journey-day-photo"><Image src={encodeURI(dayPhoto[0])} alt={dayPhoto[1]} fill sizes="(max-width:700px) 100vw, 640px" unoptimized /><figcaption>{dayPhoto[1]}</figcaption></figure> : null}{isErhaiDay ? <div className="journey-day-pair journey-day-pair-landscape"><figure><Image src="/assets/journeys/kunming-dali-shaxi-lijiang-6-days/zhoucheng-indigo-tie-dye-rinsing.webp" alt={t("erhaiPairAltRinsing")} fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure><figure><Image src="/assets/journeys/kunming-dali-shaxi-lijiang-6-days/zhoucheng-indigo-dye-vat.webp" alt={t("erhaiPairAltVat")} fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure></div> : null}{isShaxiStay ? <div className="journey-day-pair"><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt={t("shaxiPairAltLane")} fill sizes="(max-width: 700px) 45vw, 28vw" unoptimized /></figure><figure><Image src="/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" alt={t("shaxiPairAltGoats")} fill sizes="(max-width: 700px) 45vw, 20vw" unoptimized /></figure></div> : null}</details>;
    })}</div></div></section>

    {stories.length > 0 ? <Testimonials items={stories} eyebrow={t("testimonialsEyebrow")} heading={t("testimonialsHeading")} intro={t("testimonialsIntro")} note={t("testimonialsNote")} /> : null}

    <section className="journey-price-module" id="pricing">
      {frontmatter.tiers.length ? <section className="journey-pricing section section-sand"><div className="shell"><div className="journey-editorial-heading"><span>{t("priceKicker")}</span><h2>{frontmatter.pricingHeading || t("pricingHeadingDefault")}</h2><p>{frontmatter.pricingIntro || t("pricingIntroDefault")}</p></div>
      <div className="journey-price-convert">
        <div>
          <div className="journey-price-grid">{frontmatter.tiers.map((tier) => <article key={tier.name} className={tier.featured ? "featured" : ""}>{tier.featured ? <span className="price-choice">{t("recommended")}</span> : null}<h3>{tier.name}</h3><div className="journey-tier-price">{t("tierFrom")} <b>{formatPriceLabel(tier.price, frontmatter.currency)}</b> <span>{t("perPerson")}</span></div><p>{tier.description}</p><small>{t("idealFor")}</small><strong>{tier.idealFor}</strong><HashLink className="journey-tier-quote" href="#ask-joy-price">{t("quoteThisStyle")}</HashLink></article>)}</div>
          <p className="journey-price-shared">{(t.raw("sharedTierPoints") as string[]).join(" · ")}.</p>
          <p className="journey-price-note">{frontmatter.priceExplanation || t("priceNoteDefault")}</p>
        </div>
        <div className="journey-quote-ask"><h3>{t("tierQuoteHeading")}</h3><p>{t("tierQuoteText", { price: completePrice })}</p><QuickAsk layout="embedded" id="ask-joy-price" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} intent="trip" /><p className="journey-quote-contract">{t("joyReplies")}</p></div>
      </div></div></section> : isSixDayYunnanJourney ? <JourneyQuoteBand id="ask-joy" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} /> : <JourneyQuoteBand id="ask-joy-price" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} compact />}

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

      <JourneyTrustSection
        showCredentials={false}
        showMuslimFriendly={false}
        kicker={isSixDayYunnanJourney ? "" : undefined}
        heading={isSixDayYunnanJourney ? t("trustHeadingSixDay") : undefined}
        description={isSixDayYunnanJourney ? t("trustDescriptionSixDay") : undefined}
        guideTitle={isSixDayYunnanJourney ? t("trustGuideTitleSixDay") : undefined}
        guideCopy={isSixDayYunnanJourney ? t("trustGuideCopySixDay") : undefined}
        vehicleTitle={isSixDayYunnanJourney ? t("trustVehicleTitleSixDay") : undefined}
        vehicleCopy={isSixDayYunnanJourney ? t("trustVehicleCopySixDay") : undefined}
        hotelTitle={isSixDayYunnanJourney ? t("trustHotelTitleSixDay") : undefined}
        hotelCopy={isSixDayYunnanJourney ? t("trustHotelCopySixDay") : undefined}
        hotelCities={isEightDayYunnanJourney ? ["kunming", "dali", "lijiang", "shangri-la"] : undefined}
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

    {isSixDayYunnanJourney ? <PlanJourneyClose id="ask-joy-final" source={`/journeys/${journey.slug}`} sourceTitle={frontmatter.heroTitle || frontmatter.title} whatsapp={whatsapp} routeHref="/custom-china-tour" showForm={false} /> : <section className="journey-final-cta"><div><p>{t("finalKicker")}</p><h2>{t("finalHeading")}</h2><span>{t("finalText")}</span><HashLink href="#ask-joy" className="button button-light">{t("startPlanning")}</HashLink><Link href={whatsapp} className="journey-final-alt">{t("chatWhatsapp")}</Link><Link href="/custom-china-tour" className="journey-final-alt" data-cta-location="journey_custom_alternative">{t("customRouteLink")}</Link></div></section>}
    <JourneyMobileCta href={isSixDayYunnanJourney ? whatsapp : "#ask-joy"} label={t("startPlanning")} />
    <ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  </main>;
}
