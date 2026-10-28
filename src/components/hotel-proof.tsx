"use client";

import { useState } from "react";
import { ProofCarousel } from "@/components/proof-carousel";
import { hotelProof } from "@/lib/journey-trust";

export function HotelProof({ title, copy }: { title?: string; copy?: string }) {
  const [activeId, setActiveId] = useState(hotelProof.groups[0].id);
  const active = hotelProof.groups.find((group) => group.id === activeId) ?? hotelProof.groups[0];

  return <div className="journey-proof-grid">
    <div className="journey-proof-copy">
      <span>{hotelProof.kicker}</span>
      <h3>{title || hotelProof.title}</h3>
      <p>{copy || hotelProof.copy}</p>
      <div className="proof-group-switch" role="tablist" aria-label="Hotel city">
        {hotelProof.groups.map((group) => <button key={group.id} type="button" role="tab" aria-selected={group.id === active.id} onClick={() => setActiveId(group.id)}>{group.label}</button>)}
      </div>
    </div>
    <ProofCarousel key={active.id} label={active.carouselLabel} slides={active.slides} variant="landscape" />
  </div>;
}
