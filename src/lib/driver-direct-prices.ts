// Only confirmed five-seat standard-route prices are eligible for direct checkout.
// Seven-seat adds CNY 100 to the five-seat quote for defined routes.
export const driverDirectPrices: Record<string, { five?: number; seven?: number; routes?: string[] }> = {
  "dali-lijiang-direct": { five: 700, seven: 800, routes: ["Dali → Lijiang direct", "Lijiang → Dali direct"] },
  "dali-lijiang-shaxi": { five: 900, seven: 1000, routes: ["Dali → Shaxi → Lijiang", "Lijiang → Shaxi → Dali"] },
  "lijiang-shangri-la": { five: 700, seven: 800, routes: ["Lijiang → Shangri-La", "Shangri-La → Lijiang"] },
  "lijiang-tlg-shangri-la": { five: 900, seven: 1000, routes: ["Lijiang → Tiger Leaping Gorge → Shangri-La"] },
  // City-only day hire: published guide rate, manual route and vehicle verification.
  "kunming-day": { five: 1000, seven: 1100 },
  "dali-day": { five: 1000, seven: 1100 },
  "lijiang-day": { five: 1000, seven: 1100 },
  "shangri-la-day": { five: 1000, seven: 1100 },
};
