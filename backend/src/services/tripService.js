const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");


// Create Trip
const createTrip = async (data) => {

    const {
        vehicleId,
        driverId
    } = data;


    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id: vehicleId
        }
    });


    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }


    // Check driver exists
    const driver = await prisma.driver.findUnique({
        where: {
            id: driverId
        }
    });


    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }


    // Create trip
    const trip = await prisma.trip.create({

        data,

        include: {
            vehicle: true,
            driver: true
        }

    });


    return trip;
};



// Get all trips
const getAllTrips = async () => {

    const trips = await prisma.trip.findMany({

        include: {
            vehicle: true,
            driver: true
        },

        orderBy: {
            createdAt: "desc"
        }

    });


    return trips;
};




// Get trip by ID
const getTripById = async (id) => {


    const trip = await prisma.trip.findUnique({

        where: {
            id: Number(id)
        },

        include: {
            vehicle: true,
            driver: true
        }

    });


    if (!trip) {
        throw new ApiError(404, "Trip not found");
    }


    return trip;

};




// Update Trip
const updateTrip = async (id, data) => {


    const existingTrip = await prisma.trip.findUnique({

        where:{
            id:Number(id)
        }

    });


    if(!existingTrip){

        throw new ApiError(
            404,
            "Trip not found"
        );

    }



    // Validate vehicle change
    if(data.vehicleId){

        const vehicle = await prisma.vehicle.findUnique({

            where:{
                id:data.vehicleId
            }

        });


        if(!vehicle){

            throw new ApiError(
                404,
                "Vehicle not found"
            );

        }

    }



    // Validate driver change
    if(data.driverId){

        const driver = await prisma.driver.findUnique({

            where:{
                id:data.driverId
            }

        });


        if(!driver){

            throw new ApiError(
                404,
                "Driver not found"
            );

        }

    }



    const updatedTrip = await prisma.trip.update({

        where:{
            id:Number(id)
        },

        data,

        include:{
            vehicle:true,
            driver:true
        }

    });


    return updatedTrip;

};




// Delete Trip
const deleteTrip = async(id)=>{


    const trip = await prisma.trip.findUnique({

        where:{
            id:Number(id)
        }

    });



    if(!trip){

        throw new ApiError(
            404,
            "Trip not found"
        );

    }



    await prisma.trip.delete({

        where:{
            id:Number(id)
        }

    });



    return {
        message:"Trip deleted successfully"
    };

};



module.exports = {

    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip

};
