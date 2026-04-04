import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { vehicles, vendorProfiles } from '@/lib/db/schema'

export type VehicleNearRow = {
  vehicleId: string
  vendorId: string
  slug: string
  name: string
  distanceKm: number
}

export type FindVehiclesNearPointParams = {
  lat: number
  lng: number
  /** Search radius in kilometers (Haversine straight-line to vehicle pickup). */
  radiusKm: number
  limit?: number
  /** When true, only vendors approved for public listing. */
  vendorApprovedOnly?: boolean
  /** When true, only `is_active` vehicles. */
  activeOnly?: boolean
}

/**
 * Haversine distance in km between query point and `vehicles.pickup_*` (SQL expression).
 */
function haversineKmExpr(lat: number, lng: number) {
  return sql`(6371 * acos(least(1::float, greatest(-1::float,
    cos(radians(${lat})) * cos(radians(${vehicles.pickupLatitude})) *
    cos(radians(${vehicles.pickupLongitude}) - radians(${lng})) +
    sin(radians(${lat})) * sin(radians(${vehicles.pickupLatitude}))
  ))))`
}

/**
 * Vehicles with a stored pickup point within `radiusKm` of `(lat, lng)`,
 * ordered by straight-line distance (Haversine in SQL).
 *
 * Future: re-rank top results with Driving Distance Matrix for driving-time ordering.
 */
export async function findVehiclesNearPoint(
  params: FindVehiclesNearPointParams
): Promise<VehicleNearRow[]> {
  const {
    lat,
    lng,
    radiusKm,
    limit = 50,
    vendorApprovedOnly = true,
    activeOnly = true,
  } = params

  const dist = haversineKmExpr(lat, lng).as('distance_km')

  const conditions = [
    isNotNull(vehicles.pickupLatitude),
    isNotNull(vehicles.pickupLongitude),
    sql`${haversineKmExpr(lat, lng)} <= ${radiusKm}`,
  ]

  if (activeOnly) {
    conditions.push(eq(vehicles.isActive, true))
  }

  if (vendorApprovedOnly) {
    conditions.push(eq(vendorProfiles.verificationStatus, 'APPROVED'))
  }

  const rows = await db
    .select({
      vehicleId: vehicles.id,
      vendorId: vehicles.vendorId,
      slug: vehicles.slug,
      name: vehicles.name,
      distanceKm: dist,
    })
    .from(vehicles)
    .innerJoin(vendorProfiles, eq(vehicles.vendorId, vendorProfiles.id))
    .where(and(...conditions))
    .orderBy(dist)
    .limit(limit)

  return rows.map((r) => ({
    vehicleId: r.vehicleId,
    vendorId: r.vendorId,
    slug: r.slug,
    name: r.name,
    distanceKm: Number(r.distanceKm),
  }))
}
