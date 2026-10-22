"use client";

import { useState } from "react";
import { HotelProof } from "@/components/hotel-proof";
import { LocalTeamProof } from "@/components/local-team-proof";
import { MuslimFriendly } from "@/components/muslim-friendly";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { brandIdentity, driverGuideCopy } from "@/lib/booking-terms";
import { driverGuideProof } from "@/lib/journey-trust";

const proofTabs = [
  { id: "guide", label: "DRIVER-GUIDE" },
  { id: "vehicle", label: "VEHICLE" },
  { id: "hotels", label: "HOTELS" },
] as const;

const privateJourneyPoints = [
  ["Driver-guide", driverGuideCopy.short],
  ["Private vehicle", "A five- or seven-seat vehicle, matched to your party. These photographs are examples; the vehicle is named in your proposal."],
  ["Hotels", "Choose Comfort, Premium or Luxury. The photographs are examples by city. The hotel in each place is named in your written proposal."],
] as const;

export function JourneyTrustSection({
  variant = "full",
  showCredentials = true,
}: {
  variant?: "full" | "compact";
  showCredentials?: boolean;
} = {}) {
  const compact = variant === "compact";
  const [activeId, setActiveId] = useState<(typeof proofTabs)[number]["id"]>("guide");

  return <section className="journey-proof section section-sand" id={compact ? "local-team" : "private-journey"} aria-labelledby="private-journey-title">
    <div className="shell">
      <div className="journey-editorial-heading">
        {compact ? null : <span>YOUR PRIVATE JOURNEY</span>}
        <h2 id="private-journey-title">{compact ? "The local team, hotels and licensed agency." : "A driver-guide, a private vehicle, and hotels named in writing."}</h2>
        <p>{compact ? `${brandIdentity.short} ${brandIdentity.consultant} A driver-guide, vehicle and hotel examples are confirmed in writing.` : "You travel as your own party. No shopping stops. The person, the car and the hotels below are examples from the team we use; the assignment for your dates is confirmed in the proposal."}</p>
      </div>
      {compact ? null : <div className="journey-private-points">{privateJourneyPoints.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div>}
      <div className="proof-group-switch journey-proof-tabs" role="tablist" aria-label="Guide, vehicle or hotels">
        {proofTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={tab.id === activeId} onClick={() => setActiveId(tab.id)}>{tab.label}</button>)}
      </div>
      {activeId === "guide" ? <LocalTeamProof group={driverGuideProof} /> : null}
      {activeId === "vehicle" ? <VehicleProof /> : null}
      {activeId === "hotels" ? <HotelProof /> : null}
      {showCredentials ? <OperatorCredentials /> : null}
    </div>
    {compact ? null : <MuslimFriendly />}
  </section>;
}
