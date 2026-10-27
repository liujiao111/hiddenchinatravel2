import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { QuickAsk } from "@/components/quick-ask";

export function PlanJourneyClose({
  id,
  source,
  sourceTitle,
  whatsapp,
  routeHref,
  heading = "Your plans don’t have to fit a set itinerary.",
  body = "A family trip, a slower pace, or more time in a place you love. Let’s shape your Yunnan journey around it.",
  ctaLabel = "Chat on WhatsApp",
  emailLabel = "Or send the same details by email. Joy replies to the note. Nothing is booked from it.",
  emailHref,
}: {
  id: string;
  source: string;
  sourceTitle: string;
  whatsapp: string;
  routeHref?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  emailLabel?: string;
  emailHref?: string;
}) {
  return <section className="journey-final-cta journey-final-cta-ask">
    <div>
      <h2>{heading}</h2>
      <span>{body}</span>
      <a className="button journey-primary-action" id={`${id}-whatsapp`} href={whatsapp} data-cta-location={`${id}_whatsapp`}>{ctaLabel}</a>
      {emailHref ? <HashLink className="journey-final-alt" href={emailHref}>{emailLabel}</HashLink> : <p className="journey-close-email">{emailLabel}</p>}
      <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      {routeHref ? <Link className="journey-final-alt" href={routeHref} data-cta-location={`${id}_custom`}>A different date or route? Explore tailor-made Yunnan →</Link> : null}
    </div>
  </section>;
}
