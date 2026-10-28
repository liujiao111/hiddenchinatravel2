"use client";

import { useState } from "react";
import Link from "next/link";
import { bookingDocumentHref, bookingTermCards } from "@/lib/booking-terms";
import { muslimFriendly } from "@/lib/journey-trust";

type Note = { title: string; detail: string };
type TabId = "route" | "mountain" | "price" | "muslim" | "booking";

const tabs: { id: TabId; label: string }[] = [
  { id: "route", label: "The route" },
  { id: "mountain", label: "The mountain" },
  { id: "price", label: "Price & payment" },
  { id: "muslim", label: "Muslim-friendly" },
  { id: "booking", label: "Who you book with" },
];

function category(title: string): TabId {
  const text = title.toLowerCase();
  if (/muslim|halal|prayer/.test(text)) return "muslim";
  if (/pay|cancel|insurance|per day|meal|lunch|dinner|food|plans change/.test(text)) return "price";
  if (/jade|glacier|cable|altitude|mountain|day 6|departure|weather|access|too long/.test(text)) return "mountain";
  if (/who |contract|operat|language|permit|hotel/.test(text)) return "booking";
  return "route";
}

function covered(title: string, notes: Note[]) {
  const text = title.toLowerCase();
  const has = (pattern: RegExp) => notes.some((note) => pattern.test(note.title.toLowerCase()));
  if (/start and finish/.test(text) && has(/start|finish/)) return true;
  if (/cable|glacier/.test(text) && has(/jade|cable|altitude|mountain/)) return true;
  if (/morning flight|day 6/.test(text) && has(/day 6|departure/)) return true;
  if (/who (arranges|operat|provides)|contract and operates/.test(text)) return true;
  if (/muslim|halal/.test(text)) return true;
  if (/shopping/.test(text) && has(/shopping/)) return true;
  if (/insurance/.test(text) && has(/insurance/)) return true;
  if (/payment|cancellation/.test(text) && has(/pay|plans change/)) return true;
  return false;
}

export function JourneyPractical({
  notes = [],
  faqs = [],
  title = "Questions, grouped.",
  groups: curated,
}: {
  notes?: Note[];
  faqs?: Note[];
  title?: string;
  groups?: { id: string; label: string; items: Note[] }[];
}) {
  const grouped = Boolean(curated?.length);
  const groups: Record<TabId, Note[]> = {
    route: [],
    mountain: [],
    price: [],
    muslim: muslimFriendly.points.map((point) => ({ title: point.title, detail: point.detail })),
    booking: [],
  };

  for (const [title, detail] of bookingTermCards) {
    groups[category(title)].push({ title, detail });
  }
  for (const note of notes) groups[category(note.title)].push(note);
  for (const faq of faqs) {
    if (covered(faq.title, [...notes, ...groups.route, ...groups.mountain, ...groups.price, ...groups.booking])) continue;
    groups[category(faq.title)].push({ title: faq.title, detail: faq.detail });
  }

  const visible = grouped
    ? curated!.map((group) => ({ id: group.id, label: group.label, items: group.items }))
    : tabs.filter((tab) => groups[tab.id].length > 0).map((tab) => ({ ...tab, items: groups[tab.id] }));
  const [activeId, setActiveId] = useState(visible[0]?.id ?? "route");
  const activeItems = visible.find((tab) => tab.id === activeId)?.items ?? [];
  const showAltitude = activeItems.some((item) => /altitude|4,506|glacier|jade dragon/i.test(`${item.title} ${item.detail}`));

  return <section className="journey-practical section" id="questions" aria-labelledby="practical-title">
    <div className="shell">
      <header className="journey-practical-heading">
        <p>BEFORE YOU GO</p>
        <h2 id="practical-title">{title}</h2>
      </header>
      <div className="journey-practical-tabs" role="tablist" aria-label="Questions before you book">
        {visible.map((tab) => <button key={tab.id} type="button" role="tab" id={`practical-tab-${tab.id}`} aria-controls={`practical-panel-${tab.id}`} aria-selected={tab.id === activeId} onClick={() => setActiveId(tab.id)}>{tab.label}</button>)}
      </div>
      {visible.map((tab) => <div key={tab.id} id={`practical-panel-${tab.id}`} role="tabpanel" aria-labelledby={`practical-tab-${tab.id}`} hidden={tab.id !== activeId} className="journey-practical-panel">
        {tab.id === "muslim" ? <p className="journey-practical-intro">{muslimFriendly.copy}</p> : null}
        {tab.items.map((item) => <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>)}
      </div>)}
      <p className="journey-practical-source">
        {showAltitude ? <>For medical questions about high-elevation travel, consult your clinician and the <a href="https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/high-altitude-travel-and-altitude-illness.html" target="_blank" rel="noopener noreferrer">CDC high-altitude guidance ↗</a>. </> : null}
        <Link href={bookingDocumentHref}>Read the full booking and service note →</Link>
      </p>
    </div>
  </section>;
}
