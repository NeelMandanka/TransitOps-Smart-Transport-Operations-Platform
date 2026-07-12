import mongoose from "mongoose";

const ROLES = ["fleet_manager", "driver", "safety_officer", "financial_analyst"];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "fleet_manager" },
  },
  { timestamps: true },
);

export const ROLE_LIST = ROLES;
export default mongoose.model("User", userSchema);
