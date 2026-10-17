export function StarRating({ label = "Rated 5 out of 5 stars" }: { label?: string }) {
  return <div className="star-rating" role="img" aria-label={label}>
    {Array.from({ length: 5 }, (_, index) => <svg key={index} viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.6 12.5 7.2l6 .5-4.6 3.9 1.4 5.8L10 14.6 4.7 17.4l1.4-5.8L1.5 7.7l6-.5L10 1.6Z" /></svg>)}
  </div>;
}
