const { DriverStatus } = require("@prisma/client");
const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");

// ===============================
// Create Driver
// ===============================
const createDriver = async (driverData) => {
  const existingDriver = await prisma.driver.findUnique({
    where: {
      licenseNumber: driverData.licenseNumber,
    },
  });

  if (existingDriver) {
    throw new ApiError(
      409,
      "Driver with this license number already exists."
    );
  }

  const driver = await prisma.driver.create({
    data: {
      ...driverData,
      status: DriverStatus.AVAILABLE,
    },
  });

  return driver;
};

// ===============================
// Get All Drivers
// ===============================
const getAllDrivers = async () => {
  return await prisma.driver.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ===============================
// Get Driver By ID
// ===============================
const getDriverById = async (id) => {
  const driver = await prisma.driver.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      trips: true,
    },
  });

  if (!driver) {
    throw new ApiError(404, "Driver not found.");
  }

  return driver;
};

// ===============================
// Update Driver
// ===============================
const updateDriver = async (id, driverData) => {
  await getDriverById(id);

  return await prisma.driver.update({
    where: {
      id: Number(id),
    },
    data: driverData,
  });
};

// ===============================
// Delete Driver
// ===============================
const deleteDriver = async (id) => {
  await getDriverById(id);

  await prisma.driver.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Driver deleted successfully.",
  };
};

// ===============================
// Driver Statistics
// ===============================
const getDriverStatistics = async () => {
  const totalDrivers = await prisma.driver.count();

  const availableDrivers = await prisma.driver.count({
    where: {
      status: DriverStatus.AVAILABLE,
    },
  });

  const onTripDrivers = await prisma.driver.count({
    where: {
      status: DriverStatus.ON_TRIP,
    },
  });

  const offDutyDrivers = await prisma.driver.count({
    where: {
      status: DriverStatus.OFF_DUTY,
    },
  });

  const suspendedDrivers = await prisma.driver.count({
    where: {
      status: DriverStatus.SUSPENDED,
    },
  });

  return {
    totalDrivers,
    availableDrivers,
    onTripDrivers,
    offDutyDrivers,
    suspendedDrivers,
  };
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverStatistics,
};