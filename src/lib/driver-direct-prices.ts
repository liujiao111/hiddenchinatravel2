// Customer-facing CNY base prices are converted to USD at checkout.
// Seven-seat uplift: CNY 150 for direct intercity; CNY 200 for scenic intercity and day hire.
// Diagnostic SKU is not a transport offer. Only available through the hidden internal test link.
export const DRIVER_FULL_ORDER_TEST_ID = "driver-full-order-usd1-test";
export const DRIVER_FULL_ORDER_TEST_ROUTE = "PAYMENT TEST ONLY - NO TRANSPORT SERVICE";
export const DRIVER_FULL_ORDER_TEST_USD_CENTS = 100;

export const driverDirectPrices: Record<string, { five?: number; seven?: number; routes?: string[] }> = {
  [DRIVER_FULL_ORDER_TEST_ID]: { five: 1, routes: [DRIVER_FULL_ORDER_TEST_ROUTE] },
  "dali-lijiang-direct": { five: 700, seven: 850, routes: ["Dali → Lijiang direct", "Lijiang → Dali direct"] },
  "dali-lijiang-shaxi": { five: 900, seven: 1100, routes: ["Dali → Shaxi → Lijiang", "Lijiang → Shaxi → Dali"] },
  "lijiang-shangri-la": { five: 700, seven: 850, routes: ["Lijiang → Shangri-La", "Shangri-La → Lijiang"] },
  "lijiang-tlg-shangri-la": { five: 900, seven: 1100, routes: ["Lijiang → Tiger Leaping Gorge → Shangri-La"] },
  // City-only day hire: published guide rate, manual route and vehicle verification.
  "kunming-day": { five: 1000, seven: 1200 },
  "dali-day": { five: 1000, seven: 1200 },
  "lijiang-day": { five: 1000, seven: 1200 },
  "shangri-la-day": { five: 1000, seven: 1200 },
};
