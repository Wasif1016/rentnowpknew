import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Prevent multiple connections in development (HMR issue)
const globalForDb = globalThis as unknown as {
  postgres: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.postgres ??
  postgres(connectionString, {
    max: 1, // Connection pool size
    // Required for Supabase pooler (PgBouncer, port 6543 / transaction mode):
    // prepared statements are not supported across pooled connections.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgres = client;
}

export const db = drizzle(client, { schema });
export { schema };
