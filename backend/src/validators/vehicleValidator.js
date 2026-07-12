const { z } = require("zod");

const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(5, "Registration number is required")
    .max(20),

  vehicleName: z
    .string()
    .min(2, "Vehicle name is required")
    .max(100),

  model: z
    .string()
    .min(2, "Model is required")
    .max(100),

  type: z
    .string()
    .min(2, "Vehicle type is required")
    .max(50),

  maxLoadCapacity: z
    .number({
      required_error: "Maximum load capacity is required",
    })
    .positive(),

  odometer: z
    .number({
      required_error: "Odometer reading is required",
    })
    .min(0),

  acquisitionCost: z
    .number({
      required_error: "Acquisition cost is required",
    })
    .positive(),
});

const updateVehicleSchema = createVehicleSchema.partial();

module.exports = {
  createVehicleSchema,
  updateVehicleSchema,
};