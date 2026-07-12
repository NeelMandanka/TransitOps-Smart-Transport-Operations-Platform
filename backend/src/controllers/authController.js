const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    return res.status(200).json(
      ApiResponse.success(
        "Login successful",
        data
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};