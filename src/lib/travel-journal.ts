export type TravelJournalSection = { heading: string; paragraphs: string[] };
export type TravelJournalStory = {
  slug: string; category: "Travel Journal"; featured: boolean; country: string;
  traveler: string; travelStyle: string; firstVisit: string; theme: string; readingTime: string;
  title: string; subtitle: string; heroImage: string; heroImageAlt: string;
  route: string[]; quote: string; sections: TravelJournalSection[];
  relatedPlaces: { title: string; href: string }[];
};
const stories: TravelJournalStory[] = [{
  slug: "finding-another-side-of-china-in-yunnan",
  category: "Travel Journal", featured: true, country: "Canada", traveler: "Matthew",
  travelStyle: "Independent Explorer", firstVisit: "First Visit to China",
  theme: "First Impressions of Yunnan", readingTime: "5 min",
  title: "From China's Cities to Yunnan's Landscapes",
  subtitle: "How We Designed a Journey That Changed One Traveler's View of China",
  heroImage: "/assets/blog/kunming-travel-guide/cover-stone-forest.webp",
  heroImageAlt: "Limestone pillars and winding paths at the Stone Forest near Kunming, Yunnan",
  route: ["Kunming", "Stone Forest", "Dali", "Lijiang"],
  quote: "It felt like walking through another world.",
  sections: [
    { heading: "Sometimes the Best Journeys Begin Before the Flight", paragraphs: [
      "When Matthew first contacted Hidden China, he was already halfway through a three-week journey across China.",
      "Over the previous weeks, he had explored Shanghai, Suzhou, Nanjing and Wuhan independently. He had experienced China's modern cities, historic neighbourhoods and iconic landmarks.",
      "His request sounded simple: “I've seen China's cities. Before flying home, I'd like to experience a different side of China.”",
      "That single sentence became the foundation of everything that followed.",
      "Rather than immediately discussing hotels and attractions, we started by understanding how he likes to travel. Through several conversations, we learned that he wasn't interested in checking off famous sights as quickly as possible. He enjoyed photography, unusual landscapes, local culture and slower travel experiences. Most importantly, he wanted places that felt genuinely different from the China he had already seen.",
      "For us, that pointed naturally towards Yunnan."
    ]},
    { heading: "Planning Begins Long Before Arrival", paragraphs: [
      "One thing many travelers don't realise is that a great journey often starts before boarding the plane.",
      "Because Matthew was visiting China for the first time, we prepared a personalised pre-departure guide and sent it a week before his flight. The guide included recommended travel apps, eSIM setup instructions, VPN recommendations, mobile payment preparation, transportation tips and practical advice for navigating China smoothly.",
      "These details may seem small, but they remove much of the uncertainty first-time visitors often experience.",
      "Our goal was simple: spend less time solving logistical problems, and more time enjoying the journey."
    ]},
    { heading: "A Map Designed Around the Journey", paragraphs: [
      "Before arriving in Yunnan, Matthew also received a custom-designed travel map. Rather than simply sending an itinerary document, we wanted him to visualise how the journey would unfold.",
      "The map connected every destination, travel day and major experience. What looks like four destinations on paper becomes a travel story when viewed on a map.",
      "Kunming introduced Yunnan. Stone Forest revealed its geology. Dali slowed the pace. Lijiang opened the door to the mountains of northwestern Yunnan.",
      "The map helped transform individual places into a meaningful journey. Months later, Matthew told us it became one of the resources he referred back to most often during the trip."
    ]},
    { heading: "Why We Didn't Recommend Staying Only in Kunming", paragraphs: [
      "Many first-time visitors assume Kunming and Yunnan are essentially the same thing. They aren't.",
      "Kunming is a wonderful city, but it's also a gateway. The real magic of Yunnan lies in how dramatically the landscapes, cultures and atmosphere change as you move across the province.",
      "Based on Matthew's interests, we recommended a route that gradually revealed those contrasts: Kunming → Stone Forest → Dali → Lijiang.",
      "Rather than overwhelming him with too much too quickly, every destination was chosen to build upon the previous one. Our objective wasn't simply to show him more places. It was to create a growing sense of discovery."
    ]},
    { heading: "The Moment Yunnan Became Real", paragraphs: [
      "The first major turning point came at Stone Forest. Before arriving, Matthew had seen photographs online. What he didn't expect was the scale.",
      "Walking among towering limestone formations felt less like visiting a scenic attraction and more like stepping into another landscape entirely. The pathways twisted between massive stone pillars. Every turn revealed new shapes and perspectives. Hours passed without him noticing.",
      "Later he would tell us: “It felt like walking through another world.”",
      "As travel designers, these are the moments we look for. Not simply beautiful places, but places capable of changing expectations."
    ]},
    { heading: "Slowing Down in Dali", paragraphs: [
      "By the time Matthew arrived in Dali, the journey had already begun to shift. For weeks he had moved between major cities, airports, train stations and urban environments. Dali provided a pause.",
      "Instead of filling every hour with sightseeing, we intentionally built space into the itinerary. Time to cycle near Erhai Lake. Time to wander through villages. Time to sit in a lakeside café and watch life pass by.",
      "Many travelers initially underestimate these slower moments. Yet they often become the memories people treasure most when they return home.",
      "Dali wasn't designed as another stop. It was designed as a change of rhythm."
    ]},
    { heading: "“This Doesn't Feel Like the China I Expected.”", paragraphs: [
      "When Matthew reached Lijiang, he sent us a message: “Honestly, this doesn't feel like the China I expected.”",
      "We've heard similar words many times. For many international travelers, China is associated with megacities, skyscrapers and rapid development. Yunnan offers a different perspective: snow-capped mountains, ancient towns, minority cultures, open landscapes and a slower relationship with time.",
      "That contrast is often what makes Yunnan the most memorable part of a wider China journey."
    ]},
    { heading: "The Best Travel Memories Are Rarely Planned", paragraphs: [
      "Ironically, one of Matthew's favourite stories had nothing to do with the itinerary. While visiting Kunming Zoo, a curious monkey suddenly jumped onto him.",
      "The encounter lasted only a few seconds. But months later, it remained one of the stories he told most often.",
      "It's a reminder of something we strongly believe. The purpose of a well-designed itinerary is not to control every moment. It's to create space for moments that cannot be planned.",
      "Because the most memorable parts of a journey are often the ones nobody expected."
    ]},
    { heading: "Looking Back", paragraphs: [
      "After returning home, Matthew shared photos from Yunnan online. What followed was revealing. Instead of commenting on where he had been, people focused on where he hadn't gone: Shangri-La, Tiger Leaping Gorge, Yubeng and Meili Snow Mountain.",
      "Again and again, the same message appeared: “You've only just started discovering Yunnan.”",
      "Perhaps that's exactly why so many travelers fall in love with this region. The first visit rarely feels complete. It feels like an introduction."
    ]},
    { heading: "Our Reflection", paragraphs: [
      "When we designed Matthew's journey, the objective wasn't to show him more attractions. It was to reveal a different side of China: a side defined by landscapes, slower travel, personal discovery and a deeper connection to place.",
      "Looking back, that's exactly what happened.",
      "And that's why we believe custom travel matters. Not because every itinerary should be unique, but because every traveler already is."
    ]}
  ],
  relatedPlaces: [
    { title: "Shangri-La", href: "/china-destinations/yunnan#shangri-la" },
    { title: "Tiger Leaping Gorge", href: "/china-destinations/yunnan#tiger-leaping-gorge" },
    { title: "Dali", href: "/china-destinations/yunnan#dali" },
    { title: "Lijiang", href: "/china-destinations/yunnan#lijiang" }
  ]
}];
export function getAllTravelJournalStories(): TravelJournalStory[] { return stories; }
export function getTravelJournalStoryBySlug(slug: string): TravelJournalStory | undefined {
  return stories.find((story) => story.slug === slug);
}
