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
