import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    title: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
    cost: { type: Number, default: 0 },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
  },
  { timestamps: false },
);

export default mongoose.model("MaintenanceLog", maintenanceSchema);
