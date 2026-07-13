import { createClient } from "@/lib/supabase/client";
import type {
  Movement,
  MovementFilter,
  MovementInput,
  MovementRow,
  Workspace,
} from "@/types/movement";

function mapRow(row: MovementRow): Movement | null {
  if (
    row.type !== "SEND" &&
    row.type !== "EXPENSE" &&
    row.type !== "ADJUSTMENT"
  ) {
    return null;
  }

  return {
    id: row.id,
    workspace: row.workspace as Workspace,
    type: row.type,
    amount: Number(row.amount),
    person: row.person,
    category: row.category,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchMovements(
  workspace: Workspace,
  filter: MovementFilter = "ALL",
  search = "",
): Promise<Movement[]> {
  const supabase = createClient();
  let query = supabase
    .from("movements")
    .select("*")
    .eq("workspace", workspace)
    .order("created_at", { ascending: false });

  if (filter !== "ALL") {
    query = query.eq("type", filter);
  }

  const { data, error } = await query;
  if (error) throw error;

  let movements = (data as MovementRow[])
    .map(mapRow)
    .filter((m): m is Movement => m !== null);

  const q = search.trim().toLowerCase();
  if (q) {
    movements = movements.filter((m) => {
      const haystack = [m.description, m.person, m.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return movements;
}

export async function fetchMovementById(id: string): Promise<Movement | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("movements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as MovementRow);
}

export async function createMovement(
  workspace: Workspace,
  input: MovementInput,
): Promise<Movement> {
  if (workspace === "demo") {
    throw new Error("El modo Demo es solo lectura");
  }

  const supabase = createClient();
  const payload = {
    workspace,
    type: input.type,
    amount: input.amount,
    person: input.person,
    category: input.category ?? null,
    description: input.description ?? null,
    created_at: input.createdAt ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("movements")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  const movement = mapRow(data as MovementRow);
  if (!movement) throw new Error("Tipo de movimiento no válido");
  return movement;
}

export async function updateMovement(
  id: string,
  input: MovementInput,
  workspace?: Workspace | null,
): Promise<Movement> {
  if (workspace === "demo") {
    throw new Error("El modo Demo es solo lectura");
  }

  const supabase = createClient();
  const payload = {
    type: input.type,
    amount: input.amount,
    person: input.person,
    category: input.category ?? null,
    description: input.description ?? null,
    created_at: input.createdAt ?? undefined,
  };

  const { data, error } = await supabase
    .from("movements")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  const movement = mapRow(data as MovementRow);
  if (!movement) throw new Error("Tipo de movimiento no válido");
  return movement;
}

export async function deleteMovement(
  id: string,
  workspace?: Workspace | null,
): Promise<void> {
  if (workspace === "demo") {
    throw new Error("El modo Demo es solo lectura");
  }

  const supabase = createClient();
  const { error } = await supabase.from("movements").delete().eq("id", id);
  if (error) throw error;
}
