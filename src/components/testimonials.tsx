"use client";

import { LocaleLink as Link } from "@/components/locale-link";
import { useEffect, useLayoutEffect, useRef, useState, type TransitionEvent } from "react";
import { useLocale } from "next-intl";
import { guestReviews } from "@/lib/guest-reviews";

export function Testimonials({ firstReview, showArchiveLink = true }: { firstReview?: string; showArchiveLink?: boolean }) {
  const zh = useLocale() === "zh";
  const first = guestReviews.find((review) => review.id === firstReview);
  const items = first ? [first, ...guestReviews.filter((review) => review !== first)] : guestReviews;
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

  return <section className="testimonials" id="stories">
    <header className="testimonials-heading shell">
      <p className="kicker">{zh ? "旅客故事" : "Traveler stories"}</p>
      <h2>{zh ? "旅客的云南旅行回忆" : "What Travelers Remember"}</h2>
    </header>
    <div className="testimonials-viewport" ref={viewportRef}>
      <div
        className={`testimonials-track${animate ? "" : " is-instant"}`}
        style={{
          gap: metrics.gap,
          transform: `translateX(${metrics.peek - index * (metrics.card + metrics.gap)}px)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((item, position) => (
          <figure className="testimonials-card" key={position + "-" + item.id} style={{ width: metrics.card, flexBasis: metrics.card }}>
            <blockquote>“{zh ? item.translation : item.quote}”</blockquote>
            <figcaption>
              <b>— {item.topic[zh ? 1 : 0]}</b>
              <span>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {item.source === "Trustpilot" ? "★★★★★ · Trustpilot" : item.source === "Email" && zh ? "邮件" : item.source}
                  {item.source === "Trustpilot" ? (zh ? " · 查看原评" : " · Read review") : (zh ? " · 查看截图" : " · View screenshot")}
                </a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
    <div className="testimonials-controls">
      <button type="button" className="testimonials-arrow" aria-label={zh ? "上一条评价" : "Previous review"} onClick={() => go(-1)}>‹</button>
      <div className="testimonials-progress" role="group" aria-label={zh ? "选择评价" : "Choose a review"}>
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={itemIndex === active}
            aria-label={item.topic[zh ? 1 : 0]}
            className={itemIndex === active ? "active" : ""}
            onClick={() => {
              setAnimate(false);
              setMoving(false);
              setIndex(cloneCount + itemIndex);
            }}
          />
        ))}
      </div>
      <button type="button" className="testimonials-arrow" aria-label={zh ? "下一条评价" : "Next review"} onClick={() => go(1)}>›</button>
    </div>
    {zh && <p className="testimonials-note">评价由英文原文翻译，点击卡片中的来源可查看原文。</p>}
    {showArchiveLink && <p className="testimonials-archive"><Link href="/traveler-stories">{zh ? "查看更多旅客故事" : "Read more traveler stories"}</Link></p>}
  </section>;
}
