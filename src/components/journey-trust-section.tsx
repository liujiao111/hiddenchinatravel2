import { LocalTeamProof } from "@/components/local-team-proof";
import { OperatorCredentials } from "@/components/operator-credentials";
import { VehicleProof } from "@/components/vehicle-proof";
import { brandIdentity } from "@/lib/booking-terms";
import { driverGuideProof } from "@/lib/journey-trust";

export function JourneyTrustSection({
  variant = "full",
}: {
  variant?: "full" | "compact";
} = {}) {
  const compact = variant === "compact";

  return <section className="journey-proof section section-sand" id="local-team" aria-labelledby="local-team-title"><div className="shell">
    <div className="journey-editorial-heading">
      {compact ? null : <span>THE PEOPLE BEHIND YOUR JOURNEY</span>}
      <h2 id="local-team-title">{compact ? "The local team and licensed agency." : "Meet your driver-guide and see the vehicles."}</h2>
      <p>{brandIdentity.short} {brandIdentity.consultant} A driver-guide and vehicle are confirmed in writing.</p>
    </div>
    <LocalTeamProof group={driverGuideProof} />
    <VehicleProof />
    <OperatorCredentials />
  </div></section>;
}
