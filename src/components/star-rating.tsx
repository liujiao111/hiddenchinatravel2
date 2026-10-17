const starPath = "M10 1.6 12.5 7.2l6 .5-4.6 3.9 1.4 5.8L10 14.6 4.7 17.4l1.4-5.8L1.5 7.7l6-.5L10 1.6Z";

export function StarRating({ value, label }: { value: number; label?: string }) {
  const score = Math.round(value * 10) / 10;
  return <div className="star-rating" role="img" aria-label={label ?? `Rated ${score.toFixed(1)} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => {
      const fill = Math.max(0, Math.min(1, score - index));
      return <span className="star-rating-star" key={index}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d={starPath} /></svg>
        <svg className="is-filled" viewBox="0 0 20 20" aria-hidden="true" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}><path d={starPath} /></svg>
      </span>;
    })}
  </div>;
}
