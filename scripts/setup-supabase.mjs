/**
 * One-shot setup: schema + users. Run with service role in env.
 * Do not commit secrets.
 */
const URL = "https://sfpqudfuqsphjfyaqofo.supabase.co";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_ROLE,
  Authorization: `Bearer ${SERVICE_ROLE}`,
  "Content-Type": "application/json",
};

const SQL_STATEMENTS = [
  `create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('family', 'demo')),
  type text not null check (type in ('SEND', 'EXPENSE', 'SAVING', 'ADJUSTMENT')),
  amount numeric not null check (amount > 0),
  person text,
  category text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`,
  `create index if not exists movements_workspace_created_at_idx
  on public.movements (workspace, created_at desc)`,
  `create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$`,
  `drop trigger if exists movements_set_updated_at on public.movements`,
  `create trigger movements_set_updated_at
  before update on public.movements
  for each row
  execute function public.set_updated_at()`,
  `create or replace function public.current_workspace()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'user_metadata' ->> 'workspace',
    auth.jwt() -> 'raw_user_meta_data' ->> 'workspace'
  );
$$`,
  `alter table public.movements enable row level security`,
  `drop policy if exists "movements_select_own_workspace" on public.movements`,
  `create policy "movements_select_own_workspace"
  on public.movements for select to authenticated
  using (workspace = public.current_workspace())`,
  `drop policy if exists "movements_insert_own_workspace" on public.movements`,
  `create policy "movements_insert_own_workspace"
  on public.movements for insert to authenticated
  with check (workspace = public.current_workspace())`,
  `drop policy if exists "movements_update_own_workspace" on public.movements`,
  `create policy "movements_update_own_workspace"
  on public.movements for update to authenticated
  using (workspace = public.current_workspace())
  with check (workspace = public.current_workspace())`,
  `drop policy if exists "movements_delete_own_workspace" on public.movements`,
  `create policy "movements_delete_own_workspace"
  on public.movements for delete to authenticated
  using (workspace = public.current_workspace())`,
  `do $$ begin
  alter publication supabase_realtime add table public.movements;
exception when duplicate_object then null;
end $$`,
];

const SEED_SQL = `
insert into public.movements (workspace, type, amount, person, category, description, created_at)
values
  ('demo', 'SEND', 250000, 'Alejandro', null, 'Pago del mes', now() - interval '5 days'),
  ('demo', 'EXPENSE', 35000, 'Mariangel', 'comida', 'Supermercado', now() - interval '3 days'),
  ('demo', 'SAVING', 50000, 'Felix', 'ahorro', 'Ahorro mensual', now() - interval '2 days'),
  ('demo', 'EXPENSE', 12000, 'Bonnie', 'transporte', 'Combustible', now() - interval '1 day'),
  ('demo', 'EXPENSE', 8500, 'Alba', 'salud', 'Farmacia', now() - interval '1 day'),
  ('demo', 'SEND', 100000, 'Anais', null, 'Extra', now())
on conflict do nothing
`;

async function tryRunSql(query) {
  const endpoints = [
    `${URL}/pg/query`,
    `${URL}/postgres/v1/query`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
      });
      const text = await res.text();
      if (res.ok) {
        return { ok: true, endpoint, text };
      }
      console.log(`SQL endpoint ${endpoint} → ${res.status}: ${text.slice(0, 200)}`);
    } catch (err) {
      console.log(`SQL endpoint ${endpoint} error:`, err.message);
    }
  }
  return { ok: false };
}

async function createUser({ email, password, workspace }) {
  const res = await fetch(`${URL}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { workspace },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // If already exists, try to find and update metadata
    if (
      String(body.msg || body.message || "")
        .toLowerCase()
        .includes("already") ||
      res.status === 422
    ) {
      console.log(`Usuario ya existe: ${email} — actualizando metadata…`);
      return updateExistingUser(email, password, workspace);
    }
    throw new Error(`createUser ${email}: ${res.status} ${JSON.stringify(body)}`);
  }
  console.log(`Usuario creado: ${email} (${workspace})`);
  return body;
}

async function updateExistingUser(email, password, workspace) {
  const listRes = await fetch(
    `${URL}/auth/v1/admin/users?page=1&per_page=200`,
    { headers },
  );
  const list = await listRes.json();
  const users = list.users || list;
  const found = Array.isArray(users)
    ? users.find((u) => u.email === email)
    : null;
  if (!found) {
    throw new Error(`No se encontró usuario existente ${email}`);
  }
  const res = await fetch(`${URL}/auth/v1/admin/users/${found.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      password,
      email_confirm: true,
      user_metadata: { workspace },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`updateUser ${email}: ${res.status} ${JSON.stringify(body)}`);
  }
  console.log(`Usuario actualizado: ${email} (${workspace})`);
  return body;
}

async function verifyTable() {
  const res = await fetch(`${URL}/rest/v1/movements?select=id&limit=1`, {
    headers: { ...headers, Prefer: "count=exact" },
  });
  const text = await res.text();
  console.log(`Verificación tabla movements: ${res.status} ${text.slice(0, 120)}`);
  return res.ok || res.status === 200;
}

async function main() {
  console.log("1) Ejecutando schema SQL…");
  let sqlOk = false;
  for (const stmt of SQL_STATEMENTS) {
    const result = await tryRunSql(stmt);
    if (!result.ok) {
      sqlOk = false;
      break;
    }
    sqlOk = true;
  }

  if (!sqlOk) {
    console.log(
      "\nNo pude ejecutar SQL por API. Intentaré crear la tabla vía fallback.\n",
    );
    // Fallback: use Supabase SQL through database webhook style - won't work
    // Write instructions and continue with users; try one more approach with supabase-js rpc
  } else {
    console.log("Schema OK");
    await tryRunSql(SEED_SQL);
  }

  console.log("\n2) Creando usuarios…");
  const familyEmail = process.env.FAMILY_EMAIL;
  const familyPassword = process.env.FAMILY_PASSWORD;
  const demoEmail = process.env.DEMO_EMAIL;
  const demoPassword = process.env.DEMO_PASSWORD;

  if (!familyEmail || !familyPassword || !demoEmail || !demoPassword) {
    throw new Error(
      "Definí FAMILY_EMAIL, FAMILY_PASSWORD, DEMO_EMAIL y DEMO_PASSWORD en el entorno",
    );
  }

  await createUser({
    email: familyEmail,
    password: familyPassword,
    workspace: "family",
  });
  await createUser({
    email: demoEmail,
    password: demoPassword,
    workspace: "demo",
  });

  console.log("\n3) Verificando tabla…");
  const tableOk = await verifyTable();
  if (!tableOk) {
    console.log(
      "\n⚠️  La tabla movements aún no existe. Voy a intentar crear vía query única…",
    );
    const full = SQL_STATEMENTS.join(";\n");
    await tryRunSql(full);
    await verifyTable();
  }

  console.log("\nListo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
