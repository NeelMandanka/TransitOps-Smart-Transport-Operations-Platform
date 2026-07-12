import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Truck", "Van", "Mini", "Four Wheeler"], default: "Van" },
    capacityKg: { type: Number, default: 0 },
    odometerKm: { type: Number, default: 0 },
    acquisitionCost: { type: Number, default: 0 },
    region: { type: String, enum: ["West", "North", "South", "East", "Central"], default: "West" },
    status: {
      type: String,
      enum: ["Available", "On Trip", "In Shop", "Retired"],
      default: "Available",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export default mongoose.model("Vehicle", vehicleSchema);
