const driverService = require("../services/driverService");
const ApiResponse = require("../utils/ApiResponse");

// ===============================
// Create Driver
// ===============================
const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body);

    return res
      .status(201)
      .json(ApiResponse.created("Driver created successfully.", driver));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get All Drivers
// ===============================
const getAllDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAllDrivers();

    return res
      .status(200)
      .json(ApiResponse.success("Drivers fetched successfully.", drivers));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get Driver By ID
// ===============================
const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);

    return res
      .status(200)
      .json(ApiResponse.success("Driver fetched successfully.", driver));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Update Driver
// ===============================
const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(
      req.params.id,
      req.body
    );

    return res
      .status(200)
      .json(ApiResponse.success("Driver updated successfully.", driver));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Delete Driver
// ===============================
const deleteDriver = async (req, res, next) => {
  try {
    const result = await driverService.deleteDriver(req.params.id);

    return res
      .status(200)
      .json(ApiResponse.success(result.message, null));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Driver Statistics
// ===============================
const getDriverStatistics = async (req, res, next) => {
  try {
    const statistics = await driverService.getDriverStatistics();

    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Driver statistics fetched successfully.",
          statistics
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDriverStatistics,
};