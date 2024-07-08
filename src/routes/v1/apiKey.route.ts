import express from "express";
import { validate } from "../../middlewares/validate";
import { apiKeyValidation } from "../../validations/apiKey.validation";
import { apiKeyController } from "../../controllers/apiKey.controller";
import { authJWT } from "../../middlewares/auth/authJWT";
import passport from "passport";
import { allPriviliges } from "../../config/roles";

export const apiKeyRouter = express.Router();

apiKeyRouter.post(
  "/create",
  validate(apiKeyValidation.createApiKey),
  authJWT(allPriviliges.apiKey.createApiKey),
  apiKeyController.createApiKey
);

apiKeyRouter.post(
  "/delete",
  validate(apiKeyValidation.deleteApiKey),
  authJWT(allPriviliges.apiKey.deleteApiKey),
  apiKeyController.deleteApiKey
);
