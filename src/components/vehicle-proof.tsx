"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProofCarousel } from "@/components/proof-carousel";
import { getVehicleProof } from "@/lib/journey-trust-i18n";

export function VehicleProof({ title, copy }: { title?: string; copy?: string }) {
  const t = useTranslations("journey");
  const vehicleProof = getVehicleProof(useLocale() as "en" | "zh");
  const [activeId, setActiveId] = useState(vehicleProof.groups[0].id);
  const active = vehicleProof.groups.find((group) => group.id === activeId) ?? vehicleProof.groups[0];

  return <div className="journey-proof-grid">
    <div className="journey-proof-copy">
      <span>{vehicleProof.kicker}</span>
      <h3>{title || vehicleProof.title}</h3>
      <p>{copy || vehicleProof.copy}</p>
      <div className="vehicle-size-switch" role="tablist" aria-label={t("vehicleSizeAria")}>
        {vehicleProof.groups.map((group) => <button key={group.id} type="button" role="tab" aria-selected={group.id === active.id} onClick={() => setActiveId(group.id)}>{group.label}</button>)}
      </div>
    </div>
    <ProofCarousel key={active.id} label={active.carouselLabel} slides={active.slides} variant="portrait" className="proof-carousel-poster" />
  </div>;
}
