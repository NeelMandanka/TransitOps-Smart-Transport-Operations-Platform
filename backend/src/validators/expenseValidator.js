const { z } = require("zod");


// Create Expense Validator
const createExpenseValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive("Vehicle ID is required"),


    type: z
        .string()
        .min(2, "Expense type is required"),


    description: z
        .string()
        .min(5, "Expense description is required"),


    amount: z
        .number()
        .positive("Expense amount must be positive"),


    date: z
        .string()
        .datetime("Invalid expense date format")

});





// Update Expense Validator
const updateExpenseValidator = z.object({

    vehicleId: z
        .number()
        .int()
        .positive()
        .optional(),


    type: z
        .string()
        .min(2)
        .optional(),


    description: z
        .string()
        .min(5)
        .optional(),


    amount: z
        .number()
        .positive()
        .optional(),


    date: z
        .string()
        .datetime()
        .optional()

});






// Expense ID Validator
const expenseIdValidator = z.object({

    id: z
        .string()
        .transform(Number)
        .refine(
            value => value > 0,
            "Invalid Expense ID"
        )

});






module.exports = {

    createExpenseValidator,
    updateExpenseValidator,
    expenseIdValidator

};