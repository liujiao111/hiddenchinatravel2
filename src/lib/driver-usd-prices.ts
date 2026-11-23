// Fixed website USD retail conversion, rounded UP to a whole US dollar.
// Reference FX: 1 USD = CNY 6.67 (23 November 2026). Payments use these exact USD amounts.
export const DRIVER_CNY_PER_USD = 6.67;
export const driverUsd = (cny: number) => Math.ceil(cny / DRIVER_CNY_PER_USD);
export const driverUsdCents = (cny: number) => driverUsd(cny) * 100;
export const driverMultiDayRate = (days: number) => days > 6 ? 1000 : 1200;
export const driverMultiDayTotalUsd = (days: number, sevenSeat: boolean) =>
  driverUsd((driverMultiDayRate(days) + (sevenSeat ? 200 : 0)) * days);
