"use client";

import Link from "next/link";
import { bookingDocumentHref } from "@/lib/booking-terms";

type Note = { title: string; detail: string };

export function JourneyPractical({
  notes = [],
  faqs = [],
  title = "Good To Know",
  groups: curated,
}: {
  notes?: Note[];
  faqs?: Note[];
  title?: string;
  groups?: { id: string; label: string; items: Note[] }[];
}) {
  const items = curated?.length
    ? curated.flatMap((group) => group.items)
    : [...notes, ...faqs];
  const uniqueItems = items.filter((item, index, all) =>
    all.findIndex((candidate) => candidate.title === item.title) === index
  );

  return <section className="journey-practical section" id="questions" aria-labelledby="practical-title">
    <div className="shell">
      <header className="journey-practical-heading">
        <h2 id="practical-title">{title}</h2>
      </header>
      <div className="journey-practical-accordion">
        {uniqueItems.map((item) => <details key={item.title}>
          <summary><span>{item.title}</span><b aria-hidden="true">+</b></summary>
          <div className="journey-practical-answer"><p>{item.detail}</p></div>
        </details>)}
      </div>
      <p className="journey-practical-source">
        <Link href={bookingDocumentHref}>Read the full booking and service note →</Link>
      </p>
    </div>
  </section>;
}
