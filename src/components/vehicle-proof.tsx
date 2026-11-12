"use client";

import { useLocale } from "next-intl";
import { ProofCarousel } from "@/components/proof-carousel";
import { getVehicleProof } from "@/lib/journey-trust-i18n";

export function VehicleProof({ title, copy }: { title?: string; copy?: string }) {
  const vehicleProof = getVehicleProof(useLocale() as "en" | "zh");
  const gallery = vehicleProof.groups[0];

  return <div className="journey-proof-grid">
    <div className="journey-proof-copy">
      <span>{vehicleProof.kicker}</span>
      <h3>{title || vehicleProof.title}</h3>
      <p>{copy || vehicleProof.copy}</p>
    </div>
    <ProofCarousel label={gallery.carouselLabel} slides={gallery.slides} variant="landscape" className="proof-carousel-vehicle" />
  </div>;
}
