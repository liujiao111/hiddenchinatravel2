import Image from "next/image";
import Link from "next/link";
import { OperatorCredentials } from "@/components/operator-credentials";
import { Testimonials } from "@/components/testimonials";
import { brandIdentity } from "@/lib/booking-terms";
import { getSelectedTestimonials, selectedTestimonialsCopy } from "@/lib/testimonials";

export function JourneyWhy() {
  const stories = getSelectedTestimonials().slice(0, 3);

  return <section className="journey-why" id="why-us" aria-labelledby="why-us-title">
    <div className="shell journey-why-intro">
      <div className="journey-editorial-heading">
        <span>WHY TRAVEL WITH US</span>
        <h2 id="why-us-title">A Yunnan host, a licensed agency, and guests who travelled with us.</h2>
        <p>{brandIdentity.short} {brandIdentity.consultant}</p>
      </div>
    </div>
    <div className="journey-host journey-host-compact">
      <div className="journey-host-image"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, travel consultant at Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 48vw" unoptimized /></div>
      <div className="journey-host-copy">
        <span>YOUR LOCAL CONNECTION</span>
        <h2>You’ll be planning with Joy.</h2>
        <blockquote>“Living abroad taught me how different a place feels when you have someone local you can trust.”</blockquote>
        <p>Joy Liu was born and raised in Yunnan. She came home to plan journeys from Kunming. You speak with her from the first enquiry through the trip.</p>
        <Link href="/about-us">MEET JOY →</Link>
      </div>
    </div>
    {stories.length > 0 ? <Testimonials items={stories} eyebrow="FROM EARLIER GUESTS" heading={selectedTestimonialsCopy.heading} intro="These notes come from guests on private Yunnan routes we planned." showRating={false} note={selectedTestimonialsCopy.note} /> : null}
    <div className="shell journey-why-licence">
      <details className="journey-why-licence-fold">
        <summary>Inspect the licensed-agency documents<span aria-hidden="true">+</span></summary>
        <OperatorCredentials />
      </details>
    </div>
  </section>;
}
