export function formatPriceLabel(value: number, currency: string) {
  if (!Number.isFinite(value) || value <= 0) return "Tailored quote";
  const amount = new Intl.NumberFormat("en-US").format(value);
  const prefix = currency === "USD" ? "US$" : currency === "CNY" ? "¥" : `${currency} `;
  return `${prefix}${amount}`;
}
