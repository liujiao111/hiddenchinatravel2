import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type JourneyCardData = {
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  imageAlt?: string;
  destination?: string;
  duration?: string;
  fromPrice?: string;
  priceNote?: string;
  features?: string[];
  ctaLabel?: string;
  trackingLocation?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function JourneyCard({ journey, priority = false }: { journey: JourneyCardData; priority?: boolean }) {
  const contents = <>
    <Image
      src={journey.image}
      alt={journey.imageAlt || journey.title}
      fill
      priority={priority}
      unoptimized
      sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 31vw"
    />
    <div className="journey-card-shade" />
    <div className="journey-card-copy">
      {journey.destination ? <span>{journey.destination}</span> : null}
      <h3>{journey.title}</h3>
      {journey.subtitle ? <p>{journey.subtitle}</p> : null}
      {journey.duration ? <p className="journey-card-duration">{journey.duration}</p> : null}
      {journey.features?.length ? <ul>{journey.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul> : null}
      {journey.fromPrice ? <b className="journey-card-price">{journey.fromPrice}</b> : null}
      {journey.priceNote ? <small className="journey-card-note">{journey.priceNote}</small> : null}
      {journey.secondaryHref
        ? <div className="journey-card-actions"><Link href={journey.href} data-cta-location={journey.trackingLocation}>{journey.ctaLabel || "View the Journey"} →</Link><Link href={journey.secondaryHref} data-cta-location={journey.trackingLocation ? journey.trackingLocation + "_customize" : undefined}>{journey.secondaryLabel || "Customize This Route"}</Link></div>
        : <strong>{journey.ctaLabel || "Explore the journey →"}</strong>}
    </div>
  </>;
  // Cards with two actions cannot be wrapped in an outer link: nested links
  // are invalid and break keyboard/touch interactions.
  return journey.secondaryHref
    ? <article className="journey-card journey-card-dual">{contents}</article>
    : <Link href={journey.href} className="journey-card" data-cta-location={journey.trackingLocation}>{contents}</Link>;
}
