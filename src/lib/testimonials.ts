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
export const overallGuestRatingLabel = "4.8 · From guest reviews";

const allTestimonials = testimonials as Testimonial[];
const homeTestimonialIds = [
  "daniel-sarah-yunnan-family",
  "rachel-kevin-lisa",
  "claire-thomas-sebastien",
] as const;

export function getFeaturedTestimonials() {
  return allTestimonials.filter((item) => item.featured);
}

export function getHomeTestimonials() {
  const byId = new Map(allTestimonials.map((item) => [item.id, item]));
  return homeTestimonialIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

export function getTestimonialsForJourney(slug: string) {
  const matched = allTestimonials.filter((item) => item.journeySlugs.includes(slug));
  return matched.length > 0 ? matched : getFeaturedTestimonials();
}
