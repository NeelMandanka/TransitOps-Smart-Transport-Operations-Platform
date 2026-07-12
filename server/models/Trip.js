import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    tripNo: { type: Number, unique: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    cargoKg: { type: Number, default: 0 },
    plannedDistanceKm: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    endOdometer: { type: Number },
    fuelConsumedL: { type: Number },
    status: {
      type: String,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dispatchedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

// Auto-increment trip number
tripSchema.pre("save", async function (next) {
  if (this.isNew && !this.tripNo) {
    const last = await mongoose.model("Trip").findOne().sort({ tripNo: -1 }).select("tripNo");
    this.tripNo = last ? last.tripNo + 1 : 1;
  }
  next();
});

export default mongoose.model("Trip", tripSchema);
