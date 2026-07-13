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
import { useAuth } from "@/features/auth/AuthContext";
import { APP_SHELL_CLASS } from "@/lib/layout";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", labelMd: "Inicio", icon: Home },
  { href: "/movimientos", label: "Lista", labelMd: "Movimientos", icon: List },
  { href: "/agregar", label: "Nuevo", labelMd: "Agregar", icon: PlusCircle, mutateOnly: true },
  { href: "/estadisticas", label: "Stats", labelMd: "Estadísticas", icon: BarChart3 },
  { href: "/configuracion", label: "Más", labelMd: "Ajustes", icon: Settings },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const { canMutate } = useAuth();

  const items = NAV_ITEMS.filter(
    (item) => !("mutateOnly" in item && item.mutateOnly) || canMutate,
  );

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card safe-bottom"
    >
      <div
        className={cn(
          APP_SHELL_CLASS,
          "flex items-stretch justify-around px-1 py-1.5 md:px-2 md:py-2",
        )}
      >
        {items.map(({ href, label, labelMd, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 text-xs font-semibold leading-none transition-colors md:min-h-16 md:gap-1 md:text-sm",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground active:bg-secondary/70",
              )}
            >
              <Icon
                className="size-6 shrink-0 md:size-7"
                strokeWidth={active ? 2.5 : 2}
                aria-hidden
              />
              <span className="w-full truncate text-center md:hidden">
                {label}
              </span>
              <span className="hidden w-full truncate text-center md:inline">
                {labelMd}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
