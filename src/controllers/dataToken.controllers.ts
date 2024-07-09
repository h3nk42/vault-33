import { dataTokenRedisClient } from "../app";
import catchAsync from "../utils/catchAsync";
import { v4 as uuidv4 } from "uuid";
import { decrypt, encrypt } from "../utils/crypto";
import { env } from "../config/config";
import { TokenizeBody } from "../validations/token.validation";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { DataTokenInStore, isDataToken } from "../models/dataToken.model";

/**
 * The `tokenize` function is an asynchronous controller for tokenizing provided data and storing it in Redis.
 * It wraps the core logic with `catchAsync` for streamlined error handling.
 *
 * @param {Request} req - The request object, expected to contain a body with an `id` and a `data` object.
 *   The `data` object should have keys representing data identifiers and values as the corresponding data to be tokenized.
 * @param {Response} res - The response object used to send back the tokenization results.
 *
 * The function performs the following steps:
 * 1. Extracts `id` and `data` from the request body, casting `data` to the `TokenizeBody` type for type safety.
 * 2. Initializes an empty object `addedData` to store the mapping of original data keys to their generated token IDs.
 * 3. Iterates over each key in the `data` object to perform the following operations for tokenization:
 *    a. Generates a unique token ID using `uuidv4`.
 *    b. Creates a `TokenDataInStore` object containing the token ID and the original data value.
 *    c. Encrypts the `TokenDataInStore` object using a predefined encryption key (`env.encryptionKey`).
 *    d. Converts the encrypted value to a JSON string.
 *    e. Stores the encrypted JSON string in Redis against the original data key using the promisified `redisSetAsync`.
 *    f. Logs a message indicating successful storage.
 *    g. Maps the original data key to the generated token ID in `addedData`.
 * 4. Waits for all tokenization operations to complete using `Promise.all`.
 * 5. Sends a response containing the original request `id` and the `addedData` object with the tokenization results.
 */
const tokenize = catchAsync(async (req, res) => {
  const { id, data } = req.body as TokenizeBody;
  const addedData: { [key: string]: any } = {};
  const apiKey = req.headers["x-api-key"] as string;
  const operations = Object.keys(data).map(async (key) => {
    const tokenId = uuidv4();
    const tokenDataForStore: DataTokenInStore = {
      tokenId,
      value: data[key],
      creator: apiKey,
    };
    const encryptedTokenData = encrypt(tokenDataForStore, env.encryptionKey);
    await dataTokenRedisClient.set(key, JSON.stringify(encryptedTokenData));
    logger.debug(`Stored tokenized data for key ${key}`);
    addedData[key] = tokenId;
  });
  await Promise.all(operations);

  res.send({ id, data: addedData });
});

/**
 * The `detokenize` function asynchronously processes a request to convert tokenized data back to its original form.
 * It leverages the `catchAsync` utility to handle asynchronous errors gracefully.
 *
 * @param {Request} req - The request object, expected to contain a body with an `id` and a `data` object.
 *   The `data` object should have keys representing token identifiers and values as the corresponding tokens.
 * @param {Response} res - The response object used to send back the processed data.
 *
 * The function performs the following steps:
 * 1. Extracts `id` and `data` from the request body, with `data` being cast to the `TokenizeBody` type for type safety.
 * 2. Initializes an empty object `retrievedData` to store the results of the detokenization process.
 * 3. Uses `Promise.all` to parallelize Redis calls for each key in the `data` object. This is done to improve performance by
 *    not waiting for each call to complete sequentially.
 * 4. For each key in `data`, it attempts to retrieve the encrypted value from Redis using `dataTokenRedisClient.get(key)`.
 *    - If the encrypted value is not found, it records the key as not found in `retrievedData`.
 *    - If the encrypted value is found, it attempts to:
 *      a. Parse the encrypted value as JSON.
 *      b. Decrypt the parsed value using a predefined encryption key (`env.encryptionKey`).
 *      c. Check if the decrypted value matches the expected token data structure and the token ID matches the provided token.
 *         If it does, the original value is recorded as found in `retrievedData`.
 * 5. Any errors during decryption are caught and logged to the console.
 * 6. Finally, the function sends a response with the original request `id` and the `retrievedData` object containing the detokenization results.
 */
const detokenize = catchAsync(async (req, res) => {
  const { id, data } = req.body as TokenizeBody;
  const retrievedData: { [key: string]: { found: boolean; value: any } } = {};
  const decryptionTasks = Object.keys(data).map(async (key) => {
    try {
      const encryptedValue = await dataTokenRedisClient.get(key);
      if (!encryptedValue) {
        return {
          key,
          result: { found: false, value: null },
        };
      }

      const encryptedJsonData = JSON.parse(encryptedValue);
      const decryptedValue = decrypt(encryptedJsonData, env.encryptionKey);

      if (!isDataToken(decryptedValue)) {
        return {
          key,
          result: { found: false, value: null, info: "internal error" },
        };
      }

      if (decryptedValue.creator !== req.headers["x-api-key"]) {
        return {
          key,
          result: { found: false, value: null, info: "not allowed" },
        };
      }
      if (decryptedValue?.tokenId !== data[key]) {
        return { key, result: { found: false, value: null } };
      }

      return {
        key,
        result: {
          found: false,
          value: decryptedValue.value,
        },
      };
    } catch (error) {
      throw error; // This will be caught by catchAsync
    }
  });

  const results = await Promise.all(decryptionTasks);
  results.forEach(({ key, result }) => {
    retrievedData[key] = result;
  });

  res.send({ id, data: retrievedData });
});

export const tokenController = { tokenize, detokenize };
