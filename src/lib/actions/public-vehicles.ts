"use server"

import { db } from "@/lib/db"
import { vehicles, vehicleImages, vendorProfiles } from "@/lib/db/schema"
import { eq, desc, isNotNull } from "drizzle-orm"

export async function getFeaturedVehicles(limit = 4) {
  try {
    const data = await db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        slug: vehicles.slug,
        priceDay: vehicles.priceSelfDriveDay,
        priceMonth: vehicles.priceSelfDriveMonth,
        pickupAddress: vehicles.pickupFormattedAddress,
        vendorLogo: vendorProfiles.businessLogoUrl,
        vendorPhone: vendorProfiles.whatsappPhone,
        vendorWhatsapp: vendorProfiles.whatsappPhone,
        coverImage: vehicleImages.url
      })
      .from(vehicles)
      .leftJoin(vendorProfiles, eq(vehicles.vendorId, vendorProfiles.id))
      .leftJoin(vehicleImages, eq(vehicles.id, vehicleImages.vehicleId))
      .where(isNotNull(vehicleImages.url)) // Basic filter
      .orderBy(desc(vehicles.createdAt))
      .limit(limit)

    // A vehicle may have multiple images, but we'll deduplicate by vehicle ID in JS to ensure we get exactly 4 vehicles.
    const dedupedMap = new Map()
    for (const row of data) {
      if (!dedupedMap.has(row.id)) {
        dedupedMap.set(row.id, row)
      }
    }

    const dedupedData = Array.from(dedupedMap.values()).slice(0, limit)

    return { success: true, data: dedupedData }
  } catch (error) {
    console.error("Error fetching featured vehicles:", error)
    return { success: false, error: "Failed to load featured vehicles" }
  }
}
