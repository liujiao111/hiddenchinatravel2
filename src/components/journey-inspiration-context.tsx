"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

const InspirationContext = createContext<{ selected: string[]; toggle: (name: string) => void }>({ selected: [], toggle: () => {} });

export function JourneyInspirationProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(name: string) {
    const added = !selected.includes(name);
    setSelected(previous => added ? [...previous, name] : previous.filter(place => place !== name));
    trackEvent("journey_place_select", { destination: name, selected: added, cta_location: "custom_inspiration" });
  }
  return <InspirationContext.Provider value={{ selected, toggle }}>{children}</InspirationContext.Provider>;
}

export function useJourneyInspiration() { return useContext(InspirationContext); }

export function JourneyPlaceSelection() {
  const { selected, toggle } = useJourneyInspiration();
  if (!selected.length) return null;
  return <fieldset className="journey-selected-places"><legend>Places that interest you</legend><p>Included with your enquiry. These are ideas, not a confirmed route.</p><div>{selected.map(name => <button type="button" key={name} onClick={() => toggle(name)} aria-label={`Remove ${name}`}>{name}<span aria-hidden="true"> ×</span></button>)}</div></fieldset>;
}
