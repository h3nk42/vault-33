import catchAsync from "../utils/catchAsync";

import { Request, Response } from "express";
import { CreateApiKeyBody } from "../validations/apiKey.validation";
import { v4 } from "uuid";
import { env } from "../config/config";
import ApiError from "../utils/ApiError";
import { redisUtils } from "../utils/redis.utils";
import { redisClientNames } from "../config/redis.config";

const createApiKey = catchAsync(async (req: Request, res: Response) => {
  const { roles } = req.body as CreateApiKeyBody;

  // create api key
  const apiKey = v4();
  const roleData = { roles };
  await redisUtils.storeHashedAndEncrypt(
    apiKey,
    roleData,
    env.encryptionKey,
    redisClientNames.apiKey
  );
  res.status(201).send({ apiKey });
});

export const apiKeyController = { createApiKey };
