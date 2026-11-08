"use client";

import { LocaleLink as Link } from "@/components/locale-link";
import { useEffect, useLayoutEffect, useRef, useState, type TransitionEvent } from "react";
import type { Testimonial } from "@/lib/testimonials";

type Props = {
  items: Testimonial[];
  heading: string;
  intro?: string;
  eyebrow?: string;
  note?: string;
  archiveHref?: string;
  archiveLabel?: string;
};

function cardQuote(quote: string) {
  const sentences = quote.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length === 0) return quote;
  const complete = sentences.map((sentence) => sentence.trim()).join(" ");
  // A finished note of at most three sentences still fits the card. Longer stories stay as a short excerpt.
  if (sentences.length <= 4 && complete.length <= 420) return complete;
  const first = sentences[0].trim();
  if (first.length > 210 || sentences.length === 1) return first;
  const two = `${first} ${sentences[1].trim()}`;
  if (two.length <= 320) return two;
  return first;
}

export function Testimonials({ items, heading, intro, eyebrow, note, archiveHref, archiveLabel }: Props) {
  const count = items.length;
  const loop = count > 3;
  // Three cards can be visible at desktop widths, so keep three clones on
  // either side to make both wrap directions continuous.
  const cloneCount = loop ? Math.min(3, count) : 0;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(cloneCount);
  const [animate, setAnimate] = useState(true);
  const [moving, setMoving] = useState(false);
  const [metrics, setMetrics] = useState({ card: 320, peek: 72, gap: 18 });

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const read = () => {
      const width = node.clientWidth;
      const visible = width <= 700 ? 1 : width <= 980 ? 2 : 3;
      const peek = width <= 700 ? width * 0.12 : width * 0.07;
      const gap = width <= 700 ? 12 : 18;
      const card = (width - peek * 2 - gap * Math.max(visible - 1, 0)) / visible;
      setMetrics({ card, peek, gap });
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (animate) return;
    const frame = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(frame);
  }, [animate, index]);

  if (count === 0) return null;

  const slides = loop
    ? [...items.slice(-cloneCount), ...items, ...items.slice(0, cloneCount)]
    : items;
  const active = loop ? ((index - cloneCount) % count + count) % count : index;

  const go = (delta: number) => {
    if (moving) return;
    setAnimate(true);
    setMoving(loop);
    setIndex((value) => loop ? value + delta : (value + delta + count) % count);
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!loop || !moving || event.target !== event.currentTarget) return;
    setMoving(false);
    if (index < cloneCount) {
      setAnimate(false);
      setIndex(index + count);
    } else if (index >= cloneCount + count) {
      setAnimate(false);
      setIndex(index - count);
    }
  };

  const headingBlock = <header className="testimonials-heading shell">
      {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
      <h2>{heading}</h2>
      {intro ? <p>{intro}</p> : null}
    </header>;
  const noteText = note ?? "Names may be shortened. Some notes were translated and edited for clarity.";
  const archive = archiveHref ? <p className="testimonials-archive"><Link href={archiveHref}>{archiveLabel ?? "Read the traveler stories"}</Link></p> : null;

  if (count <= 3) {
    return <section className="testimonials" id="stories">
      {headingBlock}
      <div className="testimonials-static shell">{items.map((item) => (
        <figure className="testimonials-card" key={item.id}>
          <blockquote>“{cardQuote(item.quote)}”</blockquote>
          <figcaption>
            <b>— {item.name}</b>
            <span>{item.country}</span>
          </figcaption>
        </figure>
      ))}</div>
      <p className="testimonials-note">{noteText}</p>
      {archive}
    </section>;
  }

  return <section className="testimonials" id="stories">
    {headingBlock}
    <div className="testimonials-viewport" ref={viewportRef}>
      <div
        className={`testimonials-track${animate ? "" : " is-instant"}`}
        style={{
          gap: metrics.gap,
          transform: `translateX(${metrics.peek - index * (metrics.card + metrics.gap)}px)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((item) => (
          <figure className="testimonials-card" key={item.id} style={{ width: metrics.card, flexBasis: metrics.card }}>
            <blockquote>“{cardQuote(item.quote)}”</blockquote>
            <figcaption>
              <b>— {item.name}</b>
              <span>{item.country}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
    <div className="testimonials-controls">
      <button type="button" className="testimonials-arrow" aria-label="Previous traveler story" onClick={() => go(-1)}>‹</button>
      <div className="testimonials-progress" role="tablist" aria-label="Traveler stories">
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={itemIndex === active}
            aria-label={`Show story from ${item.name}`}
            className={itemIndex === active ? "active" : ""}
            onClick={() => {
              setAnimate(false);
              setMoving(false);
              setIndex(cloneCount + itemIndex);
            }}
          />
        ))}
      </div>
      <button type="button" className="testimonials-arrow" aria-label="Next traveler story" onClick={() => go(1)}>›</button>
    </div>
    <p className="testimonials-note">{noteText}</p>
    {archive}
  </section>;
}
