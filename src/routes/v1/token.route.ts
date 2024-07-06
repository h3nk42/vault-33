import express from "express";
import { tokenValidation } from "../../validations/token.validation";
import { tokenController } from "../../controllers/token.controllers";
import validate from "../../middlewares/validate";

const tokenRouter = express.Router();

tokenRouter.post(
  "/tokenize",
  validate(tokenValidation.tokenize),
  tokenController.tokenize
);

tokenRouter.post(
  "/detokenize",
  validate(tokenValidation.detokenize),
  tokenController.detokenize
);

export default tokenRouter;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /token/tokenize:
 *   post:
 *     summary: Post data as a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - data
 *               - password
 *             properties:
 *               id:
 *                $ref: '#/components/schemas/RequestId'
 *               data:
 *                 $ref: '#/components/schemas/TokenData'
 *
 *
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
 *                  type: string
 *                 data:
 *                   $ref: '#/components/schemas/TokenData'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /token/detokenize:
 *   post:
 *     summary: Retrieve the data of previously tokenized data
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */
