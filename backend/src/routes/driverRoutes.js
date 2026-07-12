const express = require("express");

const router = express.Router();

const driverController = require("../controllers/driverController");
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");

const {
  createDriverSchema,
  updateDriverSchema,
} = require("../validators/driverValidator");

// ======================================
// Driver Statistics
// ======================================
router.get(
  "/statistics",
  authMiddleware,
  driverController.getDriverStatistics
);

// ======================================
// Get All Drivers
// ======================================
router.get(
  "/",
  authMiddleware,
  driverController.getAllDrivers
);

// ======================================
// Get Driver By ID
// ======================================
router.get(
  "/:id",
  authMiddleware,
  driverController.getDriverById
);

// ======================================
// Create Driver
// ======================================
router.post(
  "/",
  authMiddleware,
  validationMiddleware(createDriverSchema),
  driverController.createDriver
);

// ======================================
// Update Driver
// ======================================
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(updateDriverSchema),
  driverController.updateDriver
);

// ======================================
// Delete Driver
// ======================================
router.delete(
  "/:id",
  authMiddleware,
  driverController.deleteDriver
);

module.exports = router;