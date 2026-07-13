import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const password = process.env.SUPABASE_DB_PASSWORD;
const ref = "sfpqudfuqsphjfyaqofo";

if (!password) {
  console.error("Falta SUPABASE_DB_PASSWORD");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "..", "supabase", "migrations", "001_movements.sql");
const seedPath = path.join(__dirname, "..", "supabase", "seed_demo.sql");

const sql = fs.readFileSync(sqlPath, "utf8");
const seed = fs.readFileSync(seedPath, "utf8");

const hosts = [
  `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-ca-central-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`,
];

async function run() {
  let lastError;
  for (const connectionString of hosts) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    try {
      console.log("Probando conexión…", connectionString.split("@")[1]);
      await client.connect();
      console.log("Conectado. Ejecutando migración…");
      await client.query(sql);
      console.log("Migración OK. Ejecutando seed demo…");
      await client.query(seed);
      console.log("Seed OK.");
      await client.end();
      return;
    } catch (err) {
      lastError = err;
      console.log("Falló:", err.message);
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastError;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
