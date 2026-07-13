import type { Movement } from "@/types/movement";

export interface Totals {
  balance: number;
  totalSent: number;
  totalExpenses: number;
  totalSavings: number;
}

export function calculateTotals(movements: Movement[]): Totals {
  let totalSent = 0;
  let totalExpenses = 0;
  let totalSavings = 0;
  let adjustments = 0;

  for (const m of movements) {
    switch (m.type) {
      case "SEND":
        totalSent += m.amount;
        break;
      case "EXPENSE":
        totalExpenses += m.amount;
        break;
      case "SAVING":
        totalSavings += m.amount;
        break;
      case "ADJUSTMENT":
        adjustments += m.amount;
        break;
    }
  }

  return {
    totalSent,
    totalExpenses,
    totalSavings,
    balance: totalSent - totalExpenses + totalSavings + adjustments,
  };
}

export function filterByMonth(
  movements: Movement[],
  year: number,
  month: number,
): Movement[] {
  return movements.filter((m) => {
    const d = new Date(m.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
