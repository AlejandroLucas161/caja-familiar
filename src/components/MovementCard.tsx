"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Movement } from "@/types/movement";
import { MOVEMENT_TYPE_META, CATEGORIES } from "@/lib/constants";
import { formatMoneySigned, formatMovementDate } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MovementCardProps {
  movement: Movement;
  onDelete?: (movement: Movement) => void;
  showActions?: boolean;
}

function categoryLabel(id: string | null): string | null {
  if (!id) return null;
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? `${found.emoji} ${found.label}` : id;
}

export function MovementCard({
  movement,
  onDelete,
  showActions = true,
}: MovementCardProps) {
  const meta = MOVEMENT_TYPE_META[movement.type];
  const title = `${movement.person ?? "Alguien"} ${meta.verb}`;
  const cat = categoryLabel(movement.category);

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl border border-border",
            meta.bgClass,
          )}
          aria-hidden
        >
          <span
            className="size-3.5 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg font-semibold leading-snug text-foreground">
              {title}
            </p>
            <p
              className={cn(
                "shrink-0 text-xl font-bold tabular-nums",
                meta.textClass,
              )}
            >
              {formatMoneySigned(movement.amount, meta.sign)}
            </p>
          </div>

          <p className="mt-1 text-base text-muted-foreground">
            {formatMovementDate(movement.createdAt)}
            {cat ? ` · ${cat}` : null}
          </p>

          {movement.description ? (
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              {movement.description}
            </p>
          ) : null}
        </div>
      </div>

      {showActions ? (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
          <Button
            asChild
            variant="secondary"
            className="h-12 rounded-xl text-base"
          >
            <Link href={`/movimientos/${movement.id}`}>
              <Pencil className="size-4" />
              Editar
            </Link>
          </Button>
          {onDelete ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-destructive/50 text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(movement)}
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          ) : (
            <div />
          )}
        </div>
      ) : null}
    </article>
  );
}
