export function formatPriceLabel(value: number, currency: string) {
  const amount = new Intl.NumberFormat("en-US").format(value);
  const prefix = currency === "USD" ? "US$" : currency === "CNY" ? "¥" : `${currency} `;
  return `${prefix}${amount}`;
}
