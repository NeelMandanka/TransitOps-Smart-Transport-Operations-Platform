const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { VehicleStatus } = require("@prisma/client");

// ===============================
// Create Vehicle
// ===============================
const createVehicle = async (vehicleData) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: {
      registrationNumber: vehicleData.registrationNumber,
    },
  });

  if (existingVehicle) {
    throw new ApiError(
      409,
      "Vehicle with this registration number already exists."
    );
  }

  const vehicle = await prisma.vehicle.create({
    data: vehicleData,
  });

  return vehicle;
};

// ===============================
// Get All Vehicles
// ===============================
const getAllVehicles = async () => {
  return await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ===============================
// Get Vehicle By ID
// ===============================
const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      trips: true,
      maintenanceLogs: true,
      fuelLogs: true,
      expenses: true,
    },
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found.");
  }

  return vehicle;
};

// ===============================
// Update Vehicle
// ===============================
const updateVehicle = async (id, vehicleData) => {
  await getVehicleById(id);

  return await prisma.vehicle.update({
    where: {
      id: Number(id),
    },
    data: vehicleData,
  });
};

// ===============================
// Delete Vehicle
// ===============================
const deleteVehicle = async (id) => {
  await getVehicleById(id);

  await prisma.vehicle.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Vehicle deleted successfully.",
  };
};

// ===============================
// Vehicle Statistics
// ===============================
const getVehicleStatistics = async () => {
  const totalVehicles = await prisma.vehicle.count();

  const availableVehicles = await prisma.vehicle.count({
    where: {
      status: VehicleStatus.AVAILABLE,
    },
  });

  const onTripVehicles = await prisma.vehicle.count({
    where: {
      status: VehicleStatus.ON_TRIP,
    },
  });

  const maintenanceVehicles = await prisma.vehicle.count({
    where: {
      status: VehicleStatus.IN_SHOP,
    },
  });

  return {
    totalVehicles,
    availableVehicles,
    onTripVehicles,
    maintenanceVehicles,
  };
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStatistics,
};