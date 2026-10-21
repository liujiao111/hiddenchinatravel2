import { LocalTeamProof } from "@/components/local-team-proof";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { driverHostProof, licensedOperator, localGuideProof, optionalGuideProof } from "@/lib/journey-trust";

export type JourneyTrustService = "guide" | "driver-host" | "optional-guide";

export function JourneyTrustSection({
  variant = "full",
  service = "guide",
}: {
  variant?: "full" | "compact";
  service?: JourneyTrustService;
} = {}) {
  const compact = variant === "compact";
  const group = service === "driver-host" ? driverHostProof : service === "optional-guide" ? optionalGuideProof : localGuideProof;
  const heading = compact
    ? "The local team and licensed operator."
    : service === "driver-host"
      ? "Meet your driver-host and see the vehicles."
      : "Meet your guide and see the vehicles.";
  const intro = compact
    ? service === "optional-guide"
      ? `A driver-only or guided arrangement can be discussed. ${licensedOperator.nameEn} confirms what is included and operates the journey.`
      : `The same local team and private-vehicle options support these Yunnan journeys. ${licensedOperator.nameEn} confirms and operates the arrangements.`
    : service === "driver-host"
      ? `Joy shapes the plan with you. ${licensedOperator.nameEn} confirms the proposal, handles the travel contract and operates the journey. The driver-host and vehicle are confirmed in writing.`
      : `Joy shapes the plan with you. ${licensedOperator.nameEn} confirms the proposal, handles the travel contract and operates the journey. The guide and vehicle are confirmed in writing.`;

  return <section className="journey-proof section section-sand" id="local-team" aria-labelledby="local-team-title"><div className="shell">
    <div className="journey-editorial-heading">
      {compact ? null : <span>THE PEOPLE BEHIND YOUR JOURNEY</span>}
      <h2 id="local-team-title">{heading}</h2>
      <p>{intro}</p>
    </div>
    <LocalTeamProof group={group} />
    <VehicleProof />
    <OperatorCredentials />
  </div></section>;
}
