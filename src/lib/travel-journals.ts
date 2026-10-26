export type JournalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type JournalPlace = {
  title: string;
  href: string;
  image: string;
  alt: string;
  note: string;
  position?: string;
};

export type TravelJournal = {
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
  heroAlt: string;
  pullQuote: string;
  pullQuoteAfter: string;
  sections: JournalSection[];
  related: JournalPlace[];
};

const stoneForest = "/assets/blog/kunming-travel-guide/cover-stone-forest.webp";

export const travelJournals: TravelJournal[] = [
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
    heroImage: stoneForest,
    heroAlt: "Karst pinnacles of the Stone Forest reflected in a still pool near Kunming",
    pullQuote: "Yunnan wasn't the final destination of my China journey. In many ways, it was the beginning of my next one.",
    pullQuoteAfter: "slower-rhythm",
    sections: [
      {
        id: "final-destination",
        title: "Sometimes the final destination changes the entire story",
        paragraphs: [
          "I had already walked the cities people name first. Beijing in a cold morning, large enough to make a person feel newly arrived all over again. Shanghai along the river, bright and sure of itself. Xi’an, where the past is set out for you to move through. By the time the journey turned south, Kunming was meant to be a gentle last page: one more night, then the flight home to Canada.",
          "Yunnan was not in my mind as a place to understand. Among travelers who have only changed planes there, Kunming has a practical reputation. A gateway. A city between other cities. I gave it a single evening in my plans and was already thinking about the return.",
          "The city did not argue. The air was milder than I had prepared for. People were out. Supper was happening on ordinary streets, without any interest in being a sight. I went to sleep believing I had reached the end of a trip. The next morning, the province began to undo that idea.",
        ],
      },
      {
        id: "stone-landscape",
        title: "Where Stone Becomes Landscape",
        paragraphs: [
          "The Stone Forest is easy to file away before you see it. The name sounds like a poem until the ground rises into blades and towers, close enough to touch, tall enough to lose the path between them. Grey karst, weathered into points. A pool so still that the same stones continue downward, root and reflection.",
          "I had spent days looking up at what people had built: walls, halls, a skyline arranged to be remembered. Here nothing had been arranged. The pleasure was a narrow passage, then a sudden opening, then a tree that had decided a crack in the rock was soil enough. I stopped collecting viewpoints. The landscape was doing the speaking.",
          "Standing at the water, I understood why a last stop can refuse to stay last. The famous cities had given me a China I could describe at a dinner table. The stones offered a China that would not fit the description.",
        ],
      },
      {
        id: "slower-rhythm",
        title: "A Slower Rhythm",
        paragraphs: [
          "What changed was the speed. In the big cities I had been efficient, and efficiency had felt like the point. In Yunnan the day loosened. A walk took the time it took. Tea was no longer a pause between two tickets. Late light stayed on the water, and nobody seemed to require an apology for remaining in it.",
          "I began to leave the afternoons partly empty. It is a small decision. It altered the journey more than another famous gate would have. The province asked for a different kind of attention: how long I was willing to stay with one place, one weather, one street after the errand was finished.",
          "Kunming’s lakeside hour, the road east toward the stone, the sense that a province this large cannot be crossed in the spirit of a checklist. I had come to complete a route. I was being invited to inhabit one.",
        ],
      },
      {
        id: "unplanned-memories",
        title: "The Memories Nobody Plans For",
        paragraphs: [
          "The minutes I still describe are the ones I would never have written into an itinerary. Rain on warm stone. The particular green of the trees against grey pinnacles. A clumsy attempt to pay for fruit, slowed down by a stranger until the exchange worked, and then a laugh that belonged to both of us. None of it was a scene I had come to collect.",
          "From a window on the way back, red earth and long rows of trees. A conversation that never became an anecdote with a moral. It simply occurred, and I was glad to be inside it. I had prepared myself for monuments. I left holding ordinary minutes, which have proved harder to forget.",
          "That is the private luxury of a place that is not performing for you. The memory is allowed to be small. A pool. A path. The decision to sit a little longer than the schedule suggested.",
        ],
      },
      {
        id: "how-little",
        title: "Realising How Little I Had Seen",
        paragraphs: [
          "On the return toward the city I tried to name what I had done in China. The great cities were still intact, and they still mattered. They were not diminished. They were no longer the whole country. A week is not a province, and a handful of famous days is not a civilisation.",
          "Yunnan had set those days beside something older and less interested in being summarised. A landscape of stone. A lake basin with its own weather. Towns that keep their own hour. Languages and tables I had not known to ask about before I arrived. I had crossed a great deal of ground and understood a narrow strip of it.",
          "The realisation was uncomfortable for a moment. Then it became the most generous feeling of the trip. There was more. The map I had been so proud to finish was only an entrance.",
        ],
      },
      {
        id: "reason-to-return",
        title: "A Reason To Return",
        paragraphs: [
          "I still have not given the gorge a proper day, or Shangri-La the patience the altitude requires. Dali and the lake I have only begun to imagine from other travelers’ quiet descriptions. Lijiang, and the mountain weather behind it, remain ahead of me. That is not a failure of the journey I took. It is the shape Yunnan left in its place.",
          "If I return, I will not pin the province to the end of another city itinerary and hope for a soft landing. I will start here. Fewer places. Longer days. Room for the hour that does not announce itself.",
          "The last name on my list became the first place I want to know. That is the other side of China I had not been shown: a landscape that does not hurry you toward a conclusion, and a reason to come back that has nothing to do with finishing.",
        ],
      },
    ],
    related: [
      {
        title: "Shangri-La",
        href: "/shangri-la-travel-guide",
        image: "/assets/destinations/yunnan/shangri-la.webp",
        alt: "A highland lake and forested hills near Shangri-La",
        note: "High country, and the days the altitude asks for",
        position: "center 78%",
      },
      {
        title: "Tiger Leaping Gorge",
        href: "/journeys/kunming-dali-lijiang-shangri-la-private-tour",
        image: "/assets/destinations/yunnan/tiger-leaping.webp",
        alt: "The Jinsha River cutting through Tiger Leaping Gorge",
        note: "A gorge day on the Essence of Yunnan route",
      },
      {
        title: "Dali",
        href: "/dali-travel-guide",
        image: "/assets/destinations/yunnan/dali.webp",
        alt: "Dali Ancient Town beneath the Cangshan mountains",
        note: "The lake basin, and a gentler pace",
      },
      {
        title: "Lijiang",
        href: "/lijiang-travel-guide",
        image: "/assets/destinations/yunnan/lijiang.webp",
        alt: "Grey tiled roofs of Lijiang Old Town with mountains beyond",
        note: "Old streets, with Jade Dragon close by",
      },
    ],
  },
];

export function getTravelJournals() {
  return travelJournals;
}

export function getFeaturedJournals() {
  return travelJournals.filter((journal) => journal.featured);
}

export function getTravelJournal(slug: string) {
  return travelJournals.find((journal) => journal.slug === slug);
}
