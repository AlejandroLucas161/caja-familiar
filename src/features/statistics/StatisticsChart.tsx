"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Movement } from "@/types/movement";
import { CATEGORIES } from "@/lib/constants";
import { formatMoney } from "@/utils/format";

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

interface StatisticsChartProps {
  movements: Movement[];
}

function categoryLabel(id: string): string {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

export function ExpenseByCategoryChart({
  movements,
}: StatisticsChartProps) {
  const expenses = movements.filter((m) => m.type === "EXPENSE");
  const map = new Map<string, number>();

  for (const m of expenses) {
    const key = m.category ?? "otros";
    map.set(key, (map.get(key) ?? 0) + m.amount);
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
    <div className="h-64 w-full">
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
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
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
      existing.total += m.amount;
    } else {
      map.set(key, {
        label: format(d, "MMM yy", { locale: es }),
        total: m.amount,
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
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              background: "#1f1f1f",
            }}
          />
          <Bar dataKey="total" fill="#EF4444" radius={[10, 10, 0, 0]} />
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
    map.set(key, (map.get(key) ?? 0) + m.amount);
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
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            type="number"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              background: "#1f1f1f",
            }}
          />
          <Bar dataKey="total" fill="#3B82F6" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
