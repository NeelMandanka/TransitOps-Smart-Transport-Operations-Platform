const express = require("express");

const router = express.Router();


const dashboardController = require("../controllers/dashboardController");




// Dashboard Overview
router.get(
    "/",
    dashboardController.getDashboardOverview
);




// Vehicle Status Statistics
router.get(
    "/vehicle-status",
    dashboardController.getVehicleStatusStats
);




// Expense Summary
router.get(
    "/expenses",
    dashboardController.getExpenseSummary
);



module.exports = router;