"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/locale-link";

type Season = {
  name: string;
  dates: string;
  description: string;
  headline: string;
  image: string;
  caption: string;
  alt: string;
};

/** Shared photographic guide: native buttons, keyboard tabs and one reading panel. */
export function EditorialSeasonGuide({ seasons, label, linkLabel }: {
  seasons: Season[];
  label: string;
  linkLabel: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  return <div className="editorial-season-guide">
    <div className="editorial-season-tabs" role="tablist" aria-label={label}>
      {seasons.map((season, index) => <button
        key={season.name}
        ref={(element) => { tabs.current[index] = element; }}
        type="button"
        role="tab"
        id={`${id}-tab-${index}`}
        aria-controls={`${id}-panel-${index}`}
        aria-selected={active === index}
        tabIndex={active === index ? 0 : -1}
        onClick={() => setActive(index)}
        onKeyDown={(event) => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % seasons.length;
          else if (event.key === "ArrowLeft") next = (index - 1 + seasons.length) % seasons.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = seasons.length - 1;
          else return;
          event.preventDefault();
          setActive(next);
          tabs.current[next]?.focus();
        }}
      ><span>{season.name}</span><small>{season.dates}</small></button>)}
    </div>
    {seasons.map((season, index) => <div
      key={season.name}
      className="editorial-season-panel"
      role="tabpanel"
      id={`${id}-panel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      hidden={active !== index}
      tabIndex={0}
    >
      <figure className="editorial-season-photo">
        <Image src={season.image} alt={season.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 60vw" />
        <figcaption>{season.caption}</figcaption>
      </figure>
      <div className="editorial-season-copy">
        <p className="kicker">{season.dates}</p>
        <h3>{season.headline}</h3>
        <p>{season.description}</p>
        <Link href="/best-time-to-visit-yunnan" className="button button-text">{linkLabel}<span aria-hidden="true">→</span></Link>
      </div>
    </div>)}
  </div>;
}
