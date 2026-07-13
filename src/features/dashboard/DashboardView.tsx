"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { SummaryCard } from "@/components/SummaryCard";
import { ColorLegend } from "@/components/ColorLegend";
import { MovementCard } from "@/components/MovementCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useMovements } from "@/features/movements/useMovements";
import { calculateTotals } from "@/utils/balance";

export function DashboardView() {
  const { data: movements, isLoading, isError } = useMovements("ALL");

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description="Revisá tu conexión e intentá de nuevo."
      />
    );
  }

  const list = movements ?? [];
  const totals = calculateTotals(list);
  const recent = list.slice(0, 5);

  return (
    <div className="space-y-5">
      <Header title="Inicio" subtitle="Resumen de la caja familiar" />

      <BalanceCard balance={totals.balance} />

      <div className="grid grid-cols-1 gap-3">
        <SummaryCard
          label="Total enviado"
          amount={totals.totalSent}
          accent="#4ADE80"
        />
        <SummaryCard
          label="Total gastado"
          amount={totals.totalExpenses}
          accent="#F87171"
        />
      </div>

      <ColorLegend />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Últimos movimientos</h2>
          <Button asChild variant="ghost" className="h-11 rounded-xl text-base">
            <Link href="/movimientos">Ver todos</Link>
          </Button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="Todavía no hay movimientos"
            description="Agregá el primer envío o gasto."
            action={
              <Button asChild className="h-12 rounded-xl px-6 text-base">
                <Link href="/agregar">Agregar movimiento</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {recent.map((m) => (
              <MovementCard key={m.id} movement={m} showActions={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
