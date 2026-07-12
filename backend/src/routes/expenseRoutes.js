const express = require("express");

const router = express.Router();


const expenseController = require("../controllers/expenseController");


const {
    createExpenseValidator,
    updateExpenseValidator,
    expenseIdValidator
} = require("../validators/expenseValidator");


const validationMiddleware = require("../middleware/validationMiddleware");




// Create Expense
router.post(
    "/",
    validationMiddleware(createExpenseValidator),
    expenseController.createExpense
);




// Get All Expenses
router.get(
    "/",
    expenseController.getAllExpenses
);




// Get Expense By ID
router.get(
    "/:id",
    validationMiddleware(expenseIdValidator),
    expenseController.getExpenseById
);




// Update Expense
router.put(
    "/:id",
    validationMiddleware(expenseIdValidator),
    validationMiddleware(updateExpenseValidator),
    expenseController.updateExpense
);




// Delete Expense
router.delete(
    "/:id",
    validationMiddleware(expenseIdValidator),
    expenseController.deleteExpense
);



module.exports = router;