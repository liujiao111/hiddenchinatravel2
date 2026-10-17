"use client";

import { useState } from "react";
import { ProofCarousel } from "@/components/proof-carousel";
import { vehicleProof } from "@/lib/journey-trust";

export function VehicleProof() {
  const [activeId, setActiveId] = useState(vehicleProof.groups[0].id);
  const active = vehicleProof.groups.find((group) => group.id === activeId) ?? vehicleProof.groups[0];

  return <div className="journey-proof-grid">
    <div className="journey-proof-copy">
      <span>{vehicleProof.kicker}</span>
      <h3>{vehicleProof.title}</h3>
      <p>{vehicleProof.copy}</p>
      <div className="vehicle-size-switch" role="tablist" aria-label="Vehicle size">
        {vehicleProof.groups.map((group) => <button key={group.id} type="button" role="tab" aria-selected={group.id === active.id} onClick={() => setActiveId(group.id)}>{group.label}</button>)}
      </div>
    </div>
    <ProofCarousel key={active.id} label={active.carouselLabel} slides={active.slides} variant="portrait" className="proof-carousel-poster" />
  </div>;
}
