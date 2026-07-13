"use client";

import { cn } from "@/lib/utils";
import type { MovementFilter } from "@/types/movement";

const FILTERS: { id: MovementFilter; label: string }[] = [
  { id: "ALL", label: "Todos" },
  { id: "SEND", label: "Envíos" },
  { id: "EXPENSE", label: "Gastos" },
  { id: "SAVING", label: "Ahorros" },
];

interface FilterTabsProps {
  value: MovementFilter;
  onChange: (value: MovementFilter) => void;
  className?: string;
}

export function FilterTabs({ value, onChange, className }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar por tipo"
      className={cn("grid grid-cols-4 gap-1.5", className)}
    >
      {FILTERS.map((filter) => {
        const active = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "min-h-11 rounded-xl px-1 py-2 text-xs font-semibold transition-colors active:opacity-90",
              active
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
