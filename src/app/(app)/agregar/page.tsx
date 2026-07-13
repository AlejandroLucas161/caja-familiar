"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { MovementForm } from "@/features/movements/MovementForm";
import { useCreateMovement } from "@/features/movements/useMovements";
import type { MovementInput } from "@/types/movement";

export default function AddMovementPage() {
  const createMutation = useCreateMovement();
  const router = useRouter();

  async function handleSubmit(input: MovementInput) {
    try {
      await createMutation.mutateAsync(input);
      toast.success("Movimiento guardado");
      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo guardar",
      );
    }
  }

  return (
    <div className="space-y-5">
      <Header title="Agregar" subtitle="Registrá un movimiento en segundos" />
      <MovementForm
        onSubmit={handleSubmit}
        submitLabel="Guardar movimiento"
        loading={createMutation.isPending}
      />
    </div>
  );
}
