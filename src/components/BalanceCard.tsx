import { formatMoney } from "@/utils/format";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  className?: string;
}

export function BalanceCard({ balance, className }: BalanceCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border-2 border-border bg-card p-5",
        className,
      )}
      aria-label="Saldo disponible"
    >
      <p className="text-base font-medium text-muted-foreground">
        Saldo disponible
      </p>
      <p className="mt-2 break-all text-4xl font-bold tabular-nums tracking-tight text-foreground">
        {formatMoney(balance)}
      </p>
    </section>
  );
}
