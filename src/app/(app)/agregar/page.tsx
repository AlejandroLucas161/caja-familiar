"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MovementForm } from "@/features/movements/MovementForm";
import { useAuth } from "@/features/auth/AuthContext";
import {
  useCreateMovement,
  useMovements,
} from "@/features/movements/useMovements";
import { availableBalance } from "@/utils/balance";
import type { MovementInput } from "@/types/movement";

export default function AddMovementPage() {
  const { canMutate, loading: authLoading } = useAuth();
  const { data: movements, isLoading } = useMovements("ALL");
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

  if (isLoading) return <LoadingSkeleton />;

  const available = availableBalance(movements ?? []);

  return (
    <div className="space-y-5">
      <Header title="Agregar" subtitle="Registrá un movimiento en segundos" />
      <MovementForm
        onSubmit={handleSubmit}
        submitLabel="Guardar movimiento"
        loading={createMutation.isPending}
        availableBalance={available}
      />
    </div>
  );
}
