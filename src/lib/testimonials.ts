import testimonials from "../../content/testimonials.json";
import testimonialsZh from "../../content/testimonials.zh.json";

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

type TestimonialLocale = "en" | "zh";

const localizedTestimonials: Record<TestimonialLocale, Testimonial[]> = {
  en: testimonials as Testimonial[],
  zh: testimonialsZh as Testimonial[],
};

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

export function getAllTestimonials(locale: TestimonialLocale = "en") {
  return localizedTestimonials[locale];
}

export function getFeaturedTestimonials(locale: TestimonialLocale = "en") {
  return getAllTestimonials(locale).filter((item) => item.featured);
}

export function getSelectedTestimonials(locale: TestimonialLocale = "en") {
  const byId = new Map(getAllTestimonials(locale).map((item) => [item.id, item]));
  return selectedTestimonialIds.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

/** Reviews filed with one published journey. An empty list means this page should not borrow notes from another route. */
export function getTestimonialsForJourney(slug: string, locale: TestimonialLocale = "en") {
  return getAllTestimonials(locale).filter((item) => item.journeySlugs.includes(slug));
}

export function getHomeTestimonials(locale: TestimonialLocale = "en") {
  return getSelectedTestimonials(locale);
}
