const { z } = require("zod");


// Create Trip Validator
const createTripValidator = z.object({
    source: z
        .string()
        .min(2, "Source is required"),

    destination: z
        .string()
        .min(2, "Destination is required"),

    cargoWeight: z
        .number()
        .positive("Cargo weight must be positive"),

    plannedDistance: z
        .number()
        .positive("Planned distance must be positive"),

    actualDistance: z
        .number()
        .positive()
        .optional(),

    revenue: z
        .number()
        .positive()
        .optional(),

    fuelConsumed: z
        .number()
        .positive()
        .optional(),

    finalOdometer: z
        .number()
        .positive()
        .optional(),

    status: z
        .enum([
            "DRAFT",
            "DISPATCHED",
            "COMPLETED",
            "CANCELLED"
        ])
        .optional(),

    vehicleId: z
        .number()
        .int()
        .positive("Invalid vehicle id"),

    driverId: z
        .number()
        .int()
        .positive("Invalid driver id")
});


// Update Trip Validator
const updateTripValidator = z.object({

    source: z
        .string()
        .min(2)
        .optional(),

    destination: z
        .string()
        .min(2)
        .optional(),

    cargoWeight: z
        .number()
        .positive()
        .optional(),

    plannedDistance: z
        .number()
        .positive()
        .optional(),

    actualDistance: z
        .number()
        .positive()
        .optional(),

    revenue: z
        .number()
        .positive()
        .optional(),

    fuelConsumed: z
        .number()
        .positive()
        .optional(),

    finalOdometer: z
        .number()
        .positive()
        .optional(),

    status: z
        .enum([
            "DRAFT",
            "DISPATCHED",
            "COMPLETED",
            "CANCELLED"
        ])
        .optional(),

    vehicleId: z
        .number()
        .int()
        .positive()
        .optional(),

    driverId: z
        .number()
        .int()
        .positive()
        .optional()

});


module.exports = {
    createTripValidator,
    updateTripValidator
};