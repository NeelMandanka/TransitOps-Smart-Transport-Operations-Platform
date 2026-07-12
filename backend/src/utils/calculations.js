// backend/src/utils/calculations.js

const calculateFuelEfficiency = (distance, fuel) => {
  if (!fuel || fuel <= 0) return 0;

  return Number((distance / fuel).toFixed(2));
};

const calculateFleetUtilization = (activeVehicles, totalVehicles) => {
  if (!totalVehicles || totalVehicles <= 0) return 0;

  return Number(((activeVehicles / totalVehicles) * 100).toFixed(2));
};

const calculateTotalExpense = (expenses = []) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

module.exports = {
  calculateFuelEfficiency,
  calculateFleetUtilization,
  calculateTotalExpense,
};