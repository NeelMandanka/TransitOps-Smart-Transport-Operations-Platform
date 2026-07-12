const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");



// Create Maintenance Log
const createMaintenance = async (data) => {

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



    const maintenance = await prisma.maintenanceLog.create({

        data: {

            ...data,

            startDate: new Date(data.startDate),

            endDate: data.endDate
                ? new Date(data.endDate)
                : null

        },

        include: {

            vehicle: true

        }

    });



    return maintenance;

};





// Get All Maintenance Logs
const getAllMaintenance = async () => {


    const maintenanceLogs = await prisma.maintenanceLog.findMany({

        include: {

            vehicle: true

        },

        orderBy: {

            createdAt: "desc"

        }

    });



    return maintenanceLogs;

};






// Get Maintenance By ID
const getMaintenanceById = async (id) => {


    const maintenance = await prisma.maintenanceLog.findUnique({

        where: {

            id: Number(id)

        },

        include: {

            vehicle: true

        }

    });



    if (!maintenance) {

        throw new ApiError(
            404,
            "Maintenance record not found"
        );

    }



    return maintenance;

};







// Update Maintenance
const updateMaintenance = async (id, data) => {


    const existingMaintenance =
        await prisma.maintenanceLog.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!existingMaintenance) {

        throw new ApiError(
            404,
            "Maintenance record not found"
        );

    }



    // Check vehicle if changed
    if (data.vehicleId) {


        const vehicle = await prisma.vehicle.findUnique({

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




    const updatedMaintenance =
        await prisma.maintenanceLog.update({

            where: {

                id: Number(id)

            },


            data: {

                ...data,

                startDate: data.startDate
                    ? new Date(data.startDate)
                    : undefined,


                endDate: data.endDate
                    ? new Date(data.endDate)
                    : undefined

            },


            include: {

                vehicle: true

            }

        });



    return updatedMaintenance;

};







// Delete Maintenance
const deleteMaintenance = async (id) => {


    const maintenance =
        await prisma.maintenanceLog.findUnique({

            where: {

                id: Number(id)

            }

        });



    if (!maintenance) {

        throw new ApiError(
            404,
            "Maintenance record not found"
        );

    }



    await prisma.maintenanceLog.delete({

        where: {

            id: Number(id)

        }

    });



    return {

        message:
            "Maintenance record deleted successfully"

    };

};






module.exports = {

    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance

};