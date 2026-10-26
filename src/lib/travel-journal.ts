export type TravelJournalSection = {
  heading: string;
  paragraphs: string[];
};

export type TravelJournalStory = {
  slug: string;
  category: "Travel Journal";
  featured: boolean;
  country: string;
  travelStyle: string;
  theme: string;
  readingTime: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  quote: string;
  sections: TravelJournalSection[];
  relatedPlaces: { title: string; href: string }[];
};

const stories: TravelJournalStory[] = [
  {
    slug: "finding-another-side-of-china-in-yunnan",
    category: "Travel Journal",
    featured: true,
    country: "Canada",
    travelStyle: "Independent Explorer",
    theme: "First Impressions of Yunnan",
    readingTime: "5 min",
    title: "Finding Another Side of China in Yunnan",
    subtitle: "After exploring some of China's most iconic cities, a Canadian traveler arrived in Kunming expecting one final stop. Instead, Yunnan became the beginning of an entirely new journey.",
    heroImage: "/assets/blog/kunming-travel-guide/cover-stone-forest.webp",
    heroImageAlt: "Weathered limestone pillars rise from the Stone Forest near Kunming, Yunnan",
    quote: "Yunnan wasn't the final destination of my China journey. In many ways, it was the beginning of my next one.",
    sections: [
      {
        heading: "Sometimes the final destination changes the entire story",
        paragraphs: [
          "By the time I reached Kunming, I thought I had a fairly clear picture of China. I had seen the places that appear on postcards and in guidebooks: monumental landmarks, busy streets and cities whose names I had known long before I arrived. Yunnan was meant to be the last chapter before moving on.",
          "Then the pace changed. The air felt different, the horizon opened, and the journey began to feel less like a sequence of famous places and more like an invitation to pay attention. Kunming was not simply another stop on the map. It was a threshold into a part of China I had not yet learned how to see."
        ]
      },
      {
        heading: "Where Stone Becomes Landscape",
        paragraphs: [
          "At the Stone Forest, the landscape seems to have been shaped by a different set of rules. Limestone towers rise from the earth in intricate clusters, some slender and sharp, others broad enough to feel almost architectural. Paths wind between them, revealing new shapes whenever the view changes.",
          "It is a place that rewards looking twice. From a distance, the formations become a single immense pattern; up close, every surface has its own lines, shadows and texture. The experience is not just about seeing an extraordinary landmark. It is about allowing enough time for the details to emerge."
        ]
      },
      {
        heading: "A Slower Rhythm",
        paragraphs: [
          "Travel in Yunnan can be measured in distances, but the more memorable measure is often time: a little longer over breakfast, an unhurried walk, a pause to watch daily life unfold. The province is large and its landscapes vary dramatically, so trying to fit everything into a single sweep can make the journey feel like a transfer between appointments.",
          "Leaving room between the highlights changes the texture of a trip. There is space to follow a curiosity, to stay when a place feels interesting, or to change the plan when the day suggests something better. For an independent traveler, that flexibility can be as valuable as any landmark."
        ]
      },
      {
        heading: "The Memories Nobody Plans For",
        paragraphs: [
          "The moments that stay with us are not always the ones we circled before departure. Sometimes they are small: the atmosphere of a street in the early evening, a view that appears around an unexpected bend, or the simple relief of having time to explore without watching the clock.",
          "These details rarely fit neatly into an itinerary. They are what an itinerary should make possible. Good planning creates a dependable frame for a journey, then leaves enough breathing room for the unplanned moments that give it character."
        ]
      },
      {
        heading: "Realising How Little I Had Seen",
        paragraphs: [
          "Yunnan did not make the places I had visited before feel less remarkable. It made my picture of China feel larger. Beyond the familiar skylines and headline sights was a region of dramatic geology, highland horizons, old towns and everyday rhythms that deserved more than a quick look.",
          "That was the unexpected lesson of arriving in Kunming with the trip nearly finished: a journey can be full of memorable places and still leave you newly curious. The feeling was not that I had completed China, but that I had found another reason to keep exploring it."
        ]
      },
      {
        heading: "A Reason To Return",
        paragraphs: [
          "Yunnan is not a destination that needs to be rushed into a checklist. Dali invites time beside the lake and in its old streets; Lijiang offers lanes and mountain views to wander between; the road towards Tiger Leaping Gorge and Shangri-La opens up a different scale of landscape. Each deserves its own pace, and not every journey needs to include them all.",
          "I arrived thinking Yunnan would be the end of my China story. I left with a route of possibilities in mind and the sense that the best next trip would be one with fewer assumptions, more time and room to follow the road a little further."
        ]
      }
    ],
    relatedPlaces: [
      { title: "Shangri-La", href: "/china-destinations/yunnan#shangri-la" },
      { title: "Tiger Leaping Gorge", href: "/china-destinations/yunnan#tiger-leaping-gorge" },
      { title: "Dali", href: "/china-destinations/yunnan#dali" },
      { title: "Lijiang", href: "/china-destinations/yunnan#lijiang" }
    ]
  }
];

export function getAllTravelJournalStories(): TravelJournalStory[] {
  return stories;
}

export function getTravelJournalStoryBySlug(slug: string): TravelJournalStory | undefined {
  return stories.find((story) => story.slug === slug);
}
