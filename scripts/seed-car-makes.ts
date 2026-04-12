import "dotenv/config";
import { db } from "@/lib/db";
import { carMakes } from "@/lib/db/schema";
import crypto from "crypto";

async function fetchAndSeedMakes() {
  console.log("Fetching car makes...");
  try {
    const res = await fetch("https://carapi.app/api/makes");
    const json = await res.json();
    
    if (!json.data) throw new Error("Could not find data in car api response");
    
    const makes = json.data.map((m: any) => m.name);
    
    // We only take some top popular ones for the carousel to look good
    // Or we take all of them. The user said "fetch all logos and save that to our database".
    console.log(`Found ${makes.length} car makes.`);

    // Logo.dev uses domain names like `toyota.com` for logos.
    // For simplicity, we can do `${makeName.toLowerCase()}.com` for standard brands.
    
    let added = 0;
    for (const make of makes) {
      const sanitizedName = make.replace(/\s+/g, '').toLowerCase();
      // Use Logo.dev URL format. The user provided LOGO_DEV_PUBLISHABLE_KEY in .env
      const logoUrl = `https://img.logo.dev/${sanitizedName}.com?token=${process.env.LOGO_DEV_PUBLISHABLE_KEY}`;
      
      try {
        await db.insert(carMakes).values({
          id: crypto.randomUUID(),
          name: make,
          logoUrl: logoUrl,
          isActive: true
        }).onConflictDoNothing();
        added++;
        console.log(`Added ${make}`);
      } catch (err) {
        console.error(`Failed to insert ${make}`);
      }
    }
    
    console.log(`Successfully seeded ${added} car makes for the carousel!`);
  } catch (err) {
    console.error("Error seeding makes:", err);
  } finally {
    process.exit(0);
  }
}

fetchAndSeedMakes();
