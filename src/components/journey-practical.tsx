"use client";

import { useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";
import { bookingDocumentHref } from "@/lib/booking-terms";

type Note = { title: string; detail: string };

export function JourneyPractical({
  notes = [],
  faqs = [],
  title,
  groups: curated,
}: {
  notes?: Note[];
  faqs?: Note[];
  title?: string;
  groups?: { id: string; label: string; items: Note[] }[];
}) {
  const t = useTranslations("journey");
  const items = curated?.length
    ? curated.flatMap((group) => group.items)
    : [...notes, ...faqs];
  const priority = [
    "Is this journey suitable for first-time visitors to China?",
    "Can this itinerary be customized?",
    "What should I pack for Yunnan?",
    "Do I need to worry about altitude?",
    "What type of hotels are included?",
    "What's included in the price?",
  ];
  const uniqueItems = items
    .filter((item, index, all) => all.findIndex((candidate) => candidate.title === item.title) === index)
    .sort((a, b) => {
      const aIndex = priority.indexOf(a.title);
      const bIndex = priority.indexOf(b.title);
      return (aIndex < 0 ? priority.length : aIndex) - (bIndex < 0 ? priority.length : bIndex);
    });

  return <section className="journey-practical section" id="questions" aria-labelledby="practical-title">
    <div className="shell">
      <header className="journey-practical-heading">
        <h2 id="practical-title">{title ?? t("goodToKnow")}</h2>
      </header>
      <div className="journey-practical-accordion">
        {uniqueItems.map((item) => <details key={item.title}>
          <summary><span>{item.title}</span><b aria-hidden="true">+</b></summary>
          <div className="journey-practical-answer"><p>{item.detail}</p></div>
        </details>)}
      </div>
      <p className="journey-practical-source">
        <a href="https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html" target="_blank" rel="noopener noreferrer">{t("cdcLink")}</a><span aria-hidden="true"> · </span><Link href={bookingDocumentHref}>{t("bookingNoteLink")}</Link>
      </p>
    </div>
  </section>;
}
