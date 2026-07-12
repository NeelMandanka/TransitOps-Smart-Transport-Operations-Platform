// backend/src/middleware/errorMiddleware.js

const { Prisma } = require("@prisma/client");
const ApiError = require("../utils/ApiError");
const { ZodError } = require("zod");

const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Custom API Errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      errors: err.errors || [],
    });
  }

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      data: null,
      errors: err.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      })),
    });
  }

  // Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Duplicate value found.",
          data: null,
          errors: [
            {
              field: err.meta?.target || [],
              message: "Unique constraint violation.",
            },
          ],
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found.",
          data: null,
          errors: [],
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Database request failed.",
          data: null,
          errors: [err.message],
        });
    }
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
      data: null,
      errors: [],
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired.",
      data: null,
      errors: [],
    });
  }

  // Default Internal Server Error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
    errors: [
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong.",
    ],
  });
};

module.exports = errorMiddleware;