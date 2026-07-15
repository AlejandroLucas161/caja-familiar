import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

/** Saldo / totales con signo real (el − no se pierde con Math.abs). */
export function formatMoneyBalance(amount: number): string {
  if (amount < 0) return `−${formatMoney(amount)}`;
  return formatMoney(amount);
}

export function formatMoneySigned(
  amount: number,
  sign: "+" | "-" = amount >= 0 ? "+" : "-",
): string {
  return `${sign}${formatMoney(amount)}`;
}

export function formatMovementDate(isoDate: string): string {
  return format(parseISO(isoDate), "d MMMM", { locale: es });
}

export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), "dd/MM/yyyy", { locale: es });
}

export function toDateInputValue(isoDate?: string): string {
  if (!isoDate) {
    return format(new Date(), "yyyy-MM-dd");
  }
  return format(parseISO(isoDate), "yyyy-MM-dd");
}

export function dateInputToIso(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return date.toISOString();
}
