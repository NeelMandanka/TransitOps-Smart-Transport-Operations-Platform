import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNo: { type: String, required: true, trim: true },
    licenseCategory: { type: String, enum: ["LMV", "HMV", "MCWG", "TRANS"], default: "LMV" },
    licenseExpiry: { type: Date, required: true },
    contact: { type: String, trim: true },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty", "Suspended"],
      default: "Available",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export default mongoose.model("Driver", driverSchema);
