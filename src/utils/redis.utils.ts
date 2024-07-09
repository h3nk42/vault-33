import { decrypt, encrypt, hash } from "./crypto";
import { RedisClientName } from "../config/redis.config";
import { redisClients } from "../app";

const storeAndEncrypt = async (
  key: string,
  data: any,
  encryptionKey: string,
  client: RedisClientName
) => {
  const encryptedTokenData = encrypt(data, encryptionKey);
  await redisClients[client].set(key, JSON.stringify(encryptedTokenData));
  return;
};

const retrieveAndDecrypt = async (
  key: string,
  encryptionKey: string,
  client: RedisClientName
) => {
  const encryptedValue = await redisClients[client].get(key);
  if (!encryptedValue) {
    return undefined;
  }
  const encryptedJsonData = JSON.parse(encryptedValue);
  const decryptedValue = decrypt(encryptedJsonData, encryptionKey);
  return decryptedValue;
};

const storeHashedAndEncrypt = async (
  key: string,
  data: any,
  encryptionKey: string,
  client: RedisClientName
) => {
  const hashedKey = hash(key);
  await storeAndEncrypt(hashedKey, data, encryptionKey, client);
  return;
};

const retrieveHashedAndDecrypt = async (
  key: string,
  encryptionKey: string,
  client: RedisClientName
) => {
  const hashedKey = hash(key);
  return await retrieveAndDecrypt(hashedKey, encryptionKey, client);
};

export const redisUtils = {
  storeAndEncrypt,
  retrieveAndDecrypt,
  storeHashedAndEncrypt,
  retrieveHashedAndDecrypt,
};
