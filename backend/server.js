// backend/server.js

const app = require("./src/app");
const env = require("./src/config/env");
const { connectDB } = require("./src/config/db");

async function startServer() {
  try {
    // Connect Database
    await connectDB();

    // Start Express Server
    app.listen(env.PORT, () => {
      console.log("==================================");
      console.log(`🚀 TransitOps Server Started`);
      console.log(`🌐 Environment : ${env.NODE_ENV}`);
      console.log(`📡 Server      : http://localhost:${env.PORT}`);
      console.log("==================================");
    });
  } catch (error) {
    console.error("❌ Server failed to start");
    console.error(error);
    process.exit(1);
  }
}

startServer();