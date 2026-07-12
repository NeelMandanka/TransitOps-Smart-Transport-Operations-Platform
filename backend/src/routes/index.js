const express = require("express");

const authRoutes = require("./authRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const driverRoutes = require("./driverRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/drivers", driverRoutes);

/*

Developer 3
router.use("/trips", tripRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
*/

module.exports = router;