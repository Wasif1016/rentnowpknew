import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('--- Starting Manual Migration ---');
  try {
    await db.execute(sql`
      ALTER TABLE vehicles 
      ADD COLUMN IF NOT EXISTS transmission TEXT,
      ADD COLUMN IF NOT EXISTS fuel_type TEXT,
      ADD COLUMN IF NOT EXISTS engine_capacity TEXT,
      ADD COLUMN IF NOT EXISTS seating_capacity INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS luggage_capacity INTEGER,
      ADD COLUMN IF NOT EXISTS doors INTEGER DEFAULT 4,
      ADD COLUMN IF NOT EXISTS exterior_color TEXT,
      ADD COLUMN IF NOT EXISTS interior_color TEXT,
      ADD COLUMN IF NOT EXISTS body_type TEXT,
      ADD COLUMN IF NOT EXISTS features JSONB,
      ADD COLUMN IF NOT EXISTS rental_terms JSONB,
      ADD COLUMN IF NOT EXISTS faqs JSONB,
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
    console.log('✅ Successfully added missing columns to vehicles table.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrate().then(() => process.exit(0));
