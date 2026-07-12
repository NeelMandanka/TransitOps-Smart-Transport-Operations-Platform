const express = require("express");

const router = express.Router();


const reportController = require("../controllers/reportController");




// Trip Report
router.get(
    "/trips",
    reportController.getTripReport
);




// Fuel Report
router.get(
    "/fuel",
    reportController.getFuelReport
);




// Maintenance Report
router.get(
    "/maintenance",
    reportController.getMaintenanceReport
);




// Expense Report
router.get(
    "/expenses",
    reportController.getExpenseReport
);




// Fleet Performance Report
router.get(
    "/fleet-performance",
    reportController.getFleetPerformanceReport
);



module.exports = router;