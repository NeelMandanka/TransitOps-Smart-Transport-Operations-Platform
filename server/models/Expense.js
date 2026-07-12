import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    category: {
      type: String,
      enum: ["Toll", "Maintenance", "Fuel", "Parking", "Other"],
      default: "Other",
    },
    amount: { type: Number, default: 0 },
    note: { type: String, trim: true },
    expenseDate: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export default mongoose.model("Expense", expenseSchema);
