const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");



// Create Fuel Log
const createFuel = async (data) => {

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



    const fuelLog = await prisma.fuelLog.create({

        data: {

            ...data,

            date: new Date(data.date)

        },


        include: {

            vehicle: true

        }

    });



    return fuelLog;

};






// Get All Fuel Logs
const getAllFuel = async () => {


    const fuelLogs = await prisma.fuelLog.findMany({

        include: {

            vehicle: true

        },


        orderBy: {

            createdAt: "desc"

        }

    });



    return fuelLogs;

};







// Get Fuel Log By ID
const getFuelById = async (id) => {


    const fuelLog = await prisma.fuelLog.findUnique({

        where: {

            id: Number(id)

        },


        include: {

            vehicle: true

        }

    });



    if (!fuelLog) {

        throw new ApiError(
            404,
            "Fuel record not found"
        );

    }



    return fuelLog;

};








// Update Fuel Log
const updateFuel = async (id, data) => {


    const existingFuel =
        await prisma.fuelLog.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!existingFuel) {

        throw new ApiError(
            404,
            "Fuel record not found"
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






    const updatedFuel =
        await prisma.fuelLog.update({

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



    return updatedFuel;

};








// Delete Fuel Log
const deleteFuel = async (id) => {


    const fuelLog =
        await prisma.fuelLog.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!fuelLog) {

        throw new ApiError(
            404,
            "Fuel record not found"
        );

    }



    await prisma.fuelLog.delete({

        where: {

            id: Number(id)

        }

    });



    return {

        message:
            "Fuel record deleted successfully"

    };

};







module.exports = {

    createFuel,
    getAllFuel,
    getFuelById,
    updateFuel,
    deleteFuel

};