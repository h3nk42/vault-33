import catchAsync from "../utils/catchAsync";

import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { authTokenService } from "../services/authToken.service";
import { CreateApiKeyBody } from "../validations/apiKey.validation";
import crypto from "crypto";
import { v4 } from "uuid";
import { encrypt, hash } from "../utils/crypto";
import { env } from "../config/config";
import { apiKeyRedisClient } from "../app";
/* 
const tokenize = catchAsync(async (req, res) => {
    const { id, data } = req.body as TokenizeBody;
    const addedData: { [key: string]: any } = {};
    const operations = Object.keys(data).map(async (key) => {
      const tokenId = uuidv4();
      const tokenDataForStore: DataTokenInStore = { tokenId, value: data[key] };
      const encryptedTokenData = encrypt(tokenDataForStore, env.encryptionKey);
      await dataTokenRedisClient.set(key, JSON.stringify(encryptedTokenData));
      logger.debug(`Stored tokenized data for key ${key}`);
      addedData[key] = tokenId;
    });
    await Promise.all(operations);
  
    res.send({ id, data: addedData });
  });
   */

const createApiKey = catchAsync(async (req: Request, res: Response) => {
  const { roles } = req.body as CreateApiKeyBody;

  // create api key
  const apiKey = v4();
  const apiKeyHashed = await hash(apiKey);
  // encrypt roleData
  const roleData = { roles };
  const roleDataEncrypted = encrypt(roleData, env.encryptionKey);
  // store api key
  await apiKeyRedisClient.set(apiKeyHashed, JSON.stringify(roleDataEncrypted));

  res.send({ apiKey });
});

const deleteApiKey = catchAsync(async (req: Request, res: Response) => {
  res.send({});
});

export const apiKeyController = { createApiKey, deleteApiKey };
