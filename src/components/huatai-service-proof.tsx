import Image from "next/image";

const guides = [
  "/assets/partners/huatai/guide-portrait-01.jpg",
  "/assets/partners/huatai/guide-portrait-02.jpg",
  "/assets/partners/huatai/guide-portrait-03.jpg",
];

export function HuataiServiceProof() {
  return <section className="section section-sand" aria-labelledby="local-team-title">
    <div className="shell" style={{ display: "grid", gap: 34 }}>
      <div className="journey-editorial-heading" style={{ marginBottom: 0 }}>
        <span>YOUR LOCAL TEAM IN YUNNAN</span>
        <h2 id="local-team-title">Personal planning, backed by people on the ground.</h2>
        <p>Joy helps shape the journey and stays your point of contact. The trip itself is arranged and operated locally by Yunnan Huatai International Travel Service Co., Ltd.; its team confirms the final guide, vehicle, hotels and tickets in your written proposal.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <article style={{ background: "#fff", padding: 20 }}>
          <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", marginBottom: 16 }}><Image src="/assets/partners/huatai/vehicle-second-row.jpg" alt="Example second-row seating in a private vehicle arranged by the local partner" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized style={{ objectFit: "cover" }} /></div>
          <h3>Private vehicle & driver</h3><p>Your party travels by private vehicle. The final vehicle type is matched to group size and written into your proposal; this is an example of the seating standard available for the route.</p>
        </article>
        <article style={{ background: "#fff", padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>{guides.map((src, index) => <div key={src} style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden" }}><Image src={src} alt={index === 0 ? "A local guide from the operating partner's team" : ""} fill sizes="120px" unoptimized style={{ objectFit: "cover" }} /></div>)}</div>
          <h3>Guide matched to your group</h3><p>A Chinese- or English-speaking guide is included throughout this route. Your confirmed guide and language arrangement are provided before departure; other languages can be discussed in advance.</p>
        </article>
        <article style={{ background: "#fff", padding: 20 }}>
          <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", marginBottom: 16 }}><Image src="/assets/partners/huatai/vehicle-captain-seat.jpg" alt="Example captain seat in a private vehicle arranged by the local partner" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized style={{ objectFit: "cover" }} /></div>
          <h3>Clear written confirmation</h3><p>Before booking, the local partner confirms services, hotel room arrangement, vehicle, guide, tickets and payment terms in the written proposal and contract.</p>
        </article>
      </div>
    </div>
  </section>;
}
