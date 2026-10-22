"use client";

import { useState } from "react";
import { HotelProof } from "@/components/hotel-proof";
import { LocalTeamProof } from "@/components/local-team-proof";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { brandIdentity } from "@/lib/booking-terms";
import { driverGuideProof } from "@/lib/journey-trust";

const proofTabs = [
  { id: "guide", label: "DRIVER-GUIDE" },
  { id: "vehicle", label: "VEHICLE" },
  { id: "hotels", label: "HOTELS" },
] as const;

export function JourneyTrustSection({
  variant = "full",
}: {
  variant?: "full" | "compact";
} = {}) {
  const compact = variant === "compact";
  const [activeId, setActiveId] = useState<(typeof proofTabs)[number]["id"]>("guide");

  return <section className="journey-proof section section-sand" id="local-team" aria-labelledby="local-team-title"><div className="shell">
    <div className="journey-editorial-heading">
      {compact ? null : <span>THE PEOPLE BEHIND YOUR JOURNEY</span>}
      <h2 id="local-team-title">{compact ? "The local team, hotels and licensed agency." : "Meet your driver-guide, vehicles and hotels."}</h2>
      <p>{brandIdentity.short} {brandIdentity.consultant} A driver-guide, vehicle and hotel examples are confirmed in writing.</p>
    </div>
    <div className="proof-group-switch journey-proof-tabs" role="tablist" aria-label="Guide, vehicle or hotels">
      {proofTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={tab.id === activeId} onClick={() => setActiveId(tab.id)}>{tab.label}</button>)}
    </div>
    {activeId === "guide" ? <LocalTeamProof group={driverGuideProof} /> : null}
    {activeId === "vehicle" ? <VehicleProof /> : null}
    {activeId === "hotels" ? <HotelProof /> : null}
    <OperatorCredentials />
  </div></section>;
}
