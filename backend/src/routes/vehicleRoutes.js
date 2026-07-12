const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createVehicleSchema,
  updateVehicleSchema,
} = require("../validators/vehicleValidator");

// ==============================
// Vehicle Statistics
// ==============================
router.get(
  "/statistics",
  authMiddleware,
  vehicleController.getVehicleStatistics
);

// ==============================
// Get All Vehicles
// ==============================
router.get(
  "/",
  authMiddleware,
  vehicleController.getAllVehicles
);

// ==============================
// Get Vehicle By ID
// ==============================
router.get(
  "/:id",
  authMiddleware,
  vehicleController.getVehicleById
);

// ==============================
// Create Vehicle
// ==============================
router.post(
  "/",
  authMiddleware,
  validationMiddleware(createVehicleSchema),
  vehicleController.createVehicle
);

// ==============================
// Update Vehicle
// ==============================
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(updateVehicleSchema),
  vehicleController.updateVehicle
);

// ==============================
// Delete Vehicle
// ==============================
router.delete(
  "/:id",
  authMiddleware,
  vehicleController.deleteVehicle
);

module.exports = router;