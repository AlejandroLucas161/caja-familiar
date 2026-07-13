"use client";

import { cn } from "@/lib/utils";
import type { MovementType } from "@/types/movement";

const TYPES: {
  id: Exclude<MovementType, "ADJUSTMENT">;
  label: string;
  color: string;
}[] = [
  { id: "SEND", label: "Envío", color: "#4ADE80" },
  { id: "EXPENSE", label: "Gasto", color: "#F87171" },
  { id: "SAVING", label: "Ahorro", color: "#60A5FA" },
];

interface TypeSelectorProps {
  value: MovementType | null;
  onChange: (value: Exclude<MovementType, "ADJUSTMENT">) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPES.map((type) => {
        const active = value === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            aria-pressed={active}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-1 py-2 text-sm font-semibold transition-colors",
              active
                ? "border-foreground bg-secondary text-foreground"
                : "border-border bg-card text-muted-foreground active:bg-secondary/50",
            )}
          >
            <span
              className="size-3.5 shrink-0 rounded-full"
              style={{ backgroundColor: type.color }}
              aria-hidden
            />
            {type.label}
          </button>
        );
      })}
    </div>
  );
}
