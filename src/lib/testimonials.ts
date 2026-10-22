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

export const overallGuestRating = 4.8;
export const overallGuestRatingLabel = "4.8 out of 5 · Guest reviews";
export const overallGuestRatingHeading = "Rated 4.8 out of 5 by guests";
export const overallGuestRatingIntro = "These notes are from guests on private Yunnan routes we planned. They are not written about this one itinerary.";

export const selectedTestimonialsCopy = {
  eyebrow: "TRAVELER STORIES",
  heading: "What Travelers Remember",
  intro: "These stories come from previous guests who traveled different Yunnan routes with us. They are not written about one current itinerary.",
  note: "Guest names may be shortened. Some reviews were translated from another language and lightly edited for clarity, without changing their meaning.",
};

const allTestimonials = testimonials as Testimonial[];

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
