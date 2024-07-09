import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import { Role, roleDefinitions } from "../../config/roles.config";
import { NextFunction, Request, Response } from "express";
import { passportStrategyNames } from "../../config/passport.config";

type VerifyCallback = (
  req: Request,
  resolve: (value?: unknown) => void,
  reject: (error: ApiError) => void,
  requiredPriviliges: string[]
) => (err: any, user: any, info: any) => Promise<void>;

const checkPriviligesApiKey: VerifyCallback =
  (req, resolve, reject, requiredPriviliges) => async (err, roles, info) => {
    if (err || info || !roles) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    const rolesTyped = roles as Role[];
    if (requiredPriviliges.length) {
      const apiKeyPriviliges = rolesTyped
        .map((role: Role) => roleDefinitions[role])
        .flat();
      const hasRequiredPriviliges = requiredPriviliges.every(
        (requiredPrivilige) => {
          return apiKeyPriviliges?.includes(requiredPrivilige);
        }
      );
      if (!hasRequiredPriviliges) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

export const authApiKey = (...requiredPriviliges: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        passportStrategyNames.apiKey,
        { session: false },
        checkPriviligesApiKey(req, resolve, reject, requiredPriviliges)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
};
