export const driverDirectPrices: Record<string, { five: number; seven: number; routes?: string[] }> = {
  "dali-lijiang-direct": { five: 550, seven: 750, routes: ["Dali → Lijiang direct", "Lijiang → Dali direct"] },
  "dali-lijiang-shaxi": { five: 780, seven: 980, routes: ["Dali → Shaxi → Lijiang", "Lijiang → Shaxi → Dali"] },
  "lijiang-shangri-la": { five: 680, seven: 880, routes: ["Lijiang → Shangri-La", "Shangri-La → Lijiang"] },
  "lijiang-tlg-shangri-la": { five: 880, seven: 1080, routes: ["Lijiang → Tiger Leaping Gorge → Shangri-La"] },
  "dali-day": { five: 750, seven: 950 },
  "lijiang-day": { five: 780, seven: 980 },
  "shangri-la-day": { five: 850, seven: 1050 },
};
