"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { driverGuideProof, hotelProof, vehicleProof } from "@/lib/journey-trust";

type Category = "travelers" | "vehicles-guides" | "hotels" | "planning";
type Evidence = {
  src: string;
  alt: string;
  title: string;
  detail: string;
  copy: string;
};
const categories: { id: Category; label: string }[] = [
  { id: "travelers", label: "Guest Journeys" },
  { id: "vehicles-guides", label: "Vehicles & Guides" },
  { id: "hotels", label: "Hotels" },
  { id: "planning", label: "Planning" },
];

// These six photos are already present in the site's guest-photo directory.
// The project requires permission before publishing customer photos; no names,
// locations, dates or links to specific testimonial authors are assumed.
const travelers: Evidence[] = [
  "客户1.1.webp", "客户1.2.webp", "客户1.3.webp",
  "客户2.1.webp", "客户2.2.webp", "客户2.3.webp",
].map((file, index) => ({
  src: `/assets/customers/${file}`,
  alt: `Guest photograph from existing Yunnan travel records, image ${index + 1}`,
  title: `Travelers in Yunnan · Photo ${index + 1}`,
  detail: `Guest photo set ${index < 3 ? "01" : "02"}`,
  copy: "Guest photograph from our existing travel materials. Personal identities and exact trip details are not disclosed.",
}));

const vehiclePhotos: Evidence[] = vehicleProof.groups.flatMap(group =>
  group.slides.map(slide => ({
    src: slide.src, alt: slide.alt, title: slide.title,
    detail: slide.detail,
    copy: slide.copy || "A vehicle example from our local transport options.",
  }))
);
const hotelPhotos: Evidence[] = hotelProof.groups.flatMap(group =>
  group.slides.slice(0, 3).map(slide => ({
    src: slide.src, alt: slide.alt, title: slide.title,
    detail: slide.detail,
    copy: slide.copy || "A hotel example; availability is subject to your dates.",
  }))
);
const guidePhotos: Evidence[] = driverGuideProof.slides.map(slide => ({
  src: slide.src, alt: slide.alt, title: slide.title,
  detail: slide.detail,
  copy: slide.copy || "A local team member; assignments are confirmed for your dates.",
}));
// Combine vehicles and team members in one evidence category rather than
// treating them as separate products. Interleave initial items so both types
// appear even before the visitor selects "View more".
const transportAndGuides: Evidence[] = [];
for (let index = 0; index < Math.max(vehiclePhotos.length, guidePhotos.length); index++) {
  if (vehiclePhotos[index]) transportAndGuides.push(vehiclePhotos[index]);
  if (guidePhotos[index]) transportAndGuides.push(guidePhotos[index]);
}
const planningDocuments: Evidence[] = [
  {
    src: "/assets/planning/contract-cover.webp",
    alt: "Redacted sample travel contract cover from Yunnan Meizhen",
    title: "Signed travel contract · cover",
    detail: "Real contract excerpt · personal information removed",
    copy: "A cropped cover from an actual Yunnan travel contract. The original contract number and identifying code are not displayed.",
  },
  {
    src: "/assets/planning/contract-agency.webp",
    alt: "Travel agency name and registration information on a real contract",
    title: "Licensed agency named in contract",
    detail: "Agency and permit details",
    copy: "The contract identifies Yunnan Meizhen International Travel Agency as the contracting travel operator.",
  },
  {
    src: "/assets/planning/contract-seal.webp",
    alt: "Yunnan Meizhen company seal on a real travel contract",
    title: "Contract acknowledgement and seal",
    detail: "Company seal · redacted excerpt",
    copy: "An excerpt showing the travel agency's company seal. Guest information and unrelated details are excluded.",
  },
];
const records: Record<Category, Evidence[]> = {
  travelers, "vehicles-guides": transportAndGuides, hotels: hotelPhotos, planning: planningDocuments,
};

const notes: Record<Category, string> = {
  travelers: "Guest photos are shown independently of the written reviews; a photo does not identify any reviewer.",
  "vehicles-guides": "The vehicle and English-speaking driver-guide shown are examples from our local arrangements. Vehicle size, assigned team members and language support are confirmed for your dates, route and luggage.",
  hotels: "These are existing hotel examples, not guaranteed properties. Your quotation names the hotels, room types and included breakfasts.",
  planning: "These are cropped, privacy-checked excerpts from a real travel contract. Customer enquiries and planning conversations will be added only after their original records and publication permissions are verified.",
};

export function RealJourneyEvidence() {
  const [active, setActive] = useState<Category>("travelers");
  const [expanded, setExpanded] = useState<Partial<Record<Category, boolean>>>({});
  const [viewing, setViewing] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = records[active];
  const selected = viewing === null ? null : items[viewing];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && !dialog?.open) dialog?.showModal();
    if (!selected && dialog?.open) dialog.close();
  }, [selected]);

  function close() { setViewing(null); }
  function changeCategory(category: Category) {
    close();
    setActive(category);
  }
  function move(direction: -1 | 1) {
    setViewing(index => index === null ? null : (index + direction + items.length) % items.length);
  }
  return <section className="journey-proof section section-sand real-journey-evidence" id="real-arrangements" aria-labelledby="real-evidence-title">
    <div className="shell">
      <div className="journey-editorial-heading real-evidence-heading">
        <span>BEHIND YOUR YUNNAN JOURNEY</span>
        <h2 id="real-evidence-title">Real Journeys, Real Arrangements</h2>
        <p>See the vehicles, hotels, local team and planning details behind our private Yunnan journeys.</p>
      </div>
      <div className="proof-group-switch journey-proof-tabs real-evidence-tabs" role="tablist" aria-label="Real journey evidence categories">
        {categories.map(category => <button key={category.id} type="button"
          role="tab" id={`evidence-tab-${category.id}`}
          aria-controls="real-evidence-panel"
          aria-selected={active === category.id}
          tabIndex={active === category.id ? 0 : -1}
          onClick={() => changeCategory(category.id)}>{category.label}</button>)}
      </div>
      <div id="real-evidence-panel" role="tabpanel" aria-labelledby={`evidence-tab-${active}`}>
        {items.length ? <>
          <div className="real-evidence-grid">
            {items.slice(0, expanded[active] ? items.length : 4).map((item, i) =>
              <button className="real-evidence-item" key={item.src} type="button" onClick={() => setViewing(i)} aria-label={`View photo: ${item.title}`}>
                <span className="real-evidence-image"><Image src={encodeURI(item.src)} alt={item.alt} fill
                  sizes="(max-width: 700px) 46vw, (max-width: 1100px) 44vw, 25vw" /></span>
                <span className="real-evidence-caption"><small>{item.detail}</small><strong>{item.title}</strong></span>
              </button>)}
          </div>
          {items.length > 4 ? <div className="real-evidence-more"><button type="button" className="button button-light" onClick={() => setExpanded(value => ({...value, [active]: !value[active]}))}>{expanded[active] ? "Show fewer" : `View more (${items.length - 4})`}</button></div> : null}
        </> : <div className="real-evidence-pending"><h3>Real planning records, coming after review</h3><p>{notes.planning}</p></div>}
        {active !== "planning" ? <p className="real-evidence-note">{notes[active]}</p> : null}
      </div>
      <div className="real-evidence-cta"><h3>Want to see what your own Yunnan journey could look like?</h3><a className="button button-blue" href="#plan">Get My Route &amp; Price</a></div>
    </div>

    <dialog ref={dialogRef} className="real-evidence-dialog" onClose={close} onCancel={close} aria-label={selected?.title || "Journey photo"}>
      {selected ? <div className="real-evidence-modal">
        <div className="real-evidence-modal-head"><span>{categories.find(c=>c.id===active)?.label.toUpperCase()}</span><button type="button" className="real-evidence-close" onClick={close} aria-label="Close image">×</button></div>
        <div className="real-evidence-modal-image"><Image src={encodeURI(selected.src)} alt={selected.alt} fill sizes="(max-width: 800px) 90vw, 900px" /></div>
        <div className="real-evidence-modal-info"><div><small>{selected.detail}</small><h3>{selected.title}</h3><p>{selected.copy}</p></div><div className="proof-carousel-controls"><span>{String(viewing!+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</span><div><button type="button" aria-label="Previous image" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next image" onClick={() => move(1)}>→</button></div></div></div>
      </div> : null}
    </dialog>
  </section>;
}
