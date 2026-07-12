const { z } = require("zod");

const createDriverSchema = z.object({
  name: z
    .string()
    .min(2, "Driver name must be at least 2 characters.")
    .max(100),

  licenseNumber: z
    .string()
    .min(5, "License number is required.")
    .max(50),

  licenseCategory: z
    .string()
    .min(1, "License category is required.")
    .max(20),

  licenseExpiry: z.coerce.date({
    required_error: "License expiry date is required.",
  }),

  contactNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),

  safetyScore: z
    .number()
    .min(0, "Safety score cannot be negative.")
    .max(100, "Safety score cannot exceed 100.")
    .optional(),
});

const updateDriverSchema = createDriverSchema.partial();

module.exports = {
  createDriverSchema,
  updateDriverSchema,
};