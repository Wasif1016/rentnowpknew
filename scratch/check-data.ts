import "dotenv/config";
import { db } from "./src/lib/db";

async function checkData() {
  try {
    const v = await db.query.vehicles.findFirst();
    console.log("Found vehicle:", v ? v.id : "NONE");
  } catch (e) {
    console.error("Error:", e);
  }
}

checkData();
