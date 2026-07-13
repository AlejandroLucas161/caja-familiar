import { COLOR_LEGEND } from "@/lib/constants";

export function ColorLegend() {
  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-2 px-0.5"
      aria-label="Leyenda de tipos de movimiento"
    >
      {COLOR_LEGEND.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <span aria-hidden>{item.emoji}</span>
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}
