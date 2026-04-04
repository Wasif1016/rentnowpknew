import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { vendorProfiles } from '@/lib/db/schema'

export async function getVendorProfileByUserId(userId: string) {
  const [row] = await db
    .select()
    .from(vendorProfiles)
    .where(eq(vendorProfiles.userId, userId))
    .limit(1)
  return row ?? null
}
