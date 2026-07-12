import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";
import FuelLog from "../models/FuelLog.js";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Expense from "../models/Expense.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
router.use(requireAuth, requireRole("fleet_manager", "financial_analyst", "safety_officer"));

router.get("/raw", async (req, res) => {
  const [vehicles, trips, fuelLogs, maintenance, expenses] = await Promise.all([
    Vehicle.find(),
    Trip.find(),
    FuelLog.find(),
    MaintenanceLog.find(),
    Expense.find(),
  ]);
  res.json({ vehicles, trips, fuelLogs, maintenance, expenses });
});

export default router;
