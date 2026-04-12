import "dotenv/config";
import { db } from "@/lib/db";
import { users, vendorProfiles, vehicles, vehicleCities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

async function seed() {
  console.log("Starting DB seeding...");

  try {
    // 1. Create a dummy user
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email: "test.vendor.seeder@rentnowpk.com",
      fullName: "Test Vendor Seeder",
      role: "VENDOR",
    }).onConflictDoNothing();

    const seededUser = await db.query.users.findFirst({
      where: eq(users.email, "test.vendor.seeder@rentnowpk.com"),
    });

    if (!seededUser) throw new Error("Failed to create or find test user");

    // 2. Create a vendor profile
    const vendorId = crypto.randomUUID();
    await db.insert(vendorProfiles).values({
      id: vendorId,
      userId: seededUser.id,
      businessName: "Test Vendor Seeder Business",
      publicSlug: "test-vendor-seeder",
      whatsappPhone: "923000000000",
      verificationStatus: "APPROVED",
    }).onConflictDoNothing();

    const seededVendor = await db.query.vendorProfiles.findFirst({
      where: eq(vendorProfiles.userId, seededUser.id),
    });

    if (!seededVendor) throw new Error("Failed to create or find test vendor");

    // 3. Create a vehicle
    const vehicleId = crypto.randomUUID();
    await db.insert(vehicles).values({
      id: vehicleId,
      vendorId: seededVendor.id,
      name: "Test Vehicle",
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      slug: "test-vehicle",
      isActive: true,
      priceSelfDriveDay: "5000",
    }).onConflictDoNothing();

    const seededVehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.vendorId, seededVendor.id),
    });

    if (!seededVehicle) throw new Error("Failed to create or find test vehicle");

    // 4. Clean up old cities for this vehicle
    await db.delete(vehicleCities).where(eq(vehicleCities.vehicleId, seededVehicle.id));

    // 5. Insert cities
    const citiesToSeed = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"];
    for (const city of citiesToSeed) {
      await db.insert(vehicleCities).values({
        vehicleId: seededVehicle.id,
        cityName: city,
      });
    }

    console.log("Successfully seeded cities:", citiesToSeed);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
