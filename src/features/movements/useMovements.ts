"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext";
import { queryKeys } from "@/lib/query-keys";
import {
  createMovement,
  deleteMovement,
  fetchMovementById,
  fetchMovements,
  updateMovement,
} from "@/services/movements";
import type { MovementFilter, MovementInput } from "@/types/movement";

export function useMovements(
  filter: MovementFilter = "ALL",
  search = "",
) {
  const { workspace } = useAuth();

  return useQuery({
    queryKey: queryKeys.movements.list(workspace ?? "none", filter, search),
    queryFn: () => fetchMovements(workspace!, filter, search),
    enabled: Boolean(workspace),
  });
}

export function useMovement(id: string) {
  return useQuery({
    queryKey: queryKeys.movements.detail(id),
    queryFn: () => fetchMovementById(id),
    enabled: Boolean(id),
  });
}

export function useCreateMovement() {
  const { workspace } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MovementInput) => {
      if (!workspace) throw new Error("Sin workspace");
      return createMovement(workspace, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
    },
  });
}

export function useUpdateMovement() {
  const { workspace } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MovementInput }) =>
      updateMovement(id, input, workspace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
    },
  });
}

export function useDeleteMovement() {
  const { workspace } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMovement(id, workspace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movements.all });
    },
  });
}
