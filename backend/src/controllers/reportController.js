const reportService = require("../services/reportService");
const ApiResponse = require("../utils/ApiResponse");




// Get Trip Report
const getTripReport = async (req, res, next) => {

    try {


        const report =
            await reportService.getTripReport();



        return res.status(200).json(

            new ApiResponse(
                200,
                report,
                "Trip report fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







// Get Fuel Report
const getFuelReport = async (req, res, next) => {

    try {


        const report =
            await reportService.getFuelReport();



        return res.status(200).json(

            new ApiResponse(
                200,
                report,
                "Fuel report fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Get Maintenance Report
const getMaintenanceReport = async (req, res, next) => {

    try {


        const report =
            await reportService.getMaintenanceReport();



        return res.status(200).json(

            new ApiResponse(
                200,
                report,
                "Maintenance report fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Get Expense Report
const getExpenseReport = async (req, res, next) => {

    try {


        const report =
            await reportService.getExpenseReport();



        return res.status(200).json(

            new ApiResponse(
                200,
                report,
                "Expense report fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};









// Get Fleet Performance Report
const getFleetPerformanceReport = async (req, res, next) => {

    try {


        const report =
            await reportService.getFleetPerformanceReport();



        return res.status(200).json(

            new ApiResponse(
                200,
                report,
                "Fleet performance report fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








module.exports = {

    getTripReport,

    getFuelReport,

    getMaintenanceReport,

    getExpenseReport,

    getFleetPerformanceReport

};