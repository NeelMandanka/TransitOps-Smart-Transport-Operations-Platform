const { z } = require("zod");


// Create Fuel Log Validator
const createFuelValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive("Vehicle ID is required"),


    liters: z
        .number()
        .positive("Fuel liters must be positive"),


    cost: z
        .number()
        .positive("Fuel cost must be positive"),


    date: z
        .string()
        .datetime("Invalid fuel date format")

});





// Update Fuel Log Validator
const updateFuelValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive()
        .optional(),


    liters: z
        .number()
        .positive()
        .optional(),


    cost: z
        .number()
        .positive()
        .optional(),


    date: z
        .string()
        .datetime()
        .optional()

});





// Fuel ID Validator
const fuelIdValidator = z.object({

    id: z
        .string()
        .transform(Number)
        .refine(
            value => value > 0,
            "Invalid Fuel ID"
        )

});





module.exports = {

    createFuelValidator,
    updateFuelValidator,
    fuelIdValidator

};