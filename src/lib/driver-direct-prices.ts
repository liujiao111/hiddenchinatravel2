// Only confirmed five-seat standard-route prices are eligible for direct checkout.
// Seven-seat vehicles and route variants require a written quote until separately confirmed.
export const driverDirectPrices: Record<string, { five?: number; seven?: number; routes?: string[] }> = {
  "dali-lijiang-direct": { five: 500, routes: ["Dali → Lijiang direct", "Lijiang → Dali direct"] },
  "dali-lijiang-shaxi": { five: 500, routes: ["Dali → Shaxi → Lijiang", "Lijiang → Shaxi → Dali"] },
  "lijiang-shangri-la": { five: 500, routes: ["Lijiang → Shangri-La", "Shangri-La → Lijiang"] },
  "lijiang-tlg-shangri-la": { five: 500, routes: ["Lijiang → Tiger Leaping Gorge → Shangri-La"] },
  // City-only day hire: published guide rate, manual route and vehicle verification.
  "kunming-day": { five: 600 },
  "dali-day": { five: 600 },
  "lijiang-day": { five: 600 },
  "shangri-la-day": { five: 600 },
};
