-- Caja Familiar: schema, RLS y Realtime
-- Ejecutar en el SQL Editor de Supabase

-- 1. Tabla movements
create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('family', 'demo')),
  type text not null check (type in ('SEND', 'EXPENSE', 'ADJUSTMENT')),
  amount numeric not null check (amount > 0),
  person text,
  category text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists movements_workspace_created_at_idx
  on public.movements (workspace, created_at desc);

-- 2. updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists movements_set_updated_at on public.movements;
create trigger movements_set_updated_at
  before update on public.movements
  for each row
  execute function public.set_updated_at();

-- 3. Helper: workspace del usuario autenticado (user_metadata.workspace)
create or replace function public.current_workspace()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'workspace',
    auth.jwt() -> 'raw_user_meta_data' ->> 'workspace'
  );
$$;

-- 4. RLS
alter table public.movements enable row level security;

drop policy if exists "movements_select_own_workspace" on public.movements;
create policy "movements_select_own_workspace"
  on public.movements
  for select
  to authenticated
  using (workspace = public.current_workspace());

drop policy if exists "movements_insert_own_workspace" on public.movements;
create policy "movements_insert_own_workspace"
  on public.movements
  for insert
  to authenticated
  with check (workspace = public.current_workspace());

drop policy if exists "movements_update_own_workspace" on public.movements;
create policy "movements_update_own_workspace"
  on public.movements
  for update
  to authenticated
  using (workspace = public.current_workspace())
  with check (workspace = public.current_workspace());

drop policy if exists "movements_delete_own_workspace" on public.movements;
create policy "movements_delete_own_workspace"
  on public.movements
  for delete
  to authenticated
  using (workspace = public.current_workspace());

-- 5. Realtime
alter publication supabase_realtime add table public.movements;

-- 6. Seed demo (opcional) — ver supabase/seed_demo.sql
-- Personas demo: Aragorn, Frodo, Gandalf, Legolas, Sam
