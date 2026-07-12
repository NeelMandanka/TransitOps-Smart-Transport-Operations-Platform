// backend/src/utils/logger.js

const logger = {
  info: (...args) => console.log("[INFO]", ...args),

  warn: (...args) => console.warn("[WARN]", ...args),

  error: (...args) => console.error("[ERROR]", ...args),

  success: (...args) => console.log("[SUCCESS]", ...args),
};

module.exports = logger;