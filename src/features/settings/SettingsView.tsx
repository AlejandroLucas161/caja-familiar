"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Info, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/AuthContext";
import { useMovements } from "@/features/movements/useMovements";
import { APP_NAME, APP_VERSION } from "@/lib/constants";
import { downloadCsv, movementsToCsv } from "@/utils/csv";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const { signOut, workspace, user, canMutate } = useAuth();
  const { data: movements } = useMovements("ALL");
  const router = useRouter();
  const [aboutOpen, setAboutOpen] = useState(false);

  async function handleLogout() {
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo cerrar sesión",
      );
    }
  }

  function handleExport() {
    const list = movements ?? [];
    if (list.length === 0) {
      toast.message("No hay movimientos para exportar");
      return;
    }
    const csv = movementsToCsv(list);
    downloadCsv(csv, `caja-familiar-${workspace ?? "export"}.csv`);
    toast.success("CSV descargado");
  }

  return (
    <div className="space-y-5">
      <Header title="Configuración" subtitle="Opciones de la cuenta" />

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-base text-muted-foreground">Sesión activa</p>
        <p className="mt-1 truncate text-lg font-semibold">
          {user?.email ?? "—"}
        </p>
        <p className="mt-1 text-base text-muted-foreground">
          Workspace:{" "}
          <span className="font-medium text-foreground">
            {workspace ?? "—"}
          </span>
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {canMutate ? (
          <SettingsRow
            icon={<Download className="size-5" />}
            label="Exportar CSV"
            onClick={handleExport}
          />
        ) : null}
        <SettingsRow
          icon={<Info className="size-5" />}
          label="Acerca de"
          onClick={() => setAboutOpen(true)}
        />
        <SettingsRow
          icon={<LogOut className="size-5" />}
          label="Cerrar sesión"
          onClick={handleLogout}
          destructive
          last
        />
      </div>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>{APP_NAME}</DialogTitle>
            <DialogDescription>
              Aplicación privada para registrar dinero enviado a la familia y
              controlar cómo se utiliza, de forma extremadamente simple.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Versión {APP_VERSION}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  onClick,
  destructive = false,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary",
        !last && "border-b border-border",
        destructive && "text-destructive",
      )}
    >
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-xl bg-secondary",
          destructive && "bg-destructive/15 text-destructive",
        )}
      >
        {icon}
      </span>
      <span className="flex-1 text-lg font-medium">{label}</span>
      <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
    </button>
  );
}
