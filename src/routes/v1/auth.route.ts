import express from "express";
import { validate } from "../../middlewares/validate";
import { authValidation } from "../../validations/auth.validation";
import { authController } from "../../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/login", validate(authValidation.login), authController.login);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authorization for Admin tasks.
 */

/**
 * @swagger
 * /auth/login:
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
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                type: string
 *               password:
 *                 type: string
 *
 *     responses:
 *       "200":
 *         description: Log in success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *
 *
 *       "401":
 *         description: Incorrect credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Incorrect credentials
 *       "400":
 *         description: Invalid Request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Invalid Request body
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
