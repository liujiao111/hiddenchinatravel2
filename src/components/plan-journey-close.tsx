import Link from "next/link";
import { QuickAsk } from "@/components/quick-ask";

export function PlanJourneyClose({
  id,
  source,
  sourceTitle,
  whatsapp,
  routeHref,
}: {
  id: string;
  source: string;
  sourceTitle: string;
  whatsapp: string;
  routeHref?: string;
}) {
  return <section className="journey-final-cta journey-final-cta-ask">
    <div>
      <h2>Your plans don’t have to fit a set itinerary.</h2>
      <span>A family trip, a slower pace, or more time in a place you love. Let’s shape your Yunnan journey around it.</span>
      <a className="button journey-primary-action" href={whatsapp} data-cta-location={`${id}_whatsapp`}>Start Planning My Journey</a>
      <p className="journey-close-email">Or send the same details by email. Joy replies to the note. Nothing is booked from it.</p>
      <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      {routeHref ? <Link className="journey-final-alt" href={routeHref} data-cta-location={`${id}_custom`}>A different date or route? Explore tailor-made Yunnan →</Link> : null}
    </div>
  </section>;
}
