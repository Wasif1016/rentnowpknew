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

  const vendorData = {
    userId: user.id,
    businessName: "Premium Rentals Lahore",
    publicSlug: "premium-rentals-lahore",
    whatsappPhone: "923001234567",
    verificationStatus: "APPROVED",
    avgRating: "4.8",
    totalReviews: 6,
    dealerNote: "We have the latest models for Sedan, Luxury, SUV and Sports cars. All our vehicles are well-maintained and fully insured for your peace of mind.",
    locationAddress: "Office No 1008, Park Lane Tower, Business Bay, Dubai - UAE",
    city: "Dubai",
    deliveryLocations: ["Airport Terminal 1", "Airport Terminal 2", "Airport Terminal 3"]
  };

  if (!vendor) {
    const vendorId = crypto.randomUUID();
    await db.insert(vendorProfiles).values({
      id: vendorId,
      ...vendorData
    });
    vendor = await db.query.vendorProfiles.findFirst({ where: eq(vendorProfiles.userId, user.id) });
  } else {
    // Update existing stats
    await db.update(vendorProfiles)
      .set(vendorData)
      .where(eq(vendorProfiles.id, vendor.id));
  }

  if (!vendor) throw new Error("Vendor creation failed");

  // Detailed technical data for high-fidelity detail pages
  const defaultTerms = {
    rental_policy: "Car rentals operate on a 12-hour cycle—returning late, even by an hour, may result in a full-day charge. Early contract termination may affect your rental rate. Tip: If the rental company is picking up the car, ensure the vehicle is ready and accessible at the agreed time to avoid delays or extra charges. Important: Users must carefully review the Car Rental Agreement before confirming their booking. The policies mentioned on this page are for informational purposes and reflect standard car rental practices in Dubai.",
    fuel_policy: "Return the car with the same fuel level as received to avoid refueling charges. Tip: Take a picture of the fuel gauge at pickup and drop-off as proof, and keep the fuel receipt to avoid disputes.",
    mileage_policy: "Standard mileage limit is 250 km per day. Additional mileage is charged at AED 5 per km. Monthly rentals include 4500 km.",
    deposit_policy: "A refundable security deposit of AED 2,000 is required via credit card pre-authorization. The amount will be released after 21-30 days of car return to account for any RTA fines or Salik charges."
  };

  const newCars = [
    {
      name: "718 Boxster Convertible",
      make: "Porsche",
      model: "718",
      year: 2025,
      slug: "porsche-718-boxster-2025",
      priceDay: "50000",
      priceMonth: "1200000",
      images: [
        "/white-coupe-sport-car-standing-road-front-view.jpg",
        "/blue-jeep-photo-shooting-sunset.jpg",
        "/mini-coupe-high-speed-drive-road-with-front-lights.jpg",
        "/yellow-car-gas-station.jpg"
      ],
      transmission: "Automatic",
      fuelType: "Petrol",
      engineCapacity: "2.0L Turbo",
      seatingCapacity: 2,
      doors: 2,
      exteriorColor: "White",
      interiorColor: "Red/Black",
      bodyType: "Convertible",
      features: {
        interior: ["Leather Seats", "Bose Surround Sound", "Apple CarPlay", "Dual Zone Climate"],
        safety: ["Parking Sensors", "Reverse Camera", "Cruise Control", "ABS"],
        exterior: ["LED Headlights", "Soft Top", "Alloy Wheels"]
      },
      rentalTerms: defaultTerms,
      description: "Experience the thrill of the open road in the Porsche 718 Boxster. This high-performance convertible combines legendary handling with modern luxury. Perfect for a weekend getaway in Lahore or a stylish drive through the city."
    },
    {
      name: "A6",
      make: "Audi",
      model: "A6",
      year: 2025,
      slug: "audi-a6-2025",
      priceDay: "30000",
      priceMonth: "750000",
      images: [
        "/blue-jeep-photo-shooting-sunset.jpg",
        "/white-coupe-sport-car-standing-road-front-view.jpg",
        "/mini-coupe-high-speed-drive-road-with-front-lights.jpg",
        "/yellow-car-gas-station.jpg"
      ],
      transmission: "Automatic",
      fuelType: "Petrol",
      engineCapacity: "2.0L TFSI",
      seatingCapacity: 5,
      doors: 4,
      exteriorColor: "Dark Blue",
      interiorColor: "Beige",
      bodyType: "Sedan",
      features: {
        interior: ["Virtual Cockpit", "MMI Touch", "Premium Audio", "Ambient Lighting"],
        safety: ["Lane Assist", "Audi Pre Sense", "Matrix LED", "360 Camera"],
        exterior: ["Sunroof", "S-Line Styling", "19-inch Wheels"]
      },
      rentalTerms: defaultTerms,
      description: "The Audi A6 defines the executive sedan. With its sophisticated design and cutting-edge technology, it offers a seamless blend of comfort and performance for the discerning driver."
    },
    {
      name: "A3",
      make: "Audi",
      model: "A3",
      year: 2025,
      slug: "audi-a3-2025",
      priceDay: "25000",
      priceMonth: "650000",
      images: [
        "/mini-coupe-high-speed-drive-road-with-front-lights.jpg",
        "/white-coupe-sport-car-standing-road-front-view.jpg",
        "/blue-jeep-photo-shooting-sunset.jpg",
        "/yellow-car-gas-station.jpg"
      ],
      transmission: "Automatic",
      fuelType: "Petrol",
      engineCapacity: "1.4L Turbo",
      seatingCapacity: 5,
      doors: 4,
      exteriorColor: "Silver",
      interiorColor: "Black Leather",
      bodyType: "Sedan",
      features: {
        interior: ["Digital Instrument Cluster", "Smartphone Interface", "Panoramic Sunroof"],
        safety: ["Emergency Braking", "Blind Spot Monitor", "Parking Assist"],
        exterior: ["Sport Body Kit", "LED DRLs", "Privacy Glass"]
      },
      rentalTerms: defaultTerms,
      description: "Compact yet powerful, the Audi A3 is the perfect city companion. It brings Audi's signature luxury and build quality to a versatile and agile package."
    },
    {
      name: "Tiggo 7 Pro",
      make: "Chery",
      model: "Tiggo 7 Pro",
      year: 2025,
      slug: "chery-tiggo-7-pro-2025",
      priceDay: "12000",
      priceMonth: "300000",
      images: [
        "/yellow-car-gas-station.jpg",
        "/blue-jeep-photo-shooting-sunset.jpg",
        "/mini-coupe-high-speed-drive-road-with-front-lights.jpg",
        "/white-coupe-sport-car-standing-road-front-view.jpg"
      ],
      transmission: "CVT",
      fuelType: "Petrol",
      engineCapacity: "1.5L Turbo",
      seatingCapacity: 5,
      luggageCapacity: 475,
      doors: 5,
      exteriorColor: "Yellow/Gold",
      interiorColor: "Black/Grey",
      bodyType: "SUV",
      features: {
        interior: ["Dual Screen Setup", "Wireless Charging", "Electric Seats", "Rear AC Vents"],
        safety: ["6 Airbags", "Tire Pressure Monitor", "Hills Hold Assist"],
        exterior: ["Roof Rails", "Alloy Wheels", "Automatic Tailgate"]
      },
      rentalTerms: defaultTerms,
      description: "The Chery Tiggo 7 Pro is a modern SUV designed for the family. It's packed with safety features and technology, providing a comfortable and secure ride for everyone inside."
    }
  ];

  for (const car of newCars) {
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.slug, car.slug)
    });

    const carData = {
      vendorId: vendor.id,
      slug: car.slug,
      name: car.name,
      make: car.make,
      model: car.model,
      year: car.year,
      isActive: true,
      priceSelfDriveDay: car.priceDay,
      priceSelfDriveMonth: car.priceMonth,
      pickupFormattedAddress: "DHA Phase 5, Lahore",
      transmission: car.transmission,
      fuelType: car.fuelType,
      engineCapacity: car.engineCapacity,
      seatingCapacity: car.seatingCapacity,
      luggageCapacity: car.luggageCapacity || null,
      doors: car.doors,
      exteriorColor: car.exteriorColor,
      interiorColor: car.interiorColor,
      bodyType: car.bodyType,
      features: car.features,
      description: car.description
    };

    let vehicleId;
    if (!existing) {
      vehicleId = crypto.randomUUID();
      await db.insert(vehicles).values({
        id: vehicleId,
        ...carData
      });
      console.log("Added", car.make, car.name);
    } else {
      vehicleId = existing.id;
      await db.update(vehicles).set(carData).where(eq(vehicles.id, vehicleId));
      console.log("Updated", car.make, car.name);
    }

    // Always refresh images
    await db.delete(vehicleImages).where(eq(vehicleImages.vehicleId, vehicleId));
    for (let i = 0; i < car.images.length; i++) {
      await db.insert(vehicleImages).values({
        id: crypto.randomUUID(),
        vehicleId: vehicleId,
        url: car.images[i],
        isCover: i === 0,
        sortOrder: i
      });
    }
  }

  // Hide the test-vehicle from the layout so only 4 show
  await db.update(vehicles).set({ isActive: false }).where(eq(vehicles.slug, "test-vehicle"));

  console.log("Cars fixed and seeded to Lahore vendor!");
  process.exit(0);
}

seedFeaturedCars();
