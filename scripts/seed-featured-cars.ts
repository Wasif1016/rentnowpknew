import "dotenv/config";
import { db } from "@/lib/db";
import { users, vendorProfiles, vehicles, vehicleImages } from "@/lib/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

async function seedFeaturedCars() {
  console.log("Seeding featured cars & Lahore Vendor...");

  const vendorEmail = "featured.lahore@rentnowpk.com"
  
  // Create or get user
  let user = await db.query.users.findFirst({ where: eq(users.email, vendorEmail) });
  if (!user) {
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email: vendorEmail,
      fullName: "Premium Rentals Lahore",
      role: "VENDOR"
    });
    user = await db.query.users.findFirst({ where: eq(users.email, vendorEmail) });
  }

  if (!user) throw new Error("User creation failed");

  // Create or get vendor
  let vendor = await db.query.vendorProfiles.findFirst({ where: eq(vendorProfiles.userId, user.id) });
  if (!vendor) {
    const vendorId = crypto.randomUUID();
    await db.insert(vendorProfiles).values({
      id: vendorId,
      userId: user.id,
      businessName: "Premium Rentals Lahore",
      publicSlug: "premium-rentals-lahore",
      whatsappPhone: "923001234567",
      verificationStatus: "APPROVED",
      avgRating: "5.0",
      totalReviews: 140
    });
    vendor = await db.query.vendorProfiles.findFirst({ where: eq(vendorProfiles.userId, user.id) });
  } else {
    // Update existing stats
    await db.update(vendorProfiles)
      .set({ avgRating: "5.0", totalReviews: 140 })
      .where(eq(vendorProfiles.id, vendor.id));
  }

  if (!vendor) throw new Error("Vendor creation failed");

  // Reliable image URLs for demo (Raw Github or simple Unsplash without Q params)
  const newCars = [
    {
      name: "718 Boxster Convertible",
      make: "Porsche",
      model: "718",
      year: 2025,
      slug: "porsche-718-boxster-2025",
      priceDay: "50000",
      priceMonth: "1200000",
      img: "/white-coupe-sport-car-standing-road-front-view.jpg"
    },
    {
      name: "A6",
      make: "Audi",
      model: "A6",
      year: 2025,
      slug: "audi-a6-2025",
      priceDay: "30000",
      priceMonth: "750000",
      img: "/blue-jeep-photo-shooting-sunset.jpg"
    },
    {
      name: "A3",
      make: "Audi",
      model: "A3",
      year: 2025,
      slug: "audi-a3-2025",
      priceDay: "25000",
      priceMonth: "650000",
      img: "/mini-coupe-high-speed-drive-road-with-front-lights.jpg"
    },
    {
      name: "Tiggo 7 Pro",
      make: "Chery",
      model: "Tiggo 7 Pro",
      year: 2025,
      slug: "chery-tiggo-7-pro-2025",
      priceDay: "12000",
      priceMonth: "300000",
      img: "/yellow-car-gas-station.jpg" 
    }
  ];

  for (const car of newCars) {
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.slug, car.slug)
    });

    if (!existing) {
      const vId = crypto.randomUUID();
      await db.insert(vehicles).values({
        id: vId,
        vendorId: vendor.id,
        slug: car.slug,
        name: car.name,
        make: car.make,
        model: car.model,
        year: car.year,
        isActive: true,
        priceSelfDriveDay: car.priceDay,
        priceSelfDriveMonth: car.priceMonth,
        pickupFormattedAddress: "DHA Phase 5, Lahore"
      });

      await db.insert(vehicleImages).values({
        id: crypto.randomUUID(),
        vehicleId: vId,
        url: car.img,
        isCover: true,
        sortOrder: 0
      });
      console.log("Added", car.make, car.name);
    } else {
      // Re-assign to Lahore vendor & update image/location
      await db.update(vehicles).set({ 
        vendorId: vendor.id,
        pickupFormattedAddress: "DHA Phase 5, Lahore"
      }).where(eq(vehicles.id, existing.id));

      await db.delete(vehicleImages).where(eq(vehicleImages.vehicleId, existing.id));
      await db.insert(vehicleImages).values({
        id: crypto.randomUUID(),
        vehicleId: existing.id,
        url: car.img,
        isCover: true,
        sortOrder: 0
      });
      console.log("Updated", car.make, car.name);
    }
  }

  // Hide the test-vehicle from the layout so only 4 show
  await db.update(vehicles).set({ isActive: false }).where(eq(vehicles.slug, "test-vehicle"));

  console.log("Cars fixed and seeded to Lahore vendor!");
  process.exit(0);
}

seedFeaturedCars();
