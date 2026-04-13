import "dotenv/config";
import { db } from "@/lib/db";
import { users, vendorProfiles, vehicles, reviews, bookings, customerProfiles } from "@/lib/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

async function seedReviews() {
  console.log("Seeding reviews for Lahore Vendor...");

  const vendorSlug = "premium-rentals-lahore";
  
  // 1. Get vendor
  const vendor = await db.query.vendorProfiles.findFirst({
    where: eq(vendorProfiles.publicSlug, vendorSlug),
  });

  if (!vendor) throw new Error("Vendor not found");

  // 2. Clear existing reviews for this vendor to reset
  await db.delete(reviews).where(eq(reviews.vendorId, vendor.id));

  // 3. Update vendor stats to 4.8 stars, 6 reviews
  await db.update(vendorProfiles)
    .set({ avgRating: "4.8", totalReviews: 6 })
    .where(eq(vendorProfiles.id, vendor.id));

  // 4. Get a vehicle for this vendor
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.vendorId, vendor.id),
  });

  if (!vehicle) throw new Error("Vehicle not found");

  const reviewerData = [
    { name: "Ahmed Hassan", rating: 5, comment: "Exceptional service! The car was brand new and the delivery was right on time. Highly recommended." },
    { name: "Sara Khan", rating: 4, comment: "Very good experience. The vendor was professional. Car was clean, although slightly delayed by traffic." },
    { name: "Zainab Malik", rating: 5, comment: "I've rented from them twice now. Always a smooth process. The Tiggo 7 Pro is a great drive." },
    { name: "Usman Sheikh", rating: 5, comment: "Best car rental in Lahore. Transparent pricing and no hidden charges. Very happy with the deal." },
    { name: "Bilal Farooq", rating: 5, comment: "Seamless experience. Booked via WhatsApp and got the car within 2 hours. Amazing speed!" },
    { name: "Maria Jan", rating: 5, comment: "Premium quality cars at reasonable rates. Definitely the best in DHA." }
  ];

  for (const data of reviewerData) {
    const userId = crypto.randomUUID();
    const customerProfileId = crypto.randomUUID();
    const bookingId = crypto.randomUUID();

    // Create User
    await db.insert(users).values({
      id: userId,
      email: `reviewer.${userId.slice(0, 8)}@example.com`,
      fullName: data.name,
      role: "CUSTOMER"
    });

    // Create Customer Profile
    await db.insert(customerProfiles).values({
        id: customerProfileId,
        userId: userId,
        phoneNumber: "923000000000"
    });

    // Create Completed Booking
    await db.insert(bookings).values({
      id: bookingId,
      vehicleId: vehicle.id,
      vendorId: vendor.id,
      customerProfileId: customerProfileId,
      customerUserId: userId,
      vendorUserId: vendor.userId,
      pickupAddress: "Lahore Airport",
      dropoffAddress: "DHA Phase 6",
      pickupAt: new Date(Date.now() - 86400000 * 7),
      dropoffAt: new Date(Date.now() - 86400000 * 6),
      driveType: "SELF_DRIVE",
      status: "COMPLETED"
    });

    // Create Review
    await db.insert(reviews).values({
      id: crypto.randomUUID(),
      bookingId: bookingId,
      vehicleId: vehicle.id,
      vendorId: vendor.id,
      customerUserId: userId,
      rating: data.rating,
      comment: data.comment
    });

    console.log(`Added review from ${data.name}`);
  }

  console.log("Reviews seeded successfully!");
  process.exit(0);
}

seedReviews();
