import { formatMoneyBalance } from "@/utils/format";
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
      <p
        className={cn(
          "mt-2 break-all text-4xl font-bold tabular-nums tracking-tight",
          balance < 0 ? "text-destructive" : "text-foreground",
        )}
      >
        {formatMoneyBalance(balance)}
      </p>
    </section>
  );
}
