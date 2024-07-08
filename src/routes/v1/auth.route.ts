import express from "express";
import { validate } from "../../middlewares/validate";
import { authValidation } from "../../validations/auth.validation";
import { authController } from "../../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/login", validate(authValidation.login), authController.login);
