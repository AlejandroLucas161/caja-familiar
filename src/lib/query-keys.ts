import type { MovementFilter } from "@/types/movement";

export const queryKeys = {
  movements: {
    all: ["movements"] as const,
    list: (workspace: string, filter?: MovementFilter, search?: string) =>
      ["movements", "list", workspace, filter ?? "ALL", search ?? ""] as const,
    detail: (id: string) => ["movements", "detail", id] as const,
  },
};
