import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm"
import { db } from "@/lib/db"
import { users, vehicles, vendorProfiles } from "@/lib/db/schema"

export const ADMIN_VENDORS_PAGE_SIZE = 20

export type VendorVerificationFilter =
  | "all"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"

export type AdminVendorListRow = {
  id: string
  businessName: string
  userEmail: string
  verificationStatus: (typeof vendorProfiles.$inferSelect)["verificationStatus"]
  verificationSubmittedAt: Date | null
  vehicleCount: number
  createdAt: Date
}

export type AdminVendorDetail = {
  profile: typeof vendorProfiles.$inferSelect
  user: Pick<
    typeof users.$inferSelect,
    "id" | "email" | "fullName" | "phone" | "avatarUrl"
  >
  vehicleCount: number
}

/** Escape `%`, `_`, and `\` for PostgreSQL ILIKE patterns. */
function escapeIlikePattern(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
}

function buildSearchPattern(raw: string): string | null {
  const q = raw.trim().slice(0, 120)
  if (!q) return null
  return `%${escapeIlikePattern(q)}%`
}

function listWhereClause(filters: {
  q?: string | null
  status?: VendorVerificationFilter | null
}): SQL | undefined {
  const parts: SQL[] = []

  const status = filters.status ?? "all"
  if (status !== "all") {
    parts.push(eq(vendorProfiles.verificationStatus, status))
  }

  const pattern = buildSearchPattern(filters.q ?? "")
  if (pattern) {
    parts.push(
      or(
        ilike(vendorProfiles.businessName, pattern),
        ilike(users.email, pattern)
      )!
    )
  }

  if (parts.length === 0) return undefined
  if (parts.length === 1) return parts[0]
  return and(...parts)!
}

/**
 * When there is no text search, total count equals counting `vendor_profiles` rows only
 * (each row has exactly one `users` row). Skip joining `users` so Postgres does less work
 * and holds fewer locks — the old `COUNT(⋈ users) WHERE true` was redundant for that case.
 */
function vendorOnlyWhereForCount(filters: {
  status?: VendorVerificationFilter | null
}): SQL | undefined {
  const status = filters.status ?? "all"
  if (status === "all") return undefined
  return eq(vendorProfiles.verificationStatus, status)
}

export async function countAdminVendors(filters: {
  q?: string | null
  status?: VendorVerificationFilter | null
}): Promise<number> {
  const hasTextSearch = buildSearchPattern(filters.q ?? "") != null

  if (!hasTextSearch) {
    const where = vendorOnlyWhereForCount(filters)
    const [row] = await db
      .select({ n: count() })
      .from(vendorProfiles)
      .where(where ?? sql`true`)
    return Number(row?.n ?? 0)
  }

  const where = listWhereClause(filters)
  const [row] = await db
    .select({ n: count() })
    .from(vendorProfiles)
    .innerJoin(users, eq(vendorProfiles.userId, users.id))
    .where(where ?? sql`true`)

  return Number(row?.n ?? 0)
}

/** Pre-aggregated vehicle counts — avoids a correlated subquery per row (cheaper for the planner + pooler). */
const vehicleCountCte = db.$with("vc").as(
  db
    .select({
      vendorId: vehicles.vendorId,
      cnt: sql<number>`count(*)::int`.as("cnt"),
    })
    .from(vehicles)
    .groupBy(vehicles.vendorId)
)

/**
 * Paginated list plus total row count in one round trip (`COUNT(*) OVER()`), so the admin
 * page does not need a separate `count(*)` query (halves DB work vs count+list in series).
 */
export async function listAdminVendorsWithTotal(options: {
  q?: string | null
  status?: VendorVerificationFilter | null
  page?: number
  sort?: "created_desc" | "created_asc"
}): Promise<{ rows: AdminVendorListRow[]; total: number }> {
  const page = Math.max(1, options.page ?? 1)
  const offset = (page - 1) * ADMIN_VENDORS_PAGE_SIZE
  const sortDesc = (options.sort ?? "created_desc") === "created_desc"
  const where = listWhereClause(options)

  const raw = await db
    .with(vehicleCountCte)
    .select({
      id: vendorProfiles.id,
      businessName: vendorProfiles.businessName,
      userEmail: users.email,
      verificationStatus: vendorProfiles.verificationStatus,
      verificationSubmittedAt: vendorProfiles.verificationSubmittedAt,
      createdAt: vendorProfiles.createdAt,
      vehicleCount: sql<number>`coalesce(${vehicleCountCte.cnt}, 0)`.mapWith(Number),
      _totalMatching: sql<number>`(count(*) over ())::int`.mapWith(Number),
    })
    .from(vendorProfiles)
    .innerJoin(users, eq(vendorProfiles.userId, users.id))
    .leftJoin(vehicleCountCte, eq(vendorProfiles.id, vehicleCountCte.vendorId))
    .where(where ?? sql`true`)
    .orderBy(
      sortDesc ? desc(vendorProfiles.createdAt) : asc(vendorProfiles.createdAt)
    )
    .limit(ADMIN_VENDORS_PAGE_SIZE)
    .offset(offset)

  if (raw.length === 0) {
    if (offset === 0) {
      return { rows: [], total: 0 }
    }
    const total = await countAdminVendors({
      q: options.q,
      status: options.status,
    })
    return { rows: [], total }
  }

  const total = raw[0]?._totalMatching ?? 0
  const rows: AdminVendorListRow[] = raw.map((r) => {
    const { _totalMatching, ...rest } = r
    return {
      ...rest,
      vehicleCount: Number(rest.vehicleCount ?? 0),
    }
  })

  return { rows, total }
}

/** @deprecated Prefer listAdminVendorsWithTotal to avoid an extra COUNT round trip. */
export async function listAdminVendors(options: {
  q?: string | null
  status?: VendorVerificationFilter | null
  page?: number
  sort?: "created_desc" | "created_asc"
}): Promise<AdminVendorListRow[]> {
  const { rows } = await listAdminVendorsWithTotal(options)
  return rows
}

export async function getAdminVendorDetail(
  vendorProfileId: string
): Promise<AdminVendorDetail | null> {
  const [row] = await db
    .with(vehicleCountCte)
    .select({
      profile: vendorProfiles,
      userId: users.id,
      userEmail: users.email,
      userFullName: users.fullName,
      userPhone: users.phone,
      userAvatarUrl: users.avatarUrl,
      vehicleCount: sql<number>`coalesce(${vehicleCountCte.cnt}, 0)`.mapWith(Number),
    })
    .from(vendorProfiles)
    .innerJoin(users, eq(vendorProfiles.userId, users.id))
    .leftJoin(vehicleCountCte, eq(vendorProfiles.id, vehicleCountCte.vendorId))
    .where(eq(vendorProfiles.id, vendorProfileId))
    .limit(1)

  if (!row) return null

  return {
    profile: row.profile,
    user: {
      id: row.userId,
      email: row.userEmail,
      fullName: row.userFullName,
      phone: row.userPhone,
      avatarUrl: row.userAvatarUrl,
    },
    vehicleCount: Number(row.vehicleCount ?? 0),
  }
}
