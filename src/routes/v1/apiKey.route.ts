import express from "express";
import { validate } from "../../middlewares/validate";
import { apiKeyValidation } from "../../validations/apiKey.validation";
import { apiKeyController } from "../../controllers/apiKey.controller";
import { authJWT } from "../../middlewares/auth/authJWT";
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

/**
 * @swagger
 * tags:
 *   name: ApiKey
 *   description: Managing of Api Keys.
 */

/**
 * @swagger
 * /apiKey/create:
 *   post:
 *     summary: Create api keys for services.
 *     tags: [ApiKey]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApiKeyRequest'
 *
 *
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateApiKeyResponse'
 *
 *
 *       "401":
 *         description: Wrong bearer Token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Please authenticate
 *       "400":
 *         description: Invalid Request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Invalid Request body
 *
 *       "500":
 *         description: Something unexpected threw an error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 500
 *               message: Internal error
 *
 */
