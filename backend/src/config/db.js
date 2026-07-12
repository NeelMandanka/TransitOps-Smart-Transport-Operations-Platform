// backend/src/config/db.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed.");
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  prisma,
  connectDB,
};