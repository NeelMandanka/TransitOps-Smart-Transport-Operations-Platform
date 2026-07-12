import "dotenv/config";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Driver from "./models/Driver.js";

async function seed() {
  await connectDB();

  const passwordHash = await bcrypt.hash("password123", 10);
  await User.findOneAndUpdate(
    { email: "manager@transitops.com" },
    { fullName: "Fleet Manager", email: "manager@transitops.com", passwordHash, role: "fleet_manager" },
    { upsert: true },
  );

  await Vehicle.create([
    { regNo: "GJ05JP2218", name: "VAN-05", type: "Van", capacityKg: 1200, odometerKm: 34500, acquisitionCost: 850000, region: "West" },
    { regNo: "GJ01AB1010", name: "TRK-01", type: "Truck", capacityKg: 8000, odometerKm: 120400, acquisitionCost: 3200000, region: "West" },
  ]);

  await Driver.create([
    { name: "Ravi Kumar", licenseNo: "GJ0120230001", licenseCategory: "HMV", licenseExpiry: new Date("2027-06-01"), contact: "9876543210", safetyScore: 92 },
    { name: "Meera Shah", licenseNo: "GJ0120230002", licenseCategory: "LMV", licenseExpiry: new Date("2026-12-15"), contact: "9876500000", safetyScore: 88 },
  ]);

  console.log("Seed complete. Login with manager@transitops.com / password123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
