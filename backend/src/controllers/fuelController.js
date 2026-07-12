const fuelService = require("../services/fuelService");
const ApiResponse = require("../utils/ApiResponse");




// Create Fuel Log
const createFuel = async (req, res, next) => {

    try {


        const fuelLog =
            await fuelService.createFuel(
                req.body
            );



        return res.status(201).json(

            new ApiResponse(
                201,
                fuelLog,
                "Fuel record created successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Get All Fuel Logs
const getAllFuel = async (req, res, next) => {

    try {


        const fuelLogs =
            await fuelService.getAllFuel();



        return res.status(200).json(

            new ApiResponse(
                200,
                fuelLogs,
                "Fuel records fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Get Fuel By ID
const getFuelById = async (req, res, next) => {

    try {


        const fuelLog =
            await fuelService.getFuelById(
                req.params.id
            );



        return res.status(200).json(

            new ApiResponse(
                200,
                fuelLog,
                "Fuel record fetched successfully"
            )

        );


    } catch(error) {

        next(error);

    }

};









// Update Fuel Log
const updateFuel = async (req, res, next) => {

    try {


        const fuelLog =
            await fuelService.updateFuel(

                req.params.id,

                req.body

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                fuelLog,
                "Fuel record updated successfully"
            )

        );


    } catch(error) {

        next(error);

    }

};









// Delete Fuel Log
const deleteFuel = async (req, res, next) => {

    try {


        const result =
            await fuelService.deleteFuel(

                req.params.id

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Fuel record deleted successfully"
            )

        );


    } catch(error) {

        next(error);

    }

};








module.exports = {

    createFuel,
    getAllFuel,
    getFuelById,
    updateFuel,
    deleteFuel

};
