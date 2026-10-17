"use client";

import Image from "next/image";
import Link from "next/link";
import { yunnanPlaces } from "@/lib/yunnan-inspiration";
import { trackEvent } from "@/lib/analytics";
import { useJourneyInspiration } from "@/components/journey-inspiration-context";

export function YunnanInspiration({ selectable = false }: { selectable?: boolean }) {
  const { selected, toggle } = useJourneyInspiration();
  return <section className="section yunnan-inspiration" id="places"><div className="shell">
    <div className="journey-editorial-heading"><h2>Which side of Yunnan draws you in?</h2><p>Start with the places that catch your eye. We’ll help you connect them into a journey that fits your time and pace.</p></div>
    <div className="yunnan-inspiration-grid">{yunnanPlaces.map(place => {
      const chosen = selected.includes(place.name);
      const guide = "guide" in place ? place.guide : "/china-destinations/yunnan#places";
      return <article key={place.id} className={chosen ? "is-selected" : ""}>
        <div className="yunnan-inspiration-image"><Image src={place.image} alt={place.alt} fill unoptimized sizes="(max-width:700px) 50vw, (max-width:1000px) 50vw, 25vw" /></div>
        <div className="yunnan-inspiration-copy"><h3>{place.name}</h3><p>{place.description}</p><div className="yunnan-inspiration-actions">
          {selectable && <button type="button" aria-pressed={chosen} aria-label={`${chosen ? "Remove" : "Add"} ${place.name} ${chosen ? "from" : "to"} my trip`} onClick={() => toggle(place.name)}>{chosen ? "✓ Added to my trip" : "+ Add to my trip"}</button>}
          <Link href={guide} onClick={() => trackEvent("journey_place_guide_click", { destination: place.name, cta_location: "custom_inspiration" })}>{"guide" in place ? "Read the guide →" : "Explore Yunnan →"}</Link>
        </div></div>
      </article>;
    })}</div>
    {selectable && <div className="yunnan-inspiration-next"><p role="status">{selected.length ? `${selected.length} ${selected.length === 1 ? "place" : "places"} selected: ${selected.join(" · ")}` : "Pick a few favorites, or leave it open. We can suggest where to go."}</p><Link href="#plan" className="button journey-primary-action" onClick={() => trackEvent("journey_inspiration_plan", { selected_count: selected.length, cta_location: "custom_inspiration" })}>{selected.length ? "PLAN A TRIP WITH THESE PLACES →" : "HELP ME CHOOSE A ROUTE →"}</Link><small>You don’t need to fit every place into one trip. We’ll discuss travel time, season and a comfortable pace.</small></div>}
  </div></section>;
}
