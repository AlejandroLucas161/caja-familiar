# Caja Familiar

Aplicación web privada para registrar dinero enviado a la familia y controlar gastos y saldos de forma extremadamente simple.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide, Recharts
- **Estado:** TanStack Query + Context (auth)
- **Backend:** Supabase (Auth + Postgres + Realtime + RLS)
- **Hosting:** Vercel

## Requisitos

- Node.js 20+
- Cuenta de Supabase
- Cuenta de Vercel (para deploy)

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_DEMO_EMAIL=demo@tudominio.com
NEXT_PUBLIC_DEMO_PASSWORD=una-password-segura
```

> Nunca uses la `service_role` key en el frontend.

### 3. Base de datos (Supabase)

1. Abrí el **SQL Editor** de tu proyecto Supabase.
2. Ejecutá el contenido de [`supabase/migrations/001_movements.sql`](supabase/migrations/001_movements.sql).

Eso crea:

- tabla `movements`
- índices
- trigger `updated_at`
- RLS por `workspace`
- publicación Realtime

### 4. Crear usuarios (manual)

En **Authentication → Users → Add user**, creá exactamente dos usuarios:

| Usuario | Email (ejemplo) | `user_metadata` |
|---------|-----------------|-----------------|
| Familia | `familia@tudominio.com` | `{ "workspace": "family" }` |
| Demo    | el de `NEXT_PUBLIC_DEMO_EMAIL` | `{ "workspace": "demo" }` |

En Supabase, al crear el usuario, agregá el metadata JSON:

```json
{ "workspace": "family" }
```

o

```json
{ "workspace": "demo" }
```

Desactivá el registro público si está habilitado (**Authentication → Providers → Email → Disable sign ups**).

### 5. Seed demo (opcional)

Ejecutá [`supabase/seed_demo.sql`](supabase/seed_demo.sql) en el SQL Editor (después de crear el usuario demo).

### 6. Correr la app

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Conectá el repo a Vercel.
2. Configurá las mismas variables de entorno que en `.env.local`.
3. Deploy.

## Seguridad

- Solo se usa la **anon key** en el cliente.
- RLS garantiza que cada usuario solo vea/escriba su `workspace` (`family` | `demo`).
- No hay registro público, recuperación de contraseña ni cambio de contraseña en la app (las contraseñas se gestionan manualmente en Supabase).

## Estructura

```
src/
  app/           # Rutas (login + app)
  components/    # UI compartida
  features/      # auth, dashboard, movements, statistics, settings
  hooks/
  services/      # CRUD Supabase
  lib/           # supabase, constants, query keys
  types/
  utils/
supabase/
  migrations/    # SQL
```

## Fórmula del saldo

```
Saldo = Total enviado − Total gastado (+ ajustes)
```

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build producción
npm run start    # servir build
npm run lint     # eslint
```
