import { Router } from "express";
import FuelLog from "../models/FuelLog.js";
import Expense from "../models/Expense.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const ACCESS = requireRole("fleet_manager", "driver", "financial_analyst");

router.use(requireAuth);

router.get("/fuel-logs", async (req, res) => {
  const logs = await FuelLog.find().populate("vehicle", "regNo name").sort({ logDate: -1 });
  res.json(logs);
});

router.post("/fuel-logs", ACCESS, async (req, res) => {
  try {
    const { vehicleId, liters, cost, logDate } = req.body;
    const log = await FuelLog.create({
      vehicle: vehicleId,
      liters: Number(liters),
      cost: Number(cost || 0),
      logDate: logDate || Date.now(),
    });
    const populated = await log.populate("vehicle", "regNo name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/expenses", async (req, res) => {
  const expenses = await Expense.find().populate("vehicle", "regNo name").sort({ expenseDate: -1 });
  res.json(expenses);
});

router.post("/expenses", ACCESS, async (req, res) => {
  try {
    const { vehicleId, category, amount, note, expenseDate } = req.body;
    const expense = await Expense.create({
      vehicle: vehicleId || null,
      category,
      amount: Number(amount),
      note,
      expenseDate: expenseDate || Date.now(),
    });
    const populated = await expense.populate("vehicle", "regNo name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
