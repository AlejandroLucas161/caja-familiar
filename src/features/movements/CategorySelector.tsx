"use client";

import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
      {CATEGORIES.map((cat) => {
        const active = value === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            aria-pressed={active}
            className={cn(
              "flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-2 text-xs font-semibold transition-colors active:opacity-90",
              active
                ? "border-foreground bg-secondary text-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            <span className="text-lg leading-none" aria-hidden>
              {cat.emoji}
            </span>
            <span className="leading-tight">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
