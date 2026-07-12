const expenseService = require("../services/expenseService");
const ApiResponse = require("../utils/ApiResponse");




// Create Expense
const createExpense = async (req, res, next) => {

    try {


        const expense =
            await expenseService.createExpense(
                req.body
            );



        return res.status(201).json(

            new ApiResponse(
                201,
                expense,
                "Expense created successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Get All Expenses
const getAllExpenses = async (req, res, next) => {

    try {


        const expenses =
            await expenseService.getAllExpenses();



        return res.status(200).json(

            new ApiResponse(
                200,
                expenses,
                "Expenses fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Get Expense By ID
const getExpenseById = async (req, res, next) => {

    try {


        const expense =
            await expenseService.getExpenseById(
                req.params.id
            );



        return res.status(200).json(

            new ApiResponse(
                200,
                expense,
                "Expense fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Update Expense
const updateExpense = async (req, res, next) => {

    try {


        const expense =
            await expenseService.updateExpense(

                req.params.id,

                req.body

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                expense,
                "Expense updated successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};









// Delete Expense
const deleteExpense = async (req, res, next) => {

    try {


        const result =
            await expenseService.deleteExpense(

                req.params.id

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Expense deleted successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







module.exports = {

    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense

};