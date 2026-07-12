// backend/src/middleware/notFoundMiddleware.js

module.exports = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found`,
    data: null,
    errors: [],
  });
};