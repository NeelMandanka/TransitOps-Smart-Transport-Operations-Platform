const bcrypt = require("bcrypt");
const { prisma } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt");

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  };
};

module.exports = {
  login,
};