const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validationMiddleware");
const { loginSchema } = require("../validators/authValidator");

router.post(
  "/login",
  validationMiddleware(loginSchema),
  authController.login
);

module.exports = router;