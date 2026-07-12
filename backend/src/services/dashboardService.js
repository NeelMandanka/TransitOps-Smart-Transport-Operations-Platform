const { prisma } = require("../config/db");


// Get Dashboard Overview
const getDashboardOverview = async () => {


    const totalVehicles =
        await prisma.vehicle.count();



    const availableVehicles =
        await prisma.vehicle.count({

            where: {

                status: "AVAILABLE"

            }

        });



    const vehiclesOnTrip =
        await prisma.vehicle.count({

            where: {

                status: "ON_TRIP"

            }

        });




    const totalDrivers =
        await prisma.driver.count();



    const activeTrips =
        await prisma.trip.count({

            where: {

                status: "DISPATCHED"

            }

        });





    const completedTrips =
        await prisma.trip.count({

            where: {

                status: "COMPLETED"

            }

        });





    const revenue =
        await prisma.trip.aggregate({

            _sum: {

                revenue: true

            }

        });





    const fuelCost =
        await prisma.fuelLog.aggregate({

            _sum: {

                cost: true

            }

        });





    const maintenanceCost =
        await prisma.maintenanceLog.aggregate({

            _sum: {

                cost: true

            }

        });





    const expenseCost =
        await prisma.expense.aggregate({

            _sum: {

                amount: true

            }

        });





    return {

        fleet: {

            totalVehicles,

            availableVehicles,

            vehiclesOnTrip

        },


        drivers: {

            totalDrivers

        },


        trips: {

            activeTrips,

            completedTrips

        },


        financials: {

            totalRevenue:
                revenue._sum.revenue || 0,


            fuelExpense:
                fuelCost._sum.cost || 0,


            maintenanceExpense:
                maintenanceCost._sum.cost || 0,


            otherExpense:
                expenseCost._sum.amount || 0

        }

    };

};







// Vehicle Status Distribution
const getVehicleStatusStats = async () => {


    const stats =
        await prisma.vehicle.groupBy({

            by: [

                "status"

            ],


            _count: {

                id: true

            }

        });



    return stats;

};








// Monthly Expense Summary
const getExpenseSummary = async () => {


    const expenses =
        await prisma.expense.findMany({

            select: {

                amount: true,

                date: true

            }

        });



    const summary = {};



    expenses.forEach(expense => {


        const month =
            new Date(expense.date)
                .toISOString()
                .slice(0,7);



        if(!summary[month]){

            summary[month] = 0;

        }



        summary[month] += expense.amount;


    });



    return summary;

};







module.exports = {

    getDashboardOverview,
    getVehicleStatusStats,
    getExpenseSummary

};