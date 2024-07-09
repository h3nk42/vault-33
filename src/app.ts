import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import routes from "./routes/v1";
import httpStatus from "http-status";
import ApiError from "./utils/ApiError";
import { errorConverter, errorHandler } from "./middlewares/error";
import { createClient } from "redis";
import logger from "./config/logger";
import passport from "passport";
import { apiKeyStrategy, jwtStrategy } from "./config/passport";
import { redisClientNames } from "./config/redis.config";

const dataTokenRedisClient = createClient({
  url: "redis://localhost:6379", // Update this with your Redis server URL
  database: 0,
});

dataTokenRedisClient.on("error", (err) =>
  logger.error("Redis Client Error", err)
);
dataTokenRedisClient.on("connect", () => logger.info("Connected to Redis"));

const apiKeyRedisClient = createClient({
  url: "redis://localhost:6379", // Update this with your Redis server URL
  database: 1,
});

export const redisClients = {
  [redisClientNames.dataToken]: dataTokenRedisClient,
  [redisClientNames.apiKey]: apiKeyRedisClient,
};

apiKeyRedisClient.on("error", (err) => logger.error("Redis Client Error", err));
apiKeyRedisClient.on("connect", () => logger.info("Connected to Redis"));

// Connect to Redis
(async () => {
  await dataTokenRedisClient.connect();
  await apiKeyRedisClient.connect();
})();

// Create an instance of Express
const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
passport.use("api-key", apiKeyStrategy);

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
