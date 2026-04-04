import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { vehicles } from '@/lib/db/schema'

/** Drizzle `db` or transaction client (same `select` API). */
type DbOrTx = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db

/**
 * URL-safe slug from listing fields. Not guaranteed unique per vendor until
 * {@link ensureUniqueVendorVehicleSlug} runs.
 */
export function slugifyVehicleBase(
  name: string,
  model: string,
  year: number
): string {
  const raw = `${name} ${model} ${year}`
  const slug = raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
  return slug || 'vehicle'
}

/**
 * Resolves a unique `slug` for `(vendorId, slug)` unique index.
 * Tries `base`, then `base-2`, `base-3`, …
 */
export async function ensureUniqueVendorVehicleSlug(
  dbOrTx: DbOrTx,
  vendorId: string,
  base: string
): Promise<string> {
  for (let i = 0; i < 500; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const [row] = await dbOrTx
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(and(eq(vehicles.vendorId, vendorId), eq(vehicles.slug, candidate)))
      .limit(1)
    if (!row) return candidate
  }
  throw new Error('Could not allocate a unique vehicle slug.')
}
