// backend/src/middleware/validationMiddleware.js

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};

module.exports = validationMiddleware;