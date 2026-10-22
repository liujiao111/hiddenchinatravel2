import testimonials from "../../content/testimonials.json";

export type Testimonial = {
  id: string;
  title: string;
  quote: string;
  name: string;
  country: string;
  journeySlugs: string[];
  featured: boolean;
  rating: number;
};

const allTestimonials = testimonials as Testimonial[];

export const overallGuestRating = 4.8;
export const guestReviewCount = allTestimonials.length;
export const overallGuestRatingLabel = `${overallGuestRating} out of 5 · ${guestReviewCount} guest reviews`;
export const overallGuestRatingHeading = `Rated ${overallGuestRating} out of 5 by ${guestReviewCount} guests`;
export const overallGuestRatingIntro = `${guestReviewCount} guest notes from our private Yunnan journeys, this route included.`;

export const selectedTestimonialsCopy = {
  eyebrow: "TRAVELER STORIES",
  heading: "What Travelers Remember",
  intro: "From guests on private Yunnan journeys we have planned, this route included.",
  note: "Guest names may be shortened. Some reviews were translated from another language and lightly edited for clarity, without changing their meaning.",
};

/** Representative reviews shown on every public traveler-stories module. */
const selectedTestimonialIds = [
  "daniel-sarah-yunnan-family",
  "rachel-kevin-lisa",
  "claire-thomas-sebastien",
  "mark-susan-tiger-leaping",
  "michelle-lily-lijiang",
] as const;

export function getFeaturedTestimonials() {
  return allTestimonials.filter((item) => item.featured);
}

export function getSelectedTestimonials() {
  const byId = new Map(allTestimonials.map((item) => [item.id, item]));
  return selectedTestimonialIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export function getHomeTestimonials() {
  return getSelectedTestimonials();
}
