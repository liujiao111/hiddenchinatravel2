import { muslimFriendly } from "@/lib/journey-trust";

export function MuslimFriendly() {
  return <section className="journey-muslim" id="muslim-friendly">
    <div className="shell">
      <header>
        <span>{muslimFriendly.kicker}</span>
        <h2>{muslimFriendly.title}</h2>
        <p>{muslimFriendly.copy}</p>
      </header>
      <div className="journey-muslim-grid">
        {muslimFriendly.points.map((point, index) => <article key={point.title}>
          <span>0{index + 1}</span>
          <h3>{point.title}</h3>
          <p>{point.detail}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
