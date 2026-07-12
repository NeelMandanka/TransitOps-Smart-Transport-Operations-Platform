const { PrismaClient, RoleType, VehicleStatus, DriverStatus } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================
  // Roles
  // ============================

  const fleetManager = await prisma.role.upsert({
    where: { name: RoleType.FLEET_MANAGER },
    update: {},
    create: {
      name: RoleType.FLEET_MANAGER,
    },
  });

  await prisma.role.upsert({
    where: { name: RoleType.DISPATCHER },
    update: {},
    create: {
      name: RoleType.DISPATCHER,
    },
  });

  await prisma.role.upsert({
    where: { name: RoleType.SAFETY_OFFICER },
    update: {},
    create: {
      name: RoleType.SAFETY_OFFICER,
    },
  });

  await prisma.role.upsert({
    where: { name: RoleType.FINANCIAL_ANALYST },
    update: {},
    create: {
      name: RoleType.FINANCIAL_ANALYST,
    },
  });

  console.log("✅ Roles created");

  // ============================
  // Admin User
  // ============================

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@transitops.com",
    },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@transitops.com",
      password: hashedPassword,
      roleId: fleetManager.id,
    },
  });

  console.log("✅ Admin user created");

  // ============================
  // Vehicles
  // ============================

  const vehicles = [
    {
      registrationNumber: "GJ05AB1234",
      vehicleName: "Tata Prima",
      model: "Prima LX",
      type: "Truck",
      maxLoadCapacity: 25000,
      odometer: 125000,
      acquisitionCost: 3500000,
      status: VehicleStatus.AVAILABLE,
    },
    {
      registrationNumber: "GJ05CD5678",
      vehicleName: "Ashok Leyland",
      model: "Boss",
      type: "Truck",
      maxLoadCapacity: 18000,
      odometer: 82000,
      acquisitionCost: 2700000,
      status: VehicleStatus.AVAILABLE,
    },
    {
      registrationNumber: "GJ05EF9012",
      vehicleName: "Eicher Pro",
      model: "6028",
      type: "Truck",
      maxLoadCapacity: 16000,
      odometer: 68000,
      acquisitionCost: 2300000,
      status: VehicleStatus.IN_SHOP,
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: {
        registrationNumber: vehicle.registrationNumber,
      },
      update: {},
      create: vehicle,
    });
  }

  console.log("✅ Vehicles created");

  // ============================
  // Drivers
  // ============================

  const drivers = [
    {
      name: "Rahul Sharma",
      licenseNumber: "DL123456789",
      licenseCategory: "HMV",
      licenseExpiry: new Date("2029-12-31"),
      contactNumber: "9876543210",
      safetyScore: 95,
      status: DriverStatus.AVAILABLE,
    },
    {
      name: "Amit Patel",
      licenseNumber: "DL987654321",
      licenseCategory: "HMV",
      licenseExpiry: new Date("2028-06-30"),
      contactNumber: "9898989898",
      safetyScore: 91,
      status: DriverStatus.AVAILABLE,
    },
    {
      name: "Rakesh Singh",
      licenseNumber: "DL456123789",
      licenseCategory: "HMV",
      licenseExpiry: new Date("2027-11-15"),
      contactNumber: "9811111111",
      safetyScore: 89,
      status: DriverStatus.OFF_DUTY,
    },
  ];

  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: {
        licenseNumber: driver.licenseNumber,
      },
      update: {},
      create: driver,
    });
  }

  console.log("✅ Drivers created");

  console.log("🎉 Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });