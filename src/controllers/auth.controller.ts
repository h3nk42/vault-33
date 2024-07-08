import catchAsync from "../utils/catchAsync";

import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { authTokenService } from "../services/authToken.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  await authService.loginUserWithUserIdAndPassword(userId, password);
  const tokens = await authTokenService.generateAuthToken(userId);
  res.send({ userId, tokens });
});

export const authController = { login };
