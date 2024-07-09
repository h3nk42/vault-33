import { createClient } from "redis";
import { redisClients } from "../app";
import { getKeys } from "../utils/getKeys";
import { env } from "./config";
import logger from "./logger.config";

export const redisClientNames = {
  dataToken: "dataToken",
  apiKey: "apiKey",
} as const;

export const redisDatabaseIndex = {
  [redisClientNames.dataToken]: 0,
  [redisClientNames.apiKey]: 1,
} as const;

export type RedisClientName = keyof typeof redisClientNames;
