import type { Movement } from "@/types/movement";
import { formatShortDate } from "@/utils/format";
import { MOVEMENT_TYPE_META } from "@/lib/constants";

export function movementsToCsv(movements: Movement[]): string {
  const header = [
    "Fecha",
    "Tipo",
    "Monto",
    "Persona",
    "Categoría",
    "Comentario",
  ].join(",");

  const rows = movements.map((m) =>
    [
      formatShortDate(m.createdAt),
      MOVEMENT_TYPE_META[m.type].label,
      m.amount.toString(),
      csvEscape(m.person ?? ""),
      csvEscape(m.category ?? ""),
      csvEscape(m.description ?? ""),
    ].join(","),
  );

  return [header, ...rows].join("\n");
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
