const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");



// Create Expense
const createExpense = async (data) => {

    const {
        vehicleId
    } = data;



    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({

        where: {
            id: vehicleId
        }

    });



    if (!vehicle) {

        throw new ApiError(
            404,
            "Vehicle not found"
        );

    }



    const expense = await prisma.expense.create({

        data: {

            ...data,

            date: new Date(data.date)

        },


        include: {

            vehicle: true

        }

    });



    return expense;

};







// Get All Expenses
const getAllExpenses = async () => {


    const expenses = await prisma.expense.findMany({

        include: {

            vehicle: true

        },


        orderBy: {

            createdAt: "desc"

        }

    });



    return expenses;

};








// Get Expense By ID
const getExpenseById = async (id) => {


    const expense = await prisma.expense.findUnique({

        where: {

            id: Number(id)

        },


        include: {

            vehicle: true

        }

    });



    if (!expense) {

        throw new ApiError(
            404,
            "Expense record not found"
        );

    }



    return expense;

};









// Update Expense
const updateExpense = async (id, data) => {


    const existingExpense =
        await prisma.expense.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!existingExpense) {

        throw new ApiError(
            404,
            "Expense record not found"
        );

    }





    // Validate vehicle if changed
    if (data.vehicleId) {


        const vehicle =
            await prisma.vehicle.findUnique({

                where: {

                    id: data.vehicleId

                }

            });



        if (!vehicle) {

            throw new ApiError(
                404,
                "Vehicle not found"
            );

        }

    }







    const updatedExpense =
        await prisma.expense.update({

            where: {

                id: Number(id)

            },


            data: {

                ...data,


                date: data.date
                    ? new Date(data.date)
                    : undefined

            },


            include: {

                vehicle: true

            }

        });



    return updatedExpense;

};









// Delete Expense
const deleteExpense = async (id) => {


    const expense =
        await prisma.expense.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!expense) {

        throw new ApiError(
            404,
            "Expense record not found"
        );

    }



    await prisma.expense.delete({

        where: {

            id: Number(id)

        }

    });



    return {

        message:
            "Expense record deleted successfully"

    };

};







module.exports = {

    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense

};