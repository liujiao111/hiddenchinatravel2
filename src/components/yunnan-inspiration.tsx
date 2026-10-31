"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { yunnanPlaces } from "@/lib/yunnan-inspiration";
import { trackEvent } from "@/lib/analytics";
import { useJourneyInspiration } from "@/components/journey-inspiration-context";

export function YunnanInspiration({ selectable = false }: { selectable?: boolean }) {
  const { selected, toggle } = useJourneyInspiration();
  const t = useTranslations("inspiration");
  const placeCopy = t.raw("places") as Record<string, { name: string; alt: string; description: string }>;
  return <section className="section yunnan-inspiration" id="places"><div className="shell">
    <div className="journey-editorial-heading"><h2>{t("heading")}</h2><p>{t("sub")}</p></div>
    <div className="yunnan-inspiration-grid">{yunnanPlaces.map(place => {
      const name = placeCopy[place.id]?.name ?? place.name;
      const chosen = selected.includes(name);
      const guide = "guide" in place ? place.guide : "/china-destinations/yunnan#places";
      return <article key={place.id} className={chosen ? "is-selected" : ""}>
        <div className="yunnan-inspiration-image"><Image src={place.image} alt={placeCopy[place.id]?.alt ?? place.alt} fill unoptimized sizes="(max-width:700px) 50vw, (max-width:1000px) 50vw, 25vw" /></div>
        <div className="yunnan-inspiration-copy"><h3>{name}</h3><p>{placeCopy[place.id]?.description ?? place.description}</p><div className="yunnan-inspiration-actions">
          {selectable && <button type="button" aria-pressed={chosen} aria-label={chosen ? t("removeAria", { name }) : t("addAria", { name })} onClick={() => toggle(name)}>{chosen ? t("added") : t("add")}</button>}
          <Link href={guide} onClick={() => trackEvent("journey_place_guide_click", { destination: name, cta_location: "custom_inspiration" })}>{"guide" in place ? t("readGuide") : t("explore")}</Link>
        </div></div>
      </article>;
    })}</div>
    {selectable && <div className="yunnan-inspiration-next"><p role="status">{selected.length ? t("counter", { count: selected.length, names: selected.join(" · ") }) : t("counterEmpty")}</p><Link href="#plan" className="button journey-primary-action" onClick={() => trackEvent("journey_inspiration_plan", { selected_count: selected.length, cta_location: "custom_inspiration" })}>{selected.length ? t("planSelected") : t("planEmpty")}</Link><small>{t("nextNote")}</small></div>}
  </div></section>;
}
