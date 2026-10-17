import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { clientVoices, type ClientVoice } from "@/data/client-voices";

type ClientVoicesProps = {
  voices?: ClientVoice[];
  title?: string;
  description?: string;
};

export function ClientVoices({
  voices = clientVoices,
  title = "What travelers tell Joy.",
  description = "Real feedback from past trips, shared with permission.",
}: ClientVoicesProps = {}) {
  if (!voices.length) return null;

  return (
    <section className="client-voices section" id="client-voices" aria-labelledby="client-voices-title">
      <div className="shell">
        <div className="journey-editorial-heading">
          <span>WHAT TRAVELERS TELL JOY</span>
          <h2 id="client-voices-title">{title}</h2>
          <p>{description}</p>
          <div className="testimonials-rating"><StarRating label="Overall rating: 5 out of 5 stars" /><p>5.0 · Every guest rated 5 stars</p></div>
        </div>
        <div className="client-voices-grid">
          {voices.map((voice) => (
            <figure className="client-voice" key={`${voice.name}-${voice.trip}`}>
              <StarRating />
              <blockquote>&ldquo;{voice.quote}&rdquo;</blockquote>
              <figcaption>
                <strong>{voice.name}</strong>
                <span>{voice.trip}</span>
                {voice.sourceUrl ? (
                  <Link href={voice.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {voice.sourceLabel ?? "View the original review ↗"}
                  </Link>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
