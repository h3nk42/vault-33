import express from "express";
import { tokenValidation } from "../../validations/token.validation";
import { tokenController } from "../../controllers/dataToken.controllers";
import { validate } from "../../middlewares/validate";
import { authApiKey } from "../../middlewares/auth/authApiKey";
import { allPriviliges } from "../../config/roles";

const dataTokenRouter = express.Router();

dataTokenRouter.post(
  "/tokenize",
  validate(tokenValidation.tokenize),
  authApiKey(allPriviliges.dataToken.tokenize),
  tokenController.tokenize
);

dataTokenRouter.post(
  "/detokenize",
  validate(tokenValidation.detokenize),
  authApiKey(allPriviliges.dataToken.detokenize),
  tokenController.detokenize
);

export default dataTokenRouter;
/**
 * @swagger
 * tags:
 *   name: DataToken
 *   description: Storing and retrieving sensitive Data.
 */

/**
 * @swagger
 * /token/tokenize:
 *   post:
 *     summary: Post data as a token
 *     tags: [DataToken]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - data
 *             properties:
 *               id:
 *                $ref: '#/components/schemas/RequestId'
 *               data:
 *                 $ref: '#/components/schemas/TokenizeDataRequest'
 *
 *
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                  $ref: '#/components/schemas/RequestId'
 *                 data:
 *                  $ref: '#/components/schemas/TokenizeDataResponse'
 *
 *       "401":
 *         description: Wrong or missing API-Key in header.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Please authenticate
 *       "403":
 *         description: Provided API-Key doesnt include necessary priviliges.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 403
 *               message: Forbidden
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

/**
 * @swagger
 * /token/detokenize:
 *   post:
 *     summary: Retrieve the data of previously tokenized data
 *     tags: [DataToken]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - data
 *             properties:
 *               id:
 *                $ref: '#/components/schemas/RequestId'
 *               data:
 *                 $ref: '#/components/schemas/DetokenizeDataRequest'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                  $ref: '#/components/schemas/RequestId'
 *                 data:
 *                  $ref: '#/components/schemas/DetokenizeDataResponse'
 *       "401":
 *         description: Wrong or missing API-Key in header.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Please authenticate
 *       "403":
 *         description: Provided API-Key doesnt include necessary priviliges.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 403
 *               message: Forbidden
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
 */
