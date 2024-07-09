export const redisClientNames = {
  dataToken: "dataToken",
  apiKey: "apiKey",
} as const;

export type RedisClientName = keyof typeof redisClientNames;
