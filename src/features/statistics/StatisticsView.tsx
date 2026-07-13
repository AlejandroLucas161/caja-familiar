"use client";

import { Header } from "@/components/Header";
import { SummaryCard } from "@/components/SummaryCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import {
  CategoryBarsChart,
  ExpenseByCategoryChart,
  ExpensesByMonthChart,
} from "@/features/statistics/StatisticsChart";
import { useMovements } from "@/features/movements/useMovements";
import { calculateTotals, filterByMonth } from "@/utils/balance";

export function StatisticsView() {
  const { data, isLoading, isError } = useMovements("ALL");

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <EmptyState
        title="No se pudieron cargar las estadísticas"
        description="Intentá de nuevo en unos segundos."
      />
    );
  }

  const movements = data ?? [];
  const now = new Date();
  const thisMonth = filterByMonth(
    movements,
    now.getFullYear(),
    now.getMonth(),
  );
  const monthTotals = calculateTotals(thisMonth);

  return (
    <div className="space-y-5">
      <Header title="Estadísticas" subtitle="Resumen visual de la caja" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Este mes</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SummaryCard
            label="Enviado"
            amount={monthTotals.totalSent}
            accent="#4ADE80"
          />
          <SummaryCard
            label="Gastado"
            amount={monthTotals.totalExpenses}
            accent="#F87171"
          />
        </div>
      </section>

      <ChartSection title="Distribución de gastos">
        <ExpenseByCategoryChart movements={movements} />
      </ChartSection>

      <ChartSection title="Gastos por mes">
        <ExpensesByMonthChart movements={movements} />
      </ChartSection>

      <ChartSection title="Gastos por categoría">
        <CategoryBarsChart movements={movements} />
      </ChartSection>
    </div>
  );
}

function ChartSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
