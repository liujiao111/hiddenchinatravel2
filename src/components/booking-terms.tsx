import Link from "next/link";
import { bookingDocumentHref, bookingTermCards } from "@/lib/booking-terms";

export function BookingTerms({
  heading = "Booking, payment and cancellation",
  intro = "The same terms apply to First Encounter Yunnan, The Essence of Yunnan and Tailor-Made Yunnan.",
}: {
  heading?: string;
  intro?: string;
} = {}) {
  return (
    <section className="journey-booking-notes section section-sand journey-booking-notes-compact" id="booking-terms">
      <div className="shell">
        <div className="journey-editorial-heading">
          <span>BEFORE YOU PAY</span>
          <h2>{heading}</h2>
          <p>{intro}</p>
        </div>
        <div className="journey-booking-notes-grid">
          {bookingTermCards.map(([title, detail]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <p className="journey-booking-notes-source"><Link href={bookingDocumentHref}>Read the full booking and service note →</Link></p>
      </div>
    </section>
  );
}
