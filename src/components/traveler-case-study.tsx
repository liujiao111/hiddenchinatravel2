import Image from "next/image";
import type { ReactNode } from "react";
import type { CaseStudyEvidenceKind, TravelerCaseStudy } from "@/lib/traveler-case-study";
import styles from "./traveler-case-study.module.css";

function EvidenceIcon({ kind }: { kind: CaseStudyEvidenceKind }) {
  if (kind === "map") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 16l16-6 16 6 16-6v38l-16 6-16-6-16 6z" /><path d="M24 10v38M40 16v38" /></svg>;
  }
  if (kind === "whatsapp") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 14h40v28H28l-10 8v-8H12z" /><path d="M22 26h20M22 34h12" /></svg>;
  }
  if (kind === "itinerary") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 8h22l10 10v38H18z" /><path d="M40 8v10h10M26 30h16M26 38h16M26 46h10" /></svg>;
  }
  return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="10" /><path d="M14 54c2-10 10-14 18-14s16 4 18 14" /></svg>;
}

function SupportList({ items }: { items: string[] }) {
  return <ul className={styles.checks}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function TravelerCaseStudy({ study, narrative }: { study: TravelerCaseStudy; narrative: ReactNode }) {
  const { snapshot } = study;

  return <>
    <section className={styles.snapshot} id="trip-snapshot" aria-labelledby="trip-snapshot-title">
      <h2 id="trip-snapshot-title">Trip snapshot</h2>
      <dl className={styles.facts}>
        <div><dt>Traveler</dt><dd>{snapshot.traveler}, {snapshot.country}</dd></div>
        <div><dt>Travel style</dt><dd>{snapshot.travelStyle}</dd></div>
        <div><dt>Trip length</dt><dd>{snapshot.duration}</dd></div>
        <div><dt>Travel month</dt><dd>{snapshot.travelMonth}</dd></div>
      </dl>
      <div className={styles.route}>
        <p>Route</p>
        <ol className={styles.stops}>
          {snapshot.route.map((stop) => <li key={stop}>{stop}</li>)}
        </ol>
      </div>
      <div className={styles.support}>
        <p>Planning support provided</p>
        <SupportList items={snapshot.support} />
      </div>
    </section>

    <section className={styles.before} id="before-the-trip" aria-labelledby="before-the-trip-title">
      <h2 id="before-the-trip-title">Before the trip</h2>
      {study.beforeTrip.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {study.beforeTrip.quote ? <blockquote className={styles.quote}>{study.beforeTrip.quote}</blockquote> : null}
    </section>

    <section className={styles.planning} id="how-we-planned" aria-labelledby="how-we-planned-title">
      <div className={styles.planningInner}>
        <h2 id="how-we-planned-title">How Hidden China Travel planned the journey</h2>
        <p className={styles.planningIntro}>{study.planning.intro}</p>
        {study.planning.image ? (
          <figure className={styles.planningFigure}>
            <Image src={study.planning.image.src} alt={study.planning.image.alt} fill sizes="(max-width: 800px) 100vw, 980px" style={{ objectPosition: study.planning.image.position ?? "center 50%" }} />
          </figure>
        ) : null}
        <div className={styles.steps}>
          {study.planning.steps.map((step, index) => (
            <article className={styles.step} key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className={styles.evidence} id="evidence" aria-labelledby="evidence-title">
      <h2 id="evidence-title">From the planning file</h2>
      <div className={styles.evidenceGrid}>
        {study.evidence.map((item) => (
          <figure key={item.kind}>
            <div className={styles.sheet}>
              <EvidenceIcon kind={item.kind} />
              <small>Placeholder</small>
            </div>
            <figcaption>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section className={styles.journeyLead} id="the-journey" aria-labelledby="the-journey-title">
      <h2 id="the-journey-title">The journey</h2>
      <p>{study.journeyIntro}</p>
    </section>
    {narrative}

    <section className={styles.changed} id="what-changed" aria-labelledby="what-changed-title">
      <h2 id="what-changed-title">What changed</h2>
      <div className={styles.changedGrid}>
        <article>
          <h3>Before</h3>
          <ul>{study.whatChanged.before.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className={styles.after}>
          <h3>After</h3>
          <ul>{study.whatChanged.after.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>
    </section>

    <section className={styles.received} id="planning-support" aria-labelledby="planning-support-title">
      <h2 id="planning-support-title">Planning support received</h2>
      <p>These are the pieces prepared for this journey. The list matches the snapshot above, and it stops where the record stops.</p>
      <div className={styles.support}>
        <p>Included</p>
        <SupportList items={snapshot.support} />
      </div>
    </section>
  </>;
}
