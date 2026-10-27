"use client";

import { useState } from "react";
import { HotelProof } from "@/components/hotel-proof";
import { LocalTeamProof } from "@/components/local-team-proof";
import { MuslimFriendly } from "@/components/muslim-friendly";
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
  showCredentials = true,
  showMuslimFriendly = true,
  hotelCopy,
}: {
  variant?: "full" | "compact";
  showCredentials?: boolean;
  showMuslimFriendly?: boolean;
  hotelCopy?: string;
} = {}) {
  const compact = variant === "compact";
  const [activeId, setActiveId] = useState<(typeof proofTabs)[number]["id"]>("guide");

  return <section className="journey-proof section section-sand" id={compact ? "local-team" : "private-journey"} aria-labelledby="private-journey-title">
    <div className="shell">
      <div className="journey-editorial-heading">
        {compact ? null : <span>YOUR PRIVATE JOURNEY</span>}
        <h2 id="private-journey-title">{compact ? "The local team, hotels and licensed agency." : "A driver-guide, a private vehicle, and hotels named in writing."}</h2>
        <p>{compact ? `${brandIdentity.short} ${brandIdentity.consultant} A driver-guide, vehicle and hotel examples are confirmed in writing.` : "You travel as your own party. No shopping stops. The person and the car below are examples from the team we use. The hotels are examples of the style in each place. The assignment for your dates is confirmed in the proposal."}</p>
      </div>
      <div className="proof-group-switch journey-proof-tabs" role="tablist" aria-label="Guide, vehicle or hotels">
        {proofTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={tab.id === activeId} onClick={() => setActiveId(tab.id)}>{tab.label}</button>)}
      </div>
      {activeId === "guide" ? <LocalTeamProof group={driverGuideProof} /> : null}
      {activeId === "vehicle" ? <VehicleProof /> : null}
      {activeId === "hotels" ? <HotelProof copy={hotelCopy} /> : null}
      {showCredentials ? <OperatorCredentials /> : null}
    </div>
    {compact || !showMuslimFriendly ? null : <MuslimFriendly />}
  </section>;
}
