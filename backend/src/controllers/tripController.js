const tripService = require("../services/tripService");
const ApiResponse = require("../utils/ApiResponse");


// Create Trip
const createTrip = async (req, res, next) => {

    try {

        const trip = await tripService.createTrip(req.body);


        return res.status(201).json(
            new ApiResponse(
                201,
                trip,
                "Trip created successfully"
            )
        );


    } catch (error) {

        next(error);

    }

};



// Get all Trips
const getAllTrips = async (req, res, next) => {

    try {

        const trips = await tripService.getAllTrips();


        return res.status(200).json(

            new ApiResponse(
                200,
                trips,
                "Trips fetched successfully"
            )

        );


    } catch(error){

        next(error);

    }

};




// Get Trip by ID
const getTripById = async(req,res,next)=>{


    try{


        const trip = await tripService.getTripById(
            req.params.id
        );


        return res.status(200).json(

            new ApiResponse(
                200,
                trip,
                "Trip fetched successfully"
            )

        );


    }catch(error){

        next(error);

    }


};





// Update Trip
const updateTrip = async(req,res,next)=>{


    try{


        const trip = await tripService.updateTrip(

            req.params.id,

            req.body

        );


        return res.status(200).json(

            new ApiResponse(
                200,
                trip,
                "Trip updated successfully"
            )

        );


    }catch(error){

        next(error);

    }


};






// Delete Trip
const deleteTrip = async(req,res,next)=>{


    try{


        const result = await tripService.deleteTrip(

            req.params.id

        );


        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Trip deleted successfully"
            )

        );


    }catch(error){

        next(error);

    }


};




module.exports = {

    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip

};