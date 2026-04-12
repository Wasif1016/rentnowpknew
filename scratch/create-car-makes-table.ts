import "dotenv/config";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function createTable() {
  console.log("Creating car_makes table...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "car_makes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "logo_url" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "car_makes_name_unique" UNIQUE("name")
      );
    `);
    console.log("Table created");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

createTable();
