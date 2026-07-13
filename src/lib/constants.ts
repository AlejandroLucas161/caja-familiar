import type { MovementType } from "@/types/movement";

export const APP_NAME = "Caja Familiar";
export const APP_VERSION = "1.0.0";

export const PERSONS = [
  "Felix",
  "Mariangel",
  "Bonnie",
  "Alba",
  "Anais",
  "Alejandro",
] as const;

export type Person = (typeof PERSONS)[number];

export const CATEGORIES = [
  { id: "comida", label: "Comida", emoji: "🍖" },
  { id: "salud", label: "Salud", emoji: "💊" },
  { id: "transporte", label: "Transporte", emoji: "🚗" },
  { id: "casa", label: "Casa", emoji: "🏠" },
  { id: "servicios", label: "Servicios", emoji: "💡" },
  { id: "educacion", label: "Educación", emoji: "🎓" },
  { id: "mascotas", label: "Mascotas", emoji: "🐶" },
  { id: "otros", label: "Otros", emoji: "🎁" },
  { id: "ahorro", label: "Ahorro", emoji: "💰" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const MOVEMENT_TYPE_META: Record<
  MovementType,
  {
    label: string;
    verb: string;
    color: string;
    bgClass: string;
    textClass: string;
    sign: "+" | "-";
  }
> = {
  SEND: {
    label: "Envío",
    verb: "envió",
    color: "#4ADE80",
    bgClass: "bg-[#4ADE80]/15",
    textClass: "text-[#4ADE80]",
    sign: "+",
  },
  EXPENSE: {
    label: "Gasto",
    verb: "gastó",
    color: "#F87171",
    bgClass: "bg-[#F87171]/15",
    textClass: "text-[#F87171]",
    sign: "-",
  },
  SAVING: {
    label: "Ahorro",
    verb: "ahorró",
    color: "#60A5FA",
    bgClass: "bg-[#60A5FA]/15",
    textClass: "text-[#60A5FA]",
    sign: "+",
  },
  ADJUSTMENT: {
    label: "Corrección",
    verb: "corrigió",
    color: "#A1A1AA",
    bgClass: "bg-[#A1A1AA]/15",
    textClass: "text-[#A1A1AA]",
    sign: "+",
  },
};

export const COLOR_LEGEND = [
  { label: "Envío", emoji: "🟢", color: "#4ADE80" },
  { label: "Gasto", emoji: "🔴", color: "#F87171" },
  { label: "Ahorro", emoji: "🔵", color: "#60A5FA" },
  { label: "Pendiente", emoji: "🟡", color: "#FACC15" },
  { label: "Corrección", emoji: "⚪", color: "#A1A1AA" },
] as const;
