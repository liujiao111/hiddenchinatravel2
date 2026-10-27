const planningSteps = [
  "Share your dates and travel ideas",
  "Joy reviews your plans personally",
  "Receive a customized itinerary draft",
  "Refine hotels, pace, and experiences together",
  "Confirm only when everything feels right",
] as const;

export function JourneyPlanningSteps() {
  return <section className="journey-planning" aria-labelledby="journey-planning-title">
    <div className="shell">
      <h2 id="journey-planning-title">How Planning Your Journey Works</h2>
      <ol>
        {planningSteps.map((step, index) => <li key={step}>
          <span>0{index + 1}</span>
          <p>{step}</p>
        </li>)}
      </ol>
      <p className="journey-planning-note">No obligation to book.<br />We&apos;re happy to explore ideas before you make any decisions.</p>
    </div>
  </section>;
}

export function JourneyCustomizeCallout({ href, location }: { href: string; location: string }) {
  return <aside className="journey-customize">
    <p>Like the overall route but want to adjust it?</p>
    <p>All Hidden China Travel journeys can be customized around your interests, schedule, hotel preferences, and budget.</p>
    <a href={href} data-cta-location={location}>Customize This Journey →</a>
  </aside>;
}
