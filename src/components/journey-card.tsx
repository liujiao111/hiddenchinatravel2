import Image from "next/image";
import Link from "next/link";

export type JourneyCardData = {
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  imageAlt?: string;
  destination?: string;
  duration?: string;
  fromPrice?: string;
  features?: string[];
};

export function JourneyCard({ journey, priority = false }: { journey: JourneyCardData; priority?: boolean }) {
  return <Link href={journey.href} className="journey-card">
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
      {journey.features?.length ? <ul>{journey.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul> : null}
      {journey.duration || journey.fromPrice ? <div className="journey-card-meta">
        {journey.duration ? <b>{journey.duration}</b> : null}
        {journey.fromPrice ? <b>{journey.fromPrice}</b> : null}
      </div> : null}
      <strong>Explore the journey →</strong>
    </div>
  </Link>;
}
