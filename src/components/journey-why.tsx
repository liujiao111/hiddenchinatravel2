import Image from "next/image";
import Link from "next/link";
import { OperatorCredentials } from "@/components/operator-credentials";
import { StarRating } from "@/components/star-rating";
import { licensedOperator } from "@/lib/journey-trust";
import { getSelectedTestimonials, overallGuestRating, overallGuestRatingHeading, overallGuestRatingIntro } from "@/lib/testimonials";

function firstSentence(quote: string) {
  const match = quote.match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : quote).trim();
}

export function JourneyWhy() {
  const stories = getSelectedTestimonials().slice(0, 3);

  return <section className="journey-why" id="why-us" aria-labelledby="why-us-title">
    <div className="shell">
      <div className="journey-editorial-heading journey-why-intro">
        <span>WHY TRAVEL WITH US</span>
        <h2 id="why-us-title">Rated {overallGuestRating} by guests. Planned from Kunming.</h2>
      </div>

      <div className="journey-why-decision">
        <article>
          <div className="journey-why-joy-photo"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, travel consultant at Hidden China Travel" fill sizes="96px" unoptimized /></div>
          <span>YOUR CONSULTANT</span>
          <h3>You’ll be planning with Joy.</h3>
          <p>Joy Liu was born in Yunnan and plans from Kunming. You speak with him from the first enquiry through the trip.</p>
          <Link href="/about-us">MEET JOY →</Link>
        </article>
        <article>
          <span>LICENSED AGENCY</span>
          <h3>{licensedOperator.nameEn}</h3>
          <p>{licensedOperator.nameZh}. Permit {licensedOperator.permitNumber}. The travel contract and all payments are with this agency.</p>
          <a href="#why-us-licence">Inspect the documents ↓</a>
        </article>
        <article>
          <span>GUEST REVIEWS</span>
          <StarRating value={overallGuestRating} label={`Overall guest rating: ${overallGuestRating} out of 5 stars`} />
          <h3>{overallGuestRatingHeading}</h3>
          <p>{overallGuestRatingIntro}</p>
        </article>
      </div>

      {stories.length ? <div className="journey-why-quotes">{stories.map((story) => <blockquote key={story.id}><p>“{firstSentence(story.quote)}”</p><cite>{story.name} · {story.country}</cite></blockquote>)}</div> : null}

      <details className="journey-why-licence-fold" id="why-us-licence">
        <summary>Inspect the licensed-agency documents<span aria-hidden="true">+</span></summary>
        <OperatorCredentials />
      </details>
    </div>
  </section>;
}
