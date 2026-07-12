const express = require("express");

const router = express.Router();


const fuelController = require("../controllers/fuelController");


const {
    createFuelValidator,
    updateFuelValidator,
    fuelIdValidator
} = require("../validators/fuelValidator");


const validationMiddleware = require("../middleware/validationMiddleware");




// Create Fuel Log
router.post(
    "/",
    validationMiddleware(createFuelValidator),
    fuelController.createFuel
);




// Get All Fuel Logs
router.get(
    "/",
    fuelController.getAllFuel
);




// Get Fuel Log By ID
router.get(
    "/:id",
    validationMiddleware(fuelIdValidator),
    fuelController.getFuelById
);




// Update Fuel Log
router.put(
    "/:id",
    validationMiddleware(fuelIdValidator),
    validationMiddleware(updateFuelValidator),
    fuelController.updateFuel
);




// Delete Fuel Log
router.delete(
    "/:id",
    validationMiddleware(fuelIdValidator),
    fuelController.deleteFuel
);



module.exports = router;