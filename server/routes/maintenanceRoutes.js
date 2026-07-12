import { Router } from "express";
import MaintenanceLog from "../models/MaintenanceLog.js";
import Vehicle from "../models/Vehicle.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const ACCESS = requireRole("fleet_manager");

router.use(requireAuth);

router.get("/", async (req, res) => {
  const logs = await MaintenanceLog.find().populate("vehicle", "regNo name").sort({ openedAt: -1 });
  res.json(logs);
});

// Rule: opening a record moves the vehicle to "In Shop" (unless retired)
router.post("/", ACCESS, async (req, res) => {
  try {
    const { vehicleId, title, notes, cost } = req.body;
    const log = await MaintenanceLog.create({
      vehicle: vehicleId,
      title: (title || "").trim(),
      notes,
      cost: Number(cost || 0),
      status: "Open",
    });
    await Vehicle.updateOne(
      { _id: vehicleId, status: { $ne: "Retired" } },
      { status: "In Shop" },
    );
    const populated = await log.populate("vehicle", "regNo name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rule: closing a record restores the vehicle to "Available"
router.patch("/:id/close", ACCESS, async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Maintenance record not found" });
    log.status = "Closed";
    log.closedAt = new Date();
    await log.save();
    await Vehicle.updateOne({ _id: log.vehicle, status: "In Shop" }, { status: "Available" });
    res.json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
