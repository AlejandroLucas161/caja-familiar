"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Movement } from "@/types/movement";
import { CATEGORIES } from "@/lib/constants";
import { formatMoney } from "@/utils/format";
import { roundMoney } from "@/utils/balance";

const COLORS = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#4ADE80",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#2DD4BF",
  "#A1A1AA",
];

const TICK = "#A8B0BD";
const GRID = "rgba(255,255,255,0.06)";
const CURSOR_FILL = "rgba(238,240,243,0.08)";

interface StatisticsChartProps {
  movements: Movement[];
}

function categoryLabel(id: string): string {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

function ChartTooltip(props: Record<string, unknown>) {
  const active = Boolean(props.active);
  const payload = props.payload as
    | ReadonlyArray<{ name?: string | number; value?: string | number; color?: string }>
    | undefined;
  const label = props.label as string | number | undefined;

  if (!active || !payload?.length) return null;

  const item = payload[0];
  const title = String(label ?? item?.name ?? "");
  const value = Number(item?.value ?? 0);
  const swatch = typeof item?.color === "string" ? item.color : undefined;

  return (
    <div className="min-w-[8.5rem] rounded-xl border border-[#454D5C] bg-[#2A303A] px-3 py-2.5 shadow-xl">
      <div className="flex items-center gap-2">
        {swatch ? (
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: swatch }}
            aria-hidden
          />
        ) : null}
        <p className="text-sm font-medium text-[#EEF0F3]">{title}</p>
      </div>
      <p className="mt-1 text-base font-bold tabular-nums text-[#EEF0F3]">
        {formatMoney(value)}
      </p>
    </div>
  );
}

function ActivePieShape(props: {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = COLORS[0],
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="transparent"
      style={{ outline: "none", filter: "brightness(1.08)" }}
    />
  );
}

export function ExpenseByCategoryChart({
  movements,
}: StatisticsChartProps) {
  const expenses = movements.filter((m) => m.type === "EXPENSE");
  const map = new Map<string, number>();

  for (const m of expenses) {
    const key = m.category ?? "otros";
    map.set(key, roundMoney((map.get(key) ?? 0) + m.amount));
  }

  const data = Array.from(map.entries()).map(([id, value]) => ({
    name: categoryLabel(id),
    value,
  }));

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay gastos para mostrar
      </p>
    );
  }

  return (
    <div className="chart-surface h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            stroke="transparent"
            activeShape={ActivePieShape}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
                style={{ outline: "none", cursor: "pointer" }}
              />
            ))}
          </Pie>
          <Tooltip
            content={ChartTooltip}
            cursor={false}
            isAnimationActive={false}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpensesByMonthChart({ movements }: StatisticsChartProps) {
  const expenses = movements.filter((m) => m.type === "EXPENSE");
  const map = new Map<string, { label: string; total: number; order: number }>();

  for (const m of expenses) {
    const d = new Date(m.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const existing = map.get(key);
    if (existing) {
      existing.total = roundMoney(existing.total + m.amount);
    } else {
      map.set(key, {
        label: format(d, "MMM yy", { locale: es }),
        total: roundMoney(m.amount),
        order: d.getFullYear() * 100 + d.getMonth(),
      });
    }
  }

  const data = Array.from(map.values())
    .sort((a, b) => a.order - b.order)
    .slice(-6);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay gastos mensuales para mostrar
      </p>
    );
  }

  return (
    <div className="chart-surface h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: TICK, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: TICK, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              const n = Number(v);
              if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
              return String(Math.round(n));
            }}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ fill: CURSOR_FILL }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="total"
            name="Gastado"
            fill="#F87171"
            radius={[10, 10, 0, 0]}
            activeBar={{ fill: "#FCA5A5", stroke: "transparent" }}
            style={{ outline: "none" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarsChart({ movements }: StatisticsChartProps) {
  const expenses = movements.filter((m) => m.type === "EXPENSE");
  const map = new Map<string, number>();

  for (const m of expenses) {
    const key = m.category ?? "otros";
    map.set(key, roundMoney((map.get(key) ?? 0) + m.amount));
  }

  const data = Array.from(map.entries())
    .map(([id, total]) => ({
      name: categoryLabel(id),
      total,
    }))
    .sort((a, b) => b.total - a.total);

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay categorías para mostrar
      </p>
    );
  }

  return (
    <div className="chart-surface h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 12, top: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: TICK, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              const n = Number(v);
              if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
              return String(Math.round(n));
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={84}
            tick={{ fill: TICK, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ fill: CURSOR_FILL }}
            isAnimationActive={false}
          />
          <Bar
            dataKey="total"
            name="Gastado"
            fill="#60A5FA"
            radius={[0, 10, 10, 0]}
            activeBar={{ fill: "#93C5FD", stroke: "transparent" }}
            style={{ outline: "none" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
