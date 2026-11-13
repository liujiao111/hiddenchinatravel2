import Image from "next/image";
import { vehicleProof, hotelProof } from "@/lib/journey-trust";

const examples = [
  {
    heading: "A vehicle matched to your party",
    image: vehicleProof.groups[0].slides[0],
    description: "Five-seat and seven-seat options are available, selected around your group and luggage. A seven-seat MPV is shown as an example, not a guaranteed brand or model. Your proposal confirms the arranged vehicle and daily driving plan; vehicles or drivers may change between cities.",
  },
  {
    heading: "Selected hotels, confirmed in writing",
    image: hotelProof.groups[1].slides[0],
    description: "Liuhe Yunyan in Dali is an example from our hotel options. We suggest comfortable, premium or characterful stays based on your route, dates and availability. Hotel names, room types and breakfasts are listed in the final proposal.",
  },
] as const;

export function CompactJourneyServiceProof() {
  return <section className="section preview-real-proof" aria-labelledby="preview-real-proof-title">
    <div className="shell">
      <div className="preview-heading">
        <p className="kicker">REAL LOCAL RESOURCES</p>
        <h2 id="preview-real-proof-title">Hotels &amp; Transport Examples for Your Journey</h2>
        <p>Vehicle and hotel images are illustrative examples; the licensed operator confirms the actual guide, hotel and transport in your proposal.</p>
      </div>
      <div className="preview-proof-grid">
        {examples.map(({ heading, image, description }) => <article key={heading} className="preview-proof-item">
          <div className="preview-proof-photo"><Image src={image.src} alt={image.alt} fill sizes="(max-width:700px) 92vw, 32vw" /></div>
          <div className="preview-proof-copy"><span>{image.detail}</span><h3>{heading}</h3><p>{description}</p></div>
        </article>)}
      </div>
      <p className="preview-proof-caveat">Services, guide language, hotel names, vehicle class and any included attraction tickets are specified in your written quotation before booking.</p>
    </div>
  </section>;
}
