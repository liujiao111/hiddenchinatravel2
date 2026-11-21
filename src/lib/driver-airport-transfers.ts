type Option = { value: string; en: string; zh: string };
type Hub = Option & { kind: "airport" | "railway" };
type Vehicle = "five" | "seven";
export type TransferDirection = "pickup" | "dropoff";
type Price = Record<Vehicle, number | null> & { enabled?: boolean; note?: string };

const area = (value: string, en: string, zh: string): Option => ({ value, en, zh });
const hub = (value: string, en: string, zh: string, kind: Hub["kind"]): Hub => ({ value, en, zh, kind });
const other = area("other", "Other area", "其他区域");
const blank: Price = { five: null, seven: null };
const sameBothWays = (five: number, seven: number) => ({
  pickup: { five, seven }, dropoff: { five, seven },
});
const pending = { pickup: blank, dropoff: blank };

const configurableDirection = (five: number | null = null, seven: number | null = null, enabled = true, note = "") =>
  ({ five, seven, enabled, note });
const configurableRoute = (pickup = configurableDirection(), dropoff = configurableDirection()) => ({ pickup, dropoff });

type TransferCatalog = {
  hubs: Hub[];
  areas: Option[];
  routes: Partial<Record<string, Partial<Record<string, Record<TransferDirection, Price>>>>>;
};

export const airportTransferCatalog: Record<string, TransferCatalog | undefined> = {
  "kunming-arrival": {
    hubs: [
      hub("kmg", "Kunming Changshui International Airport (KMG)", "昆明长水国际机场（KMG）", "airport"),
      hub("railway", "Kunming Railway Station", "昆明站", "railway"),
      hub("south", "Kunming South Railway Station", "昆明南站", "railway"),
    ],
    areas: [area("central", "Kunming city centre", "昆明市中心"), area("dianchi", "Dianchi / Haigeng", "滇池 / 海埂片区"), area("chenggong", "Chenggong", "呈贡片区"), other],
    routes: {
      kmg: { central: sameBothWays(180, 280), dianchi: pending, chenggong: pending, south: pending },
      railway: { central: pending },
      south: { central: pending, dianchi: pending },
    },
  },
  "dali-arrival": {
    hubs: [
      hub("dlu", "Dali Fengyi Airport (DLU)", "大理凤仪机场（DLU）", "airport"),
      hub("railway", "Dali Railway Station", "大理站", "railway"),
    ],
    areas: [area("xiaguan", "Xiaguan / Dali city centre", "下关 / 大理市区"), area("oldtown", "Dali Old Town", "大理古城"), area("xizhou", "Xizhou", "喜洲"), area("shuanglang", "Shuanglang", "双廊"), other],
    routes: {
      dlu: {
        xiaguan: configurableRoute(configurableDirection(150, 250, true, "Existing guide fares"), configurableDirection(150, 250, true, "Existing guide fares")),
        oldtown: configurableRoute(),
        xizhou: configurableRoute(),
        shuanglang: configurableRoute(),
      },
      railway: {
        xiaguan: configurableRoute(),
        oldtown: configurableRoute(),
        xizhou: configurableRoute(),
        shuanglang: configurableRoute(),
      },
    },
  },
  "lijiang-arrival": {
    hubs: [
      hub("ljg", "Lijiang Sanyi International Airport (LJG)", "丽江三义国际机场（LJG）", "airport"),
      hub("railway", "Lijiang Railway Station", "丽江站", "railway"),
    ],
    areas: [area("oldtown", "Lijiang Old Town / city centre", "丽江古城 / 丽江市区"), area("shuhe", "Shuhe Old Town", "束河古镇"), area("baisha", "Baisha Old Town", "白沙古镇"), other],
    routes: {
      ljg: { oldtown: configurableRoute(), shuhe: configurableRoute(), baisha: configurableRoute() },
      railway: { oldtown: configurableRoute(), shuhe: configurableRoute(), baisha: configurableRoute() },
    },
  },
  "shangri-la-arrival": {
    hubs: [
      hub("dig", "Diqing Shangri-La Airport (DIG)", "迪庆香格里拉机场（DIG）", "airport"),
      hub("railway", "Shangri-La Railway Station", "香格里拉站", "railway"),
    ],
    areas: [area("dukezong", "Dukezong Ancient Town / central Shangri-La", "独克宗古城 / 香格里拉市区"), area("songzanlin", "Songzanlin area", "松赞林寺片区"), other],
    routes: {
      dig: { dukezong: configurableRoute(), songzanlin: configurableRoute() },
      railway: { dukezong: configurableRoute(), songzanlin: configurableRoute() },
    },
  },
};

export function isOutsideTransferArea(areaId: string) {
  return areaId === "other" || areaId === "jade-dragon";
}

export function transferGuidePrice(productId: string, hubId: string, areaId: string, direction: string, vehicle: Vehicle | undefined) {
  if (!vehicle || (direction !== "pickup" && direction !== "dropoff") || isOutsideTransferArea(areaId)) return undefined;
  const configured = airportTransferCatalog[productId]?.routes[hubId]?.[areaId]?.[direction];
  if (configured?.enabled === false) return undefined;
  const price = configured?.[vehicle];
  return typeof price === "number" && Number.isFinite(price) && price > 0 ? price : undefined;
}

export function transferStartingPrice(productId: string, vehicle: Vehicle) {
  const prices = Object.entries(airportTransferCatalog[productId]?.routes ?? {}).flatMap(([hubId, areas]) =>
    Object.keys(areas ?? {}).flatMap(areaId => [
      transferGuidePrice(productId, hubId, areaId, "pickup", vehicle),
      transferGuidePrice(productId, hubId, areaId, "dropoff", vehicle),
    ]));
  const valid = prices.filter((price): price is number => price !== undefined);
  return valid.length ? Math.min(...valid) : undefined;
}

export function chinaServiceDate() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format();
}

export function parseAirportTransfer(value: unknown, date: string, adults: number, children: number, locale: "zh" | "en") {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const field = (key: string, max: number) => typeof input[key] === "string"
    ? (input[key] as string).trim().slice(0, max) : "";
  const productId = field("productId", 40);
  const city = Object.hasOwn(airportTransferCatalog, productId) ? airportTransferCatalog[productId] : undefined;
  const selectedHub = city?.hubs.find(item => item.value === input.hubId);
  const direction = input.direction;
  if (!city || !selectedHub || (direction !== "pickup" && direction !== "dropoff")) return null;
  const direct = input.stationTransfer === true;
  const secondHub = direct && productId === "kunming-arrival" && selectedHub.value === "kmg"
    ? city.hubs.find(item => item.value === "south") : undefined;
  // A form opened before the catalog update may still submit the old snow-mountain option.
  const areaId = productId === "lijiang-arrival" && input.hotelArea === "jade-dragon" ? "other"
    : productId === "shangri-la-arrival" && input.hotelArea === "central" ? "dukezong" : input.hotelArea;
  const selectedArea = city.areas.find(item => item.value === areaId);
  const hotel = field("hotel", 150);
  if (direct ? !secondHub : !selectedArea || !hotel) return null;

  const pickup = direction === "pickup";
  const arrival = pickup || direct;
  const transportNumber = field("transportNumber", 40);
  const time = field("serviceTime", 5);
  // The exact arrival time and flight/train number can be confirmed after the initial enquiry.
  const vehicle = input.vehicle;
  const luggage = Number(input.luggage);
  const vehicleType = vehicle === "Five-seat car" ? "five" : vehicle === "Seven-seat car" ? "seven" : undefined;
  if ((!vehicleType && vehicle !== "Larger vehicle - quote required")
    || !Number.isInteger(input.luggage) || luggage < 0 || luggage > 20
    || (vehicleType === "five" && (adults + children > 3 || luggage > 3))
    || (vehicleType === "seven" && adults + children > 6)
    || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < chinaServiceDate()
    || (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return null;
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return null;

  const zh = locale === "zh";
  const hubName = selectedHub[locale];
  const destination = secondHub?.[locale] || hotel;
  const price = transferGuidePrice(productId, selectedHub.value, secondHub?.value || selectedArea?.value || "", direction, vehicleType);
  const travelHub = secondHub && !pickup ? secondHub : selectedHub;
  const transportLabel = travelHub.kind === "airport" ? (zh ? "航班号" : "Flight number") : (zh ? "车次" : "Train number");
  const timeLabel = arrival ? (zh ? "预计抵达时间" : "Scheduled arrival time") : (zh ? "期望接客时间" : "Preferred pickup time");
  return {
    ...(productId === "shangri-la-arrival" ? { productId } : {}),
    hub: hubName,
    direction: zh ? (arrival ? (travelHub.kind === "airport" ? "接机" : "接站") : (travelHub.kind === "airport" ? "送机" : "送站"))
      : (arrival ? "Pickup" : "Drop-off"),
    route: pickup ? `${hubName} → ${destination}` : `${destination} → ${hubName}`,
    pickup: pickup ? hubName : destination,
    dropoff: pickup ? destination : hubName,
    area: secondHub ? "" : selectedArea?.[locale] || "",
    hotel: secondHub ? "" : hotel,
    transportLabel, transportNumber, timeLabel, time,
    vehicle: zh ? (vehicleType === "five" ? "标准5座车" : vehicleType === "seven" ? "7座商务车" : "更大车型") : String(vehicle),
    adults, children, luggage, notes: field("notes", 1100),
    guideFen: price === undefined ? null : Math.round(price * 100),
    manualQuote: price === undefined,
  };
}
