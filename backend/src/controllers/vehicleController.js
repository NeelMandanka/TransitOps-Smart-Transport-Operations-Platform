const vehicleService = require("../services/vehicleService");
const ApiResponse = require("../utils/ApiResponse");

// ===============================
// Create Vehicle
// ===============================
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    return res
      .status(201)
      .json(ApiResponse.created("Vehicle created successfully.", vehicle));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get All Vehicles
// ===============================
const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    return res
      .status(200)
      .json(ApiResponse.success("Vehicles fetched successfully.", vehicles));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get Vehicle By ID
// ===============================
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);

    return res
      .status(200)
      .json(ApiResponse.success("Vehicle fetched successfully.", vehicle));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Update Vehicle
// ===============================
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.params.id,
      req.body
    );

    return res
      .status(200)
      .json(ApiResponse.success("Vehicle updated successfully.", vehicle));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Delete Vehicle
// ===============================
const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id);

    return res
      .status(200)
      .json(ApiResponse.success(result.message, null));
  } catch (error) {
    next(error);
  }
};

// ===============================
// Vehicle Statistics
// ===============================
const getVehicleStatistics = async (req, res, next) => {
  try {
    const statistics = await vehicleService.getVehicleStatistics();

    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Vehicle statistics fetched successfully.",
          statistics
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStatistics,
};