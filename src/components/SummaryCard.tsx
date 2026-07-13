import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/format";

interface SummaryCardProps {
  label: string;
  amount: number;
  accent: string;
  className?: string;
}

export function SummaryCard({
  label,
  amount,
  accent,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <p className="text-base font-medium text-muted-foreground">{label}</p>
      </div>
      <p
        className="break-all text-2xl font-bold tabular-nums"
        style={{ color: accent }}
      >
        {formatMoney(amount)}
      </p>
    </div>
  );
}
