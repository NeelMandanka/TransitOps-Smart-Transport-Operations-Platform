const express = require("express");

const authRoutes = require("./authRoutes");
const tripRoutes = require("./tripRoutes");
const maintenanceRoutes = require("./maintenanceRoutes");
const fuelRoutes = require("./fuelRoutes");
const expenseRoutes = require("./expenseRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const reportRoutes = require("./reportRoutes");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);


/*
Developer 2
router.use("/vehicles", vehicleRoutes);
router.use("/drivers", driverRoutes);

Developer 3
router.use("/maintenance", maintenanceRoutes);
router.use("/fuel", fuelRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
*/

module.exports = router;