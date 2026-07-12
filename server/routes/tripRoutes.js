import { Router } from "express";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = Router();
const ACCESS = requireRole("fleet_manager", "driver");

router.use(requireAuth);

router.get("/", async (req, res) => {
  const trips = await Trip.find()
    .populate("vehicle", "regNo name capacityKg")
    .populate("driver", "name")
    .sort({ createdAt: -1 });
  res.json(trips);
});

// Rule: cargo must not exceed vehicle capacity, vehicle/driver must be Available,
// driver license must not be expired, before a trip can go to "Dispatched".
async function assertDispatchable(vehicleId, driverId, cargoKg) {
  const vehicle = await Vehicle.findById(vehicleId);
  const driver = await Driver.findById(driverId);
  if (!vehicle) throw new Error("Vehicle not found");
  if (!driver) throw new Error("Driver not found");
  if (Number(cargoKg) > Number(vehicle.capacityKg)) {
    throw new Error(`Cargo weight (${cargoKg} kg) exceeds vehicle capacity (${vehicle.capacityKg} kg)`);
  }
  if (vehicle.status !== "Available") {
    throw new Error(`Vehicle ${vehicle.regNo} is ${vehicle.status} and cannot be dispatched`);
  }
  if (driver.status !== "Available") {
    throw new Error(`Driver ${driver.name} is ${driver.status} and cannot be assigned`);
  }
  if (new Date(driver.licenseExpiry) < new Date(new Date().toISOString().slice(0, 10))) {
    throw new Error(`Driver ${driver.name} has an expired license`);
  }
  return { vehicle, driver };
}

router.post("/", ACCESS, async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoKg, plannedDistanceKm, revenue, dispatchNow } =
      req.body;

    if (Number(cargoKg) < 0) return res.status(400).json({ message: "Cargo cannot be negative" });

    const status = dispatchNow ? "Dispatched" : "Draft";
    let dispatchedAt;

    if (dispatchNow) {
      const { vehicle, driver } = await assertDispatchable(vehicleId, driverId, cargoKg);
      dispatchedAt = new Date();
      vehicle.status = "On Trip";
      driver.status = "On Trip";
      await vehicle.save();
      await driver.save();
    } else {
      // still enforce the capacity rule even for drafts
      const vehicle = await Vehicle.findById(vehicleId);
      if (vehicle && Number(cargoKg) > Number(vehicle.capacityKg)) {
        return res.status(400).json({
          message: `Cargo weight (${cargoKg} kg) exceeds vehicle capacity (${vehicle.capacityKg} kg)`,
        });
      }
    }

    const trip = await Trip.create({
      source: (source || "").trim(),
      destination: (destination || "").trim(),
      vehicle: vehicleId,
      driver: driverId,
      cargoKg: Number(cargoKg || 0),
      plannedDistanceKm: Number(plannedDistanceKm || 0),
      revenue: Number(revenue || 0),
      status,
      dispatchedAt,
      createdBy: req.user.id,
    });
    const populated = await trip.populate([
      { path: "vehicle", select: "regNo name capacityKg" },
      { path: "driver", select: "name" },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/dispatch", ACCESS, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Draft") return res.status(400).json({ message: "Only draft trips can be dispatched" });

    const { vehicle, driver } = await assertDispatchable(trip.vehicle, trip.driver, trip.cargoKg);
    vehicle.status = "On Trip";
    driver.status = "On Trip";
    await vehicle.save();
    await driver.save();

    trip.status = "Dispatched";
    trip.dispatchedAt = new Date();
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/cancel", ACCESS, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const wasDispatched = trip.status === "Dispatched";
    trip.status = "Cancelled";
    await trip.save();

    if (wasDispatched) {
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: "Available" });
      await Driver.findByIdAndUpdate(trip.driver, { status: "Available" });
    }
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/complete", ACCESS, async (req, res) => {
  try {
    const { endOdometer, fuelConsumedL } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.status !== "Dispatched") {
      return res.status(400).json({ message: "Only dispatched trips can be completed" });
    }
    trip.status = "Completed";
    trip.endOdometer = Number(endOdometer || 0);
    trip.fuelConsumedL = Number(fuelConsumedL || 0);
    trip.completedAt = new Date();
    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicle);
    if (vehicle) {
      vehicle.status = "Available";
      vehicle.odometerKm = Math.max(vehicle.odometerKm, trip.endOdometer || 0);
      await vehicle.save();
    }
    await Driver.findByIdAndUpdate(trip.driver, { status: "Available" });

    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
