"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HotelProof } from "@/components/hotel-proof";
import { LocalTeamProof } from "@/components/local-team-proof";
import { MuslimFriendly } from "@/components/muslim-friendly";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { brandIdentity } from "@/lib/booking-terms";
import { getDriverGuideProof } from "@/lib/journey-trust-i18n";

export function JourneyTrustSection({
  variant = "full",
  showCredentials = true,
  showMuslimFriendly = true,
  kicker,
  heading,
  description,
  guideTitle,
  guideCopy,
  vehicleTitle,
  vehicleCopy,
  hotelTitle,
  hotelCopy,
  hotelCities,
}: {
  variant?: "full" | "compact";
  showCredentials?: boolean;
  showMuslimFriendly?: boolean;
  kicker?: string;
  heading?: string;
  description?: string;
  guideTitle?: string;
  guideCopy?: string;
  vehicleTitle?: string;
  vehicleCopy?: string;
  hotelTitle?: string;
  hotelCopy?: string;
  hotelCities?: string[];
} = {}) {
  const compact = variant === "compact";
  const t = useTranslations("journey");
  const lang = useLocale() as "en" | "zh";
  const driverGuideProof = getDriverGuideProof(lang);
  const proofTabs = [
    { id: "hotels", label: t("trustTabHotels") },
    { id: "vehicle", label: t("trustTabVehicle") },
    { id: "guide", label: t("trustTabGuide") },
  ] as const;
  const [activeId, setActiveId] = useState<(typeof proofTabs)[number]["id"]>("hotels");

  return <section className="journey-proof section section-sand" id={compact ? "local-team" : "private-journey"} aria-labelledby="private-journey-title">
    <div className="shell">
      <div className="journey-editorial-heading">
        {compact || !(kicker ?? t("trustKicker")) ? null : <span>{kicker ?? t("trustKicker")}</span>}
        <h2 id="private-journey-title">{compact ? t("trustHeadingCompact") : (heading || t("trustHeadingDefault"))}</h2>
        <p>{compact ? t("trustDescriptionCompact", { brand: brandIdentity.short, consultant: brandIdentity.consultant }) : (description || t("trustDescriptionDefault"))}</p>
      </div>
      <div className="proof-group-switch journey-proof-tabs" role="tablist" aria-label={t("trustTabsAria")}>
        {proofTabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={tab.id === activeId} onClick={() => setActiveId(tab.id)}>{tab.label}</button>)}
      </div>
      {activeId === "guide" ? <LocalTeamProof group={{ ...driverGuideProof, title: guideTitle || driverGuideProof.title, copy: guideCopy || driverGuideProof.copy }} /> : null}
      {activeId === "vehicle" ? <VehicleProof title={vehicleTitle} copy={vehicleCopy} /> : null}
      {activeId === "hotels" ? <HotelProof title={hotelTitle} copy={hotelCopy} cities={hotelCities} /> : null}
      {showCredentials ? <OperatorCredentials /> : null}
    </div>
    {compact || !showMuslimFriendly ? null : <MuslimFriendly />}
  </section>;
}
