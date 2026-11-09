import Image from "next/image";
import { driverGuideProof, vehicleProof, hotelProof } from "@/lib/journey-trust";

const examples = [
  {
    heading: "A local driver-guide",
    image: driverGuideProof.slides[0],
    description: "Jason is one example of the team's English-speaking driver-guides. Your guide drives, coordinates pickups and the route, and shares local context. A separate licensed site specialist is not automatically included. The named person and language are confirmed for your dates.",
  },
  {
    heading: "A vehicle matched to your party",
    image: vehicleProof.groups[0].slides[1],
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
        <h2 id="preview-real-proof-title">The People, Hotels &amp; Transport Behind Your Journey</h2>
        <p>Examples from our existing local team and travel arrangements—not promises of a particular person, property or vehicle.</p>
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
