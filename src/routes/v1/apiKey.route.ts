import express from "express";
import { validate } from "../../middlewares/validate";
import { apiKeyValidation } from "../../validations/apiKey.validation";
import { apiKeyController } from "../../controllers/apiKey.controller";
import { auth } from "../../middlewares/auth";
import passport from "passport";
import { allPriviliges } from "../../config/roles";

export const apiKeyRouter = express.Router();

apiKeyRouter.post(
  "/create",
  validate(apiKeyValidation.createApiKey),
  auth(allPriviliges.apiKey.createApiKey),
  apiKeyController.createApiKey
);

apiKeyRouter.post(
  "/delete",
  validate(apiKeyValidation.deleteApiKey),
  auth(allPriviliges.apiKey.deleteApiKey),
  apiKeyController.deleteApiKey
);
