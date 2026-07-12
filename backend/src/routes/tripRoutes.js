const express = require("express");

const router = express.Router();

const tripController = require("../controllers/tripController");

const {
    createTripValidator,
    updateTripValidator,
    tripIdValidator
} = require("../validators/tripValidator");

const validationMiddleware = require("../middleware/validationMiddleware");

router.get("/", tripController.getAllTrips);

// Create Trip
router.post(
    "/",
    validationMiddleware(createTripValidator),
    tripController.createTrip
);



// Get all Trips
router.get(
    "/",
    tripController.getAllTrips
);



// Get Trip by ID
router.get(
    "/:id",
    validationMiddleware(tripIdValidator),
    tripController.getTripById
);



// Update Trip
router.put(
    "/:id",
    validationMiddleware(tripIdValidator),
    validationMiddleware(updateTripValidator),
    tripController.updateTrip
);



// Delete Trip
router.delete(
    "/:id",
    validationMiddleware(tripIdValidator),
    tripController.deleteTrip
);



module.exports = router;