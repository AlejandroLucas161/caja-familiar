"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { MovementListSkeleton } from "@/components/LoadingSkeleton";
import { MovementForm } from "@/features/movements/MovementForm";
import {
  useMovement,
  useUpdateMovement,
} from "@/features/movements/useMovements";
import type { MovementInput } from "@/types/movement";

export default function EditMovementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useMovement(id);
  const updateMutation = useUpdateMovement();
  const router = useRouter();

  async function handleSubmit(input: MovementInput) {
    try {
      await updateMutation.mutateAsync({ id, input });
      toast.success("Movimiento actualizado");
      router.push("/movimientos");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo actualizar",
      );
    }
  }

  if (isLoading) return <MovementListSkeleton />;

  if (isError || !data) {
    return (
      <EmptyState
        title="Movimiento no encontrado"
        description="Puede que haya sido eliminado."
      />
    );
  }

  return (
    <div className="space-y-5">
      <Header title="Editar" subtitle="Modificá los datos del movimiento" />
      <MovementForm
        initial={data}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        loading={updateMutation.isPending}
      />
    </div>
  );
}
