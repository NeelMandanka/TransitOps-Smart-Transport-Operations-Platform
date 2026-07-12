const { z } = require("zod");


// Create Maintenance Validator
const createMaintenanceValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive("Vehicle ID is required"),


    title: z
        .string()
        .min(3, "Maintenance title is required"),


    description: z
        .string()
        .min(5, "Description is required"),


    cost: z
        .number()
        .positive("Cost must be positive"),


    startDate: z
        .string()
        .datetime("Invalid start date format"),


    endDate: z
        .string()
        .datetime("Invalid end date format")
        .optional(),


    isActive: z
        .boolean()
        .optional()

});




// Update Maintenance Validator
const updateMaintenanceValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive()
        .optional(),


    title: z
        .string()
        .min(3)
        .optional(),


    description: z
        .string()
        .min(5)
        .optional(),


    cost: z
        .number()
        .positive()
        .optional(),


    startDate: z
        .string()
        .datetime()
        .optional(),


    endDate: z
        .string()
        .datetime()
        .optional(),


    isActive: z
        .boolean()
        .optional()

});




// Maintenance ID Validator
const maintenanceIdValidator = z.object({

    id: z
        .string()
        .transform(Number)
        .refine(
            value => value > 0,
            "Invalid Maintenance ID"
        )

});



module.exports = {

    createMaintenanceValidator,
    updateMaintenanceValidator,
    maintenanceIdValidator

};