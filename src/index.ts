import app, { apiKeyRedisClient, dataTokenRedisClient } from "./app";
import logger from "./config/logger";
import { env } from "./config/config";

let server;

// Start the Express server
server = app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(async () => {
      logger.info("Server closed");
      // Disconnect from Redis when the server closes
      await dataTokenRedisClient.disconnect();
      await apiKeyRedisClient.disconnect();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
  // Ensure Redis client disconnects on SIGTERM
  await dataTokenRedisClient.disconnect();
  await apiKeyRedisClient.disconnect();
});
