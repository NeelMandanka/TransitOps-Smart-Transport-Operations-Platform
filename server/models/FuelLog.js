import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    liters: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    logDate: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export default mongoose.model("FuelLog", fuelLogSchema);
