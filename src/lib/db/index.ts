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
    // Allow concurrent queries (e.g. Promise.all on admin routes). With max: 1, every
    // parallel DB call queues on one connection — latency stacks (RTT × N) and feels
    // like multi-minute loads on remote Supabase. Pooler-friendly small pool is fine.
    max: 5,
    // Required for Supabase pooler (PgBouncer, port 6543 / transaction mode):
    // prepared statements are not supported across pooled connections.
    prepare: false,
    // Reduce flaky ECONNRESETs with remote poolers (idle disconnects, TLS).
    connect_timeout: 30,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgres = client;
}

export const db = drizzle(client, { schema });
export { client, schema };
