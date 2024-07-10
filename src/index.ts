import app, { redisClients } from "./app";
import logger from "./config/logger.config";
import { env } from "./config/config";
import { getKeys } from "./utils/getKeys";

let server;

// Start the Express server
server = app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(async () => {
      logger.info("Server closed");
      // Disconnect from Redis when the server closes
      getKeys(redisClients).forEach(async (clientName) => {
        redisClients[clientName].disconnect();
      });

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
  getKeys(redisClients).forEach(async (clientName) => {
    redisClients[clientName].disconnect();
  });
});
