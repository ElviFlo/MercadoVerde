import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
export const pg = new Pool({ connectionString });

export async function ensureSchema() {
  // crea la tabla si no existe
  await pg.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
      created_by  TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
