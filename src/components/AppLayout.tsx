"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { useMovementRealtime } from "@/features/movements/useMovementRealtime";

export function AppLayout({ children }: { children: React.ReactNode }) {
  useMovementRealtime();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-[0_0_0_1px] shadow-border/40">
      <main className="safe-top flex-1 px-4 pb-[5.5rem]">{children}</main>
      <BottomNavigation />
    </div>
  );
}
