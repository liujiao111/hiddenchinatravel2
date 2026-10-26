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

export const selectedTestimonialsCopy = {
  eyebrow: "TRAVELER STORIES",
  heading: "What Travelers Remember",
  intro: "Notes from guests on private Yunnan journeys. The driver-guide for your dates is the person named in the proposal.",
  note: "Names may be shortened. Some notes were translated and edited for clarity.",
};

/** Representative reviews shown on every public traveler-stories module. */
const selectedTestimonialIds = [
  "daniel-sarah-yunnan-family",
  "rachel-kevin-lisa",
  "claire-thomas-sebastien",
  "mark-susan-tiger-leaping",
  "michelle-lily-lijiang",
] as const;

export function getAllTestimonials() {
  return allTestimonials;
}

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
