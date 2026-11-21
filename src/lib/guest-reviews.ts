type GuestReview = {
  id: string;
  topic: [string, string];
  quote: string;
  translation: string;
  source: "Trustpilot" | "WhatsApp" | "Email";
  href: string;
};

export const guestReviews: GuestReview[] = [
  {
    id: "six-day-yunnan",
    topic: ["Six days in Yunnan", "云南六日游"],
    quote: "The itinerary was well paced, covering Kunming, Dali and Lijiang without feeling rushed.",
    translation: "行程节奏安排得很好，走了昆明、大理和丽江，也没有觉得赶。",
    source: "Trustpilot",
    href: "https://www.trustpilot.com/reviews/6af401bf984a3b19f3520289",
  },
  {
    id: "lijiang-family",
    topic: ["A family trip to Lijiang", "丽江家庭游"],
    quote: "Our driver-guide was genuinely one of the best guides I’ve ever travelled with.",
    translation: "我们的司机兼导游，真的是我旅行中遇到过的最好的导游之一。",
    source: "Trustpilot",
    href: "https://www.trustpilot.com/reviews/6af7e54f65e6efb74bf60a38",
  },
  {
    id: "recommendation",
    topic: ["Recommending the trip", "推荐给朋友"],
    quote: "I’ll gladly recommend your tour to my friends. Your service is very awesome.",
    translation: "我很乐意把你们的行程推荐给朋友。你们的服务太棒了。",
    source: "WhatsApp",
    href: "/assets/guest-reviews/recommendation.webp",
  },
  {
    id: "stone-forest",
    topic: ["Visiting the Stone Forest", "石林游览"],
    quote: "Stone forest is so beautiful. Everything went so smoothly and well",
    translation: "石林太美了，一切都很顺利。",
    source: "WhatsApp",
    href: "/assets/guest-reviews/stone-forest.webp",
  },
  {
    id: "trip-planning",
    topic: ["Planning the trip", "行前沟通"],
    quote: "Just want to tell you that I really appreciate your service!",
    translation: "就是想告诉你，我真的很感谢你们的服务！",
    source: "Email",
    href: "/assets/guest-reviews/trip-planning.webp",
  },
];
