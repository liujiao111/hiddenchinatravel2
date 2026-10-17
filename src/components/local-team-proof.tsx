import { ProofCarousel, type ProofSlide } from "@/components/proof-carousel";
import type { TrustCopy } from "@/lib/journey-trust";

export function LocalTeamProof({ group }: { group: TrustCopy & { label: string; slides: ProofSlide[] } }) {
  return <div className="journey-proof-grid">
    <div className="journey-proof-copy"><span>{group.kicker}</span><h3>{group.title}</h3><p>{group.copy}</p></div>
    <ProofCarousel label={group.label} slides={group.slides} variant="portrait" />
  </div>;
}
