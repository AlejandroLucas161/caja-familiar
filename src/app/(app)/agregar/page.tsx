"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { MovementForm } from "@/features/movements/MovementForm";
import { useAuth } from "@/features/auth/AuthContext";
import { useCreateMovement } from "@/features/movements/useMovements";
import type { MovementInput } from "@/types/movement";

export default function AddMovementPage() {
  const { canMutate, loading: authLoading } = useAuth();
  const createMutation = useCreateMovement();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !canMutate) {
      toast.message("El modo Demo es solo lectura");
      router.replace("/");
    }
  }, [authLoading, canMutate, router]);

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

  if (authLoading || !canMutate) {
    return (
      <EmptyState
        title="Modo Demo"
        description="La demo es solo lectura para no saturar la base de datos."
      />
    );
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
