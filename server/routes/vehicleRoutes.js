import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const ACCESS = requireRole("fleet_manager", "driver");

router.use(requireAuth);

router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: 1 });
  res.json(vehicles);
});

router.post("/", ACCESS, async (req, res) => {
  try {
    const { regNo, name, type, capacityKg, odometerKm, acquisitionCost, region } = req.body;
    const vehicle = await Vehicle.create({
      regNo: (regNo || "").trim().toUpperCase(),
      name: (name || "").trim(),
      type,
      capacityKg: Number(capacityKg || 0),
      odometerKm: Number(odometerKm || 0),
      acquisitionCost: Number(acquisitionCost || 0),
      region,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Registration number must be unique." });
    }
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", ACCESS, async (req, res) => {
  try {
    const { regNo, name, type, capacityKg, odometerKm, acquisitionCost, region, status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        regNo: (regNo || "").trim().toUpperCase(),
        name: (name || "").trim(),
        type,
        capacityKg: Number(capacityKg || 0),
        odometerKm: Number(odometerKm || 0),
        acquisitionCost: Number(acquisitionCost || 0),
        region,
        ...(status ? { status } : {}),
      },
      { new: true, runValidators: true },
    );
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Registration number must be unique." });
    }
    res.status(400).json({ message: err.message });
  }
});

// "Retire" instead of delete, to mirror original business rule
router.patch("/:id/retire", ACCESS, async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { status: "Retired" },
    { new: true },
  );
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});

export default router;
