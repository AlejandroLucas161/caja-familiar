"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterTabs } from "@/components/FilterTabs";
import { MovementCard } from "@/components/MovementCard";
import { EmptyState } from "@/components/EmptyState";
import { MovementListSkeleton } from "@/components/LoadingSkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useAuth } from "@/features/auth/AuthContext";
import {
  useDeleteMovement,
  useMovements,
} from "@/features/movements/useMovements";
import type { Movement, MovementFilter } from "@/types/movement";

export function MovementListView() {
  const { canMutate, isDemo } = useAuth();
  const [filter, setFilter] = useState<MovementFilter>("ALL");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Movement | null>(null);

  const { data, isLoading, isError } = useMovements(filter, search);
  const deleteMutation = useDeleteMovement();

  const movements = useMemo(() => data ?? [], [data]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    const id = toDelete.id;
    setToDelete(null);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Movimiento eliminado");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo eliminar",
      );
    }
  }

  return (
    <div className="space-y-4">
      <Header
        title="Movimientos"
        subtitle={
          isDemo
            ? "Demo de solo lectura — Tierra Media"
            : "Historial completo"
        }
      />

      <SearchBar value={search} onChange={setSearch} />
      <FilterTabs value={filter} onChange={setFilter} />

      {isLoading ? (
        <MovementListSkeleton />
      ) : isError ? (
        <EmptyState
          title="Error al cargar"
          description="No se pudieron obtener los movimientos."
        />
      ) : movements.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá cambiar el filtro o la búsqueda."
        />
      ) : (
        <div className="space-y-3">
          {movements.map((m) => (
            <MovementCard
              key={m.id}
              movement={m}
              showActions={canMutate}
              onDelete={canMutate ? setToDelete : undefined}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        description="¿Seguro que desea eliminar este movimiento?"
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
