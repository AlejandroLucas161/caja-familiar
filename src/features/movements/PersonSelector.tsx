"use client";

import { PERSONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PersonSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function PersonSelector({ value, onChange }: PersonSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PERSONS.map((person) => {
        const active = value === person;
        return (
          <button
            key={person}
            type="button"
            onClick={() => onChange(person)}
            aria-pressed={active}
            className={cn(
              "min-h-12 rounded-xl px-2 py-2.5 text-base font-semibold transition-colors active:opacity-90",
              active
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground",
            )}
          >
            {person}
          </button>
        );
      })}
    </div>
  );
}
