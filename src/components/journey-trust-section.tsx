import { LocalTeamProof } from "@/components/local-team-proof";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { licensedOperator, localGuideProof } from "@/lib/journey-trust";

export function JourneyTrustSection({ variant = "full" }: { variant?: "full" | "compact" } = {}) {
  const compact = variant === "compact";
  return <section className="journey-proof section section-sand" id="local-team" aria-labelledby="local-team-title"><div className="shell">
    <div className="journey-editorial-heading">
      {compact ? null : <span>THE PEOPLE BEHIND YOUR JOURNEY</span>}
      <h2 id="local-team-title">{compact ? "Guides, vehicles and the licensed operator." : "Meet your guide and see the vehicles."}</h2>
      <p>{compact ? `The same guide team and private-vehicle options support these Yunnan journeys. ${licensedOperator.nameEn} confirms and operates the arrangements.` : `Joy shapes the plan with you. ${licensedOperator.nameEn} confirms the proposal, handles the travel contract and operates the journey. The guide and vehicle are confirmed in writing.`}</p>
    </div>
    <LocalTeamProof group={localGuideProof} />
    <VehicleProof />
    <OperatorCredentials />
  </div></section>;
}
