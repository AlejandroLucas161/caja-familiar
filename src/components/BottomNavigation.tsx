"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  List,
  PlusCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Labels cortas pensadas para pantallas angostas */
const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/movimientos", label: "Lista", icon: List },
  { href: "/agregar", label: "Nuevo", icon: PlusCircle },
  { href: "/estadisticas", label: "Stats", icon: BarChart3 },
  { href: "/configuracion", label: "Más", icon: Settings },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card safe-bottom"
    >
      <div className="mx-auto flex w-full max-w-[430px] items-stretch justify-around px-0.5 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 text-xs font-semibold leading-none transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground active:bg-secondary/70",
              )}
            >
              <Icon
                className="size-6 shrink-0"
                strokeWidth={active ? 2.5 : 2}
                aria-hidden
              />
              <span className="w-full truncate text-center">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
