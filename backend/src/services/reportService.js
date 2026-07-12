const { prisma } = require("../config/db");


// Trip Report
const getTripReport = async () => {


    const totalTrips =
        await prisma.trip.count();



    const completedTrips =
        await prisma.trip.count({

            where: {

                status: "COMPLETED"

            }

        });



    const cancelledTrips =
        await prisma.trip.count({

            where: {

                status: "CANCELLED"

            }

        });



    const tripRevenue =
        await prisma.trip.aggregate({

            _sum: {

                revenue: true

            }

        });



    const distance =
        await prisma.trip.aggregate({

            _sum: {

                actualDistance: true

            }

        });




    return {

        totalTrips,

        completedTrips,

        cancelledTrips,

        totalRevenue:
            tripRevenue._sum.revenue || 0,

        totalDistance:
            distance._sum.actualDistance || 0

    };

};







// Fuel Report
const getFuelReport = async () => {


    const fuel =
        await prisma.fuelLog.aggregate({

            _sum: {

                liters: true,

                cost: true

            }

        });



    const totalRecords =
        await prisma.fuelLog.count();



    return {


        totalFuelRecords: totalRecords,


        totalLiters:
            fuel._sum.liters || 0,


        totalFuelCost:
            fuel._sum.cost || 0


    };

};








// Maintenance Report
const getMaintenanceReport = async () => {


    const maintenance =
        await prisma.maintenanceLog.aggregate({

            _sum: {

                cost: true

            }

        });



    const totalMaintenance =
        await prisma.maintenanceLog.count();



    const activeMaintenance =
        await prisma.maintenanceLog.count({

            where: {

                isActive: true

            }

        });





    return {


        totalRecords:
            totalMaintenance,


        activeRecords:
            activeMaintenance,


        totalMaintenanceCost:
            maintenance._sum.cost || 0


    };

};








// Expense Report
const getExpenseReport = async () => {


    const expense =
        await prisma.expense.aggregate({

            _sum: {

                amount: true

            }

        });



    const totalExpenses =
        await prisma.expense.count();




    return {


        totalExpenseRecords:
            totalExpenses,


        totalAmount:
            expense._sum.amount || 0


    };

};









// Fleet Performance Report
const getFleetPerformanceReport = async () => {


    const vehicles =
        await prisma.vehicle.findMany({

            include: {

                trips: true,

                fuelLogs: true,

                expenses: true,

                maintenanceLogs: true

            }

        });




    const report = vehicles.map(vehicle => {


        const totalRevenue =
            vehicle.trips.reduce(

                (sum, trip) =>
                    sum + (trip.revenue || 0),

                0

            );



        const totalFuelCost =
            vehicle.fuelLogs.reduce(

                (sum, fuel) =>
                    sum + fuel.cost,

                0

            );



        const totalExpense =
            vehicle.expenses.reduce(

                (sum, expense) =>
                    sum + expense.amount,

                0

            );



        const totalMaintenance =
            vehicle.maintenanceLogs.reduce(

                (sum, maintenance) =>
                    sum + maintenance.cost,

                0

            );




        return {


            vehicleId:
                vehicle.id,


            vehicleName:
                vehicle.vehicleName,


            registrationNumber:
                vehicle.registrationNumber,


            revenue:
                totalRevenue,


            fuelCost:
                totalFuelCost,


            expense:
                totalExpense,


            maintenanceCost:
                totalMaintenance


        };


    });



    return report;

};








module.exports = {


    getTripReport,

    getFuelReport,

    getMaintenanceReport,

    getExpenseReport,

    getFleetPerformanceReport


};