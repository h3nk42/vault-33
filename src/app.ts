import express from "express";
import helmet from "helmet";
import routes from "./routes/v1";
import httpStatus from "http-status";
import ApiError from "./utils/ApiError";
import { errorConverter, errorHandler } from "./middlewares/error";
import passport from "passport";
import {
  apiKeyStrategy,
  jwtStrategy,
  passportStrategyNames,
} from "./config/passport.config";
import { apiLimiter } from "./config/apiLimiter.config";
import { createClient } from "redis";
import { env } from "./config/config";
import logger from "./config/logger.config";
import {
  redisClientNames,
  redisDatabaseIndex,
  RedisClientName,
} from "./config/redis.config";
import { getKeys } from "./utils/getKeys";

// Create an instance of Express
const app = express();

// Apply rate limiter to all requests
app.use(apiLimiter);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// jwt authentication
app.use(passport.initialize());
passport.use(passportStrategyNames.jwt, jwtStrategy);
passport.use(passportStrategyNames.apiKey, apiKeyStrategy);

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

console.log(env.redis.url);
export const redisClients = {
  [redisClientNames.dataToken]: createClient({
    url: env.redis.url,
    database: redisDatabaseIndex.dataToken,
  }),
  [redisClientNames.apiKey]: createClient({
    url: env.redis.url,
    database: redisDatabaseIndex.apiKey,
  }),
} as const;

getKeys(redisClients).forEach(async (clientName) => {
  redisClients[clientName].on("error", (err) =>
    logger.error("Redis Client Error: " + clientName, err)
  );
  redisClients[clientName].on("connect", () =>
    logger.info("Connected to Redis:" + clientName)
  );
  await redisClients[clientName as RedisClientName].connect();
});

export default app;
