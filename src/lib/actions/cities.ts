"use server"

import { db } from "@/lib/db"
import { vehicleCities } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

/**
 * Fetches unique city names from the vehicle_cities table.
 * Sorted by popularity (highest occurrence first).
 */
export async function getPopularCities() {
  try {
    const cities = await db
      .select({
        name: vehicleCities.cityName,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(vehicleCities)
      .groupBy(vehicleCities.cityName)
      .orderBy(sql`count(*) desc`)
      .limit(12)

    return { 
      success: true, 
      data: cities.map(c => c.name) 
    }
  } catch (error) {
    console.error("Error fetching cities:", error)
    // Fallback to major cities if DB query fails or table is empty
    const fallback = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Multan", "Faisalabad"]
    return { success: false, data: fallback }
  }
}
