import { Router } from "express";
import Driver from "../models/Driver.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const ACCESS = requireRole("fleet_manager", "safety_officer");

router.use(requireAuth);

router.get("/", async (req, res) => {
  const drivers = await Driver.find().sort({ name: 1 });
  res.json(drivers);
});

router.post("/", ACCESS, async (req, res) => {
  try {
    const { name, licenseNo, licenseCategory, licenseExpiry, contact, safetyScore, status } = req.body;
    const driver = await Driver.create({
      name: (name || "").trim(),
      licenseNo: (licenseNo || "").trim(),
      licenseCategory,
      licenseExpiry,
      contact,
      safetyScore: Number(safetyScore || 0),
      status,
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", ACCESS, async (req, res) => {
  try {
    const { name, licenseNo, licenseCategory, licenseExpiry, contact, safetyScore, status } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        name: (name || "").trim(),
        licenseNo: (licenseNo || "").trim(),
        licenseCategory,
        licenseExpiry,
        contact,
        safetyScore: Number(safetyScore || 0),
        status,
      },
      { new: true, runValidators: true },
    );
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
