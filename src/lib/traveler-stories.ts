import { getAllJourneys } from "@/lib/journeys";
import { licensedOperator } from "@/lib/journey-trust";
import { getAllTestimonials, type Testimonial } from "@/lib/testimonials";

export type StoryRole = "featured" | "detail" | "note";

export type StoryEditorial = {
  party: string;
  setting: string;
  noticed: string;
  context: string;
  image: string;
  imageAlt: string;
  objectPosition?: string;
};

export type TravelerStory = Testimonial & StoryEditorial & {
  role: StoryRole;
  journey?: { href: string; title: string; route: string; duration: string };
};

const featuredOrder = [
  "daniel-sarah-yunnan-family",
  "faisal-aisha-honeymoon",
  "mark-susan-tiger-leaping",
] as const;

const detailOrder = [
  "rachel-kevin-lisa",
  "emily-vegetarian",
  "claire-thomas-sebastien",
  "peter-jenny-eight-day",
] as const;

/**
 * Context under each note is a paraphrase of that traveler's own words.
 * Do not add sights, hotels, or outcomes the quote does not mention.
 */
const editorial: Record<string, StoryEditorial> = {
  "daniel-sarah-yunnan-family": {
    party: "A family, traveling with Joy again",
    setting: "Yunnan",
    noticed: "A short-notice change onto business class for the train, and a driver-guide who was easy to talk with the whole way.",
    context: "This was their second journey with Joy. What they describe is how little they had to organize: the scenery, the food, and a day that could still change when they decided to upgrade.",
    image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp",
    imageAlt: "A herder walking white goats along the river path in Shaxi, Yunnan",
    objectPosition: "center 62%",
  },
  "faisal-aisha-honeymoon": {
    party: "Newlyweds, with Yunnan as one chapter",
    setting: "Yunnan, inside a longer honeymoon",
    noticed: "Patient help with the Yunnan days, and advice for preparations and for the other places on their route.",
    context: "They did not need Yunnan to be the whole honeymoon. They needed someone patient with that chapter, and with the questions that come before a first trip to China.",
    image: "/assets/destinations/yunnan/lugu-lake.webp",
    imageAlt: "A quiet shoreline, pavilion and willows on Lugu Lake in northwest Yunnan",
    objectPosition: "center 86%",
  },
  "mark-susan-tiger-leaping": {
    party: "A couple on a private journey",
    setting: "Tiger Leaping Gorge",
    noticed: "Steady driving, time with ethnic minority cultures, and scenery they simply call beautiful.",
    context: "Their note is short and particular. A private journey, a gorge, minority cultures, and a driver-guide who was kind, patient, and looked after them properly.",
    image: "/assets/destinations/yunnan/tiger-leaping.webp",
    imageAlt: "Walkways cut into the rock above the Jinsha River at Tiger Leaping Gorge",
    objectPosition: "center 40%",
  },
  "rachel-kevin-lisa": {
    party: "Parents traveling with their young son",
    setting: "A first family journey in China",
    noticed: "A humorous, knowledgeable driver-guide, stories of Yunnan’s ethnic minorities, and meals that felt comfortable.",
    context: "It was their first time bringing their son to China. The memory they kept is the person in the car, and the stories the family wanted to hear.",
    image: "/assets/destinations/yunnan/erhai.webp",
    imageAlt: "A small boat on Erhai Lake, with the Cangshan mountains beyond",
    objectPosition: "center 55%",
  },
  "emily-vegetarian": {
    party: "A traveler who knows large landscapes",
    setting: "Yunnan, with a vegetarian table",
    noticed: "Days she did not have to schedule, and excellent vegetarian meals at a separate table.",
    context: "She came from British Columbia, already familiar with big scenery. What she wrote about was the table, and not having to manage the journey herself.",
    image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp",
    imageAlt: "Painted woodwork and tiled eaves of a Bai courtyard in Xizhou, near Dali",
    objectPosition: "center 30%",
  },
  "claire-thomas-sebastien": {
    party: "Traveling together",
    setting: "Before the journey, and on the road",
    noticed: "A team that was easy to reach, cautious and punctual driving, and hotels that were charming guesthouses or very comfortable.",
    context: "They write about the days before departure as well as the days in Yunnan. The driver-guide was professional, patient and funny. They recommend the hotels.",
    image: "/assets/destinations/yunnan/shuhe.webp",
    imageAlt: "A lived-in lane in Shuhe, Lijiang, with tiled roofs, banners and people passing",
    objectPosition: "center 40%",
  },
  "peter-jenny-eight-day": {
    party: "An eight-day private journey",
    setting: "Kunming, Dali, Lijiang and Shangri-La",
    noticed: "Days that felt happy and relaxed, in a region they say they fell in love with.",
    context: "They name the shape of the route themselves. The sentence they linger on is not a list of stops. It is how the days felt.",
    image: "/assets/destinations/yunnan/shangri-la.webp",
    imageAlt: "A still highland lake and forested hills near Shangri-La",
    objectPosition: "center 50%",
  },
  "tan-family-nine-day": {
    party: "A family",
    setting: "Shangri-La, Jade Dragon Snow Mountain and Yuhu Village",
    noticed: "Places they found stunning, and a moment with the trains that Joy sorted out.",
    context: "They name the places, and then the practical thing: the trains became hectic, and the planning held.",
    image: "/assets/destinations/yunnan/blue-moon.webp",
    imageAlt: "Blue Moon Valley and the clouded face of Jade Dragon Snow Mountain",
    objectPosition: "center 40%",
  },
  "michelle-lily-lijiang": {
    party: "A family in Lijiang",
    setting: "Lijiang",
    noticed: "A driver-guide she calls the best she has traveled with: professional, kind, flexible and calm, with excellent English.",
    context: "The note stays with one person. Her manner, Michelle writes, made the family feel at home.",
    image: "/assets/blog/yunnan-travel-from-malaysia/cover-lijiang-old-town.webp",
    imageAlt: "Wooden water wheels and flower stalls at the entrance to Lijiang Old Town",
    objectPosition: "center 50%",
  },
  "david-emma-jon": {
    party: "Parents traveling with children",
    setting: "A private Yunnan journey",
    noticed: "Patience from the driver-guide on days that were a bit stressful, and service that stayed dedicated.",
    context: "They are specific about what children do to the pace of a day, and about the person who did not rush them.",
    image: "/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp",
    imageAlt: "A musician playing guitar from a moored boat on the shore of Erhai Lake",
    objectPosition: "center 60%",
  },
};

export const travelerStoryReasons = [
  {
    title: "One person holds the plan",
    text: "Daniel and Sarah had already traveled with Joy once. Claire and Thomas could reach the team before the journey and during it. Faisal and Aisha describe the planning as patient. You speak with Joy Liu from the first note through the days on the road. The travel contract is then issued by the licensed agency in Kunming.",
  },
  {
    title: "The driver-guide is part of the day",
    text: "Rachel’s family heard stories of Yunnan’s ethnic minorities. Michelle describes a Lijiang driver-guide who was calm, flexible, and at home in English. Mark and Susan mention steady driving. David and Emma name the patience required with children. The person for your dates is confirmed in writing.",
  },
  {
    title: "The day is allowed to change",
    text: "Daniel and Sarah moved into business class at short notice. The Tan family had a hectic moment with the trains, and it was sorted. Emily’s meals were vegetarian, at a separate table, and still part of the same journey. A private party can adjust without waiting on a coach.",
  },
  {
    title: "What they remember is the feeling",
    text: "Peter and Jenny write that they felt happy and relaxed on an eight-day route from Kunming to Shangri-La, and that they fell in love with Yunnan. Claire and Thomas remember the hotels and the humor in the car. The planning is there so the day can be quiet enough to keep.",
  },
] as const;

export const routeGallery = [
  { src: "/assets/blog/where-to-stay-in-dali/cover-ancient-town-dusk.webp", alt: "Dali Ancient Town at dusk, with tiled roofs and lantern-lit streets", place: "Dali", caption: "Ancient town at dusk", span: "tall", position: "center 42%" },
  { src: "/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp", alt: "Goats and a herder on the river path in Shaxi", place: "Shaxi", caption: "The river path", span: "cell", position: "center 62%" },
  { src: "/assets/destinations/yunnan/erhai.webp", alt: "Erhai Lake and the Cangshan mountains, with a small boat offshore", place: "Dali", caption: "Erhai Lake", span: "cell", position: "center 58%" },
  { src: "/assets/destinations/yunnan/tiger-leaping.webp", alt: "The Jinsha River in Tiger Leaping Gorge", place: "Tiger Leaping Gorge", caption: "The gorge", span: "wide", position: "center 42%" },
  { src: "/assets/blog/yunnan-travel-from-australia/cover-lijiang-rooftops.webp", alt: "Grey tiled roofs of Lijiang Old Town under cloud", place: "Lijiang", caption: "Old-town roofs", span: "cell", position: "center 55%" },
  { src: "/assets/destinations/yunnan/shangri-la.webp", alt: "A highland lake surrounded by forest near Shangri-La", place: "Shangri-La", caption: "Highland water", span: "wide", position: "center 70%" },
  { src: "/assets/destinations/yunnan/shuhe.webp", alt: "A lane of tiled eaves in Shuhe Ancient Town", place: "Shuhe", caption: "A lane in Shuhe", span: "cell", position: "center 45%" },
  { src: "/assets/destinations/yunnan/lugu-lake.webp", alt: "Willows and a pavilion on the shore of Lugu Lake", place: "Lugu Lake", caption: "A quiet shore", span: "cell", position: "center 86%" },
  { src: "/assets/destinations/yunnan/blue-moon.webp", alt: "Turquoise pools of Blue Moon Valley beneath Jade Dragon Snow Mountain", place: "Jade Dragon", caption: "Blue Moon Valley", span: "cell", position: "center 48%" },
] as const;

export function openingLine(quote: string) {
  const match = quote.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : quote;
}

export function getTravelerStoryPage() {
  const journeys = new Map(getAllJourneys().map((journey) => [journey.slug, journey]));
  const featured = new Set<string>(featuredOrder);
  const detail = new Set<string>(detailOrder);

  const stories: TravelerStory[] = getAllTestimonials().map((item) => {
    const extra = editorial[item.id];
    if (!extra) throw new Error(`Missing traveler-story editorial for ${item.id}`);
    const slug = item.journeySlugs[0];
    const journey = slug ? journeys.get(slug) : undefined;
    const role: StoryRole = featured.has(item.id) ? "featured" : detail.has(item.id) ? "detail" : "note";
    return {
      ...item,
      ...extra,
      role,
      journey: journey
        ? {
            href: `/journeys/${journey.slug}`,
            title: journey.frontmatter.title,
            route: journey.frontmatter.route,
            duration: journey.frontmatter.duration,
          }
        : undefined,
    };
  });

  const byId = new Map(stories.map((story) => [story.id, story]));
  const pick = (ids: readonly string[]) => ids.flatMap((id) => {
    const story = byId.get(id);
    return story ? [story] : [];
  });

  return {
    stories,
    featured: pick(featuredOrder),
    detailed: pick(detailOrder),
    metrics: {
      notes: stories.length,
      countries: new Set(stories.map((story) => story.country)).size,
    },
    permit: licensedOperator.permitNumber,
    operatorName: licensedOperator.nameEn,
    operatorNameZh: licensedOperator.nameZh,
    registryHref: licensedOperator.creditRegistryUrl,
  };
}
