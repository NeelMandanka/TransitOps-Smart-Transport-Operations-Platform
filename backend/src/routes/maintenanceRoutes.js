const express = require("express");

const router = express.Router();


const maintenanceController = require("../controllers/maintenanceController");


const {
    createMaintenanceValidator,
    updateMaintenanceValidator,
    maintenanceIdValidator
} = require("../validators/maintenanceValidator");


const validationMiddleware = require("../middleware/validationMiddleware");




// Create Maintenance Record
router.post(
    "/",
    validationMiddleware(createMaintenanceValidator),
    maintenanceController.createMaintenance
);




// Get All Maintenance Records
router.get(
    "/",
    maintenanceController.getAllMaintenance
);




// Get Maintenance By ID
router.get(
    "/:id",
    validationMiddleware(maintenanceIdValidator),
    maintenanceController.getMaintenanceById
);




// Update Maintenance Record
router.put(
    "/:id",
    validationMiddleware(maintenanceIdValidator),
    validationMiddleware(updateMaintenanceValidator),
    maintenanceController.updateMaintenance
);




// Delete Maintenance Record
router.delete(
    "/:id",
    validationMiddleware(maintenanceIdValidator),
    maintenanceController.deleteMaintenance
);



module.exports = router;