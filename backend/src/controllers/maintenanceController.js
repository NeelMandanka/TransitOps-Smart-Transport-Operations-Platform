const maintenanceService = require("../services/maintenanceService");
const ApiResponse = require("../utils/ApiResponse");



// Create Maintenance
const createMaintenance = async (req, res, next) => {

    try {

        const maintenance =
            await maintenanceService.createMaintenance(
                req.body
            );


        return res.status(201).json(

            new ApiResponse(
                201,
                maintenance,
                "Maintenance record created successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};






// Get All Maintenance Records
const getAllMaintenance = async (req, res, next) => {

    try {

        const maintenanceLogs =
            await maintenanceService.getAllMaintenance();



        return res.status(200).json(

            new ApiResponse(
                200,
                maintenanceLogs,
                "Maintenance records fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Get Maintenance By ID
const getMaintenanceById = async (req, res, next) => {

    try {


        const maintenance =
            await maintenanceService.getMaintenanceById(
                req.params.id
            );



        return res.status(200).json(

            new ApiResponse(
                200,
                maintenance,
                "Maintenance record fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Update Maintenance
const updateMaintenance = async (req, res, next) => {

    try {


        const maintenance =
            await maintenanceService.updateMaintenance(

                req.params.id,

                req.body

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                maintenance,
                "Maintenance record updated successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Delete Maintenance
const deleteMaintenance = async (req, res, next) => {

    try {


        const result =
            await maintenanceService.deleteMaintenance(

                req.params.id

            );



        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Maintenance record deleted successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};






module.exports = {

    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance

};