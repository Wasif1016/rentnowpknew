"use server"

import { db, client } from "@/lib/db"
import { vehicles, vehicleImages, vendorProfiles, reviews, users } from "@/lib/db/schema"
import { eq, desc, isNotNull, and, not, sql } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"

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
        vendorSlug: vendorProfiles.publicSlug,
        coverImage: vehicleImages.url
      })
      .from(vehicles)
      .leftJoin(vendorProfiles, eq(vehicles.vendorId, vendorProfiles.id))
      .leftJoin(vehicleImages, eq(vehicles.id, vehicleImages.vehicleId))
      .where(isNotNull(vehicleImages.url)) // Basic filter
      .orderBy(desc(vehicles.createdAt))
      .limit(limit * 2) // Fetch more to ensure we get enough unique vehicles after join duplication

    // A vehicle may have multiple images, but we'll deduplicate by vehicle ID in JS to ensure we get unique vehicles.
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

export async function getVehicleDetails(vendorSlug: string, vehicleSlug: string) {
  noStore();
  console.log(`[getVehicleDetails] Querying for: vendor=${vendorSlug}, vehicle=${vehicleSlug}`)
  try {
    // TEMPORARY MIGRATION: Ensure schema is updated using raw client
    try {
      const vehicleCols = [
        "transmission", "fuel_type", "engine_capacity", "seating_capacity",
        "luggage_capacity", "doors", "exterior_color", "interior_color",
        "body_type", "features", "rental_terms", "faqs", "description"
      ];
      for (const col of vehicleCols) {
        const type = col.includes("capacity") || col === "doors" ? "INTEGER" : (col.includes("features") || col.includes("terms") || col === "faqs" ? "JSONB" : "TEXT");
        await client.unsafe(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS ${col} ${type}`).execute();
      }

      const vendorCols = [
        "business_banner_url", "location_address", "city", "dealer_note"
      ];
      for (const col of vendorCols) {
        await client.unsafe(`ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS ${col} TEXT`).execute();
      }
      await client.unsafe(`ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS delivery_locations JSONB`).execute();

      // Create listing_reports table if not exists
      await client.unsafe(`
        CREATE TABLE IF NOT EXISTS listing_reports (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          vehicle_id UUID NOT NULL REFERENCES vehicles(id),
          user_id UUID REFERENCES users(id),
          reason TEXT NOT NULL,
          details TEXT,
          status TEXT NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `).execute();
    } catch (e) {
      console.error("[Migration Error]", e);
    }

    // 1. Fetch vehicle and vendor data using a join to ensure slug uniqueness per vendor
    const result = await db
      .select({
        vehicle: vehicles,
        vendor: vendorProfiles,
      })
      .from(vehicles)
      .innerJoin(vendorProfiles, eq(vehicles.vendorId, vendorProfiles.id))
      .where(
        and(
          eq(vehicles.slug, vehicleSlug),
          eq(vendorProfiles.publicSlug, vendorSlug)
        )
      )
      .limit(1)

    if (result.length === 0) {
      console.warn(`[getVehicleDetails] No match found in DB for slugs:`, { vendorSlug, vehicleSlug })
      return { success: false, error: "Vehicle not found" }
    }

    const { vehicle, vendor } = result[0]

    // Fetch images separately or as part of a complex join (simpler to fetch here)
    const images = await db.query.vehicleImages.findMany({
      where: eq(vehicleImages.vehicleId, vehicle.id),
      orderBy: (imgs) => [desc(imgs.isCover), desc(imgs.sortOrder)]
    })

    const fullVehicle = {
      ...vehicle,
      vendor,
      images
    }

    // 2. Fetch related vehicles (same vendor or same body type)
    const relatedData = await db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        slug: vehicles.slug,
        priceDay: vehicles.priceSelfDriveDay,
        vendorSlug: vendorProfiles.publicSlug,
        coverImage: vehicleImages.url
      })
      .from(vehicles)
      .leftJoin(vendorProfiles, eq(vehicles.vendorId, vendorProfiles.id))
      .leftJoin(vehicleImages, eq(vehicles.id, vehicleImages.vehicleId))
      .where(
        (t) => {
          const filters = [
            eq(vehicles.isActive, true),
            not(eq(vehicles.id, vehicle.id))
          ]
          return and(...filters)
        }
      )
      .limit(4)

    // Dedupe
    const dedupedRelated = []
    const seen = new Set()
    for (const v of relatedData) {
      if (!seen.has(v.id)) {
        seen.add(v.id)
        dedupedRelated.push(v)
      }
    }

    // 3. Fetch reviews for the vendor
    const vendorReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: users.fullName,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.customerUserId, users.id))
      .where(eq(reviews.vendorId, vendor.id))
      .orderBy(desc(reviews.createdAt))
      .limit(5)

    return {
      success: true,
      data: {
        ...fullVehicle,
        related: dedupedRelated,
        reviews: vendorReviews
      }
    }
  } catch (error) {
    console.error("Error fetching vehicle details:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

