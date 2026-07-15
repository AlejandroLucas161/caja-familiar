import type { Movement } from "@/types/movement";

export interface Totals {
  balance: number;
  totalSent: number;
  totalExpenses: number;
  adjustments: number;
}

/** Evita errores de punto flotante al comparar montos USD. */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calculateTotals(movements: Movement[]): Totals {
  let totalSent = 0;
  let totalExpenses = 0;
  let adjustments = 0;

  for (const m of movements) {
    const amount = roundMoney(m.amount);
    switch (m.type) {
      case "SEND":
        totalSent = roundMoney(totalSent + amount);
        break;
      case "EXPENSE":
        totalExpenses = roundMoney(totalExpenses + amount);
        break;
      case "ADJUSTMENT":
        adjustments = roundMoney(adjustments + amount);
        break;
    }
  }

  return {
    totalSent,
    totalExpenses,
    adjustments,
    balance: roundMoney(totalSent - totalExpenses + adjustments),
  };
}

/**
 * Saldo disponible para un nuevo gasto o al editar.
 * Si se edita un movimiento, se excluye de la cuenta para no “duplicar” su efecto.
 */
export function availableBalance(
  movements: Movement[],
  excludeMovementId?: string | null,
): number {
  const list = excludeMovementId
    ? movements.filter((m) => m.id !== excludeMovementId)
    : movements;
  return calculateTotals(list).balance;
}

export function canAffordExpense(
  amount: number,
  available: number,
): boolean {
  return roundMoney(amount) <= roundMoney(available);
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
