export type DriverProductFilter = {
  category: string;
  cities: readonly string[];
  departureCities?: readonly string[];
};

export function filterDriverProducts<T extends DriverProductFilter>(
  products: readonly T[],
  category: string,
  departureCity: string,
): T[] {
  return products.filter((product) => {
    const startsInCity = product.departureCities ?? product.cities;
    return (category === "all" || product.category === category)
      && (!departureCity || startsInCity.includes(departureCity));
  });
}
