const dashboardService = require("../services/dashboardService");
const ApiResponse = require("../utils/ApiResponse");




// Get Dashboard Overview
const getDashboardOverview = async (req, res, next) => {

    try {


        const dashboard =
            await dashboardService.getDashboardOverview();



        return res.status(200).json(

            new ApiResponse(
                200,
                dashboard,
                "Dashboard overview fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Get Vehicle Status Statistics
const getVehicleStatusStats = async (req, res, next) => {

    try {


        const stats =
            await dashboardService.getVehicleStatusStats();



        return res.status(200).json(

            new ApiResponse(
                200,
                stats,
                "Vehicle status statistics fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};








// Get Expense Summary
const getExpenseSummary = async (req, res, next) => {

    try {


        const summary =
            await dashboardService.getExpenseSummary();



        return res.status(200).json(

            new ApiResponse(
                200,
                summary,
                "Expense summary fetched successfully"
            )

        );


    } catch (error) {

        next(error);

    }

};







module.exports = {

    getDashboardOverview,
    getVehicleStatusStats,
    getExpenseSummary

};