"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type JourneyGallerySlide = {
  src: string;
  alt: string;
};

export function JourneyGallery({ slides }: { slides: JourneyGallerySlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className="journey-gallery"
      aria-labelledby="journey-gallery-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="shell">
        <div className="journey-gallery-heading">
          <div>
            <span>YUNNAN, IN MOMENTS</span>
            <h2 id="journey-gallery-title">A glimpse of the journey</h2>
          </div>
          <p aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
        </div>

        <div className="journey-gallery-viewport">
          <div
            className="journey-gallery-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <figure key={`${slide.src}-${index}`} aria-hidden={index !== activeIndex}>
                <Image
                  src={slide.src}
                  alt={index === activeIndex ? slide.alt : ""}
                  fill
                  sizes="(max-width: 700px) 100vw, 90vw"
                  unoptimized
                />
              </figure>
            ))}
          </div>

          {slides.length > 1 ? (
            <div className="journey-gallery-arrows">
              <button type="button" onClick={showPrevious} aria-label="Show previous journey photo">←</button>
              <button type="button" onClick={showNext} aria-label="Show next journey photo">→</button>
            </div>
          ) : null}
        </div>

        {slides.length > 1 ? (
          <div className="journey-gallery-dots" aria-label="Choose a journey photo">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-dot-${index}`}
                type="button"
                className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
