import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Header({ title, subtitle, action, className }: HeaderProps) {
  return (
    <header className={cn("mb-5 flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-base text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}
