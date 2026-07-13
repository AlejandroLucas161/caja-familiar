"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { useMovementRealtime } from "@/features/movements/useMovementRealtime";
import { APP_SHELL_CLASS } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  useMovementRealtime();

  return (
    <div
      className={cn(
        APP_SHELL_CLASS,
        "flex min-h-dvh flex-col bg-background shadow-[0_0_0_1px] shadow-border/40 md:min-h-dvh",
      )}
    >
      <main className="safe-top flex-1 px-4 pb-[5.5rem] md:px-6 md:pb-32">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
