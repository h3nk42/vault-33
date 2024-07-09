import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import { roleDefinitions } from "../../config/roles.config";
import { NextFunction, Request, Response } from "express";
import { passportStrategyNames } from "../../config/passport.config";

/**
 * A callback function used by Passport to verify the authentication and authorization of a user.
 * This function is designed to be used with Passport's custom callback functionality to provide
 * more granular control over the authentication and authorization process.
 *
 * @param req - The Express request object.
 * @param resolve - A function to call if the user is successfully authenticated and authorized.
 * @param reject - A function to call with an ApiError if authentication or authorization fails.
 * @param requiredRights - An array of strings representing the rights required to access the endpoint.
 * @returns A function that Passport calls with the authentication result. This function returns a Promise
 *          that resolves if the user is authenticated and authorized, or rejects with an ApiError otherwise.
 */
type VerifyCallback = (
  req: Request,
  resolve: (value?: unknown) => void,
  reject: (error: ApiError) => void,
  requiredPriviliges: string[]
) => (err: any, user: any, info: any) => Promise<void>;

const checkRolesJWT: VerifyCallback =
  (req, resolve, reject, requiredPriviliges) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    if (requiredPriviliges.length) {
      const userRights = roleDefinitions.admin;
      const hasRequiredPriviliges = requiredPriviliges.every(
        (requiredPrivilige) => {
          return userRights?.includes(requiredPrivilige);
        }
      );
      if (!hasRequiredPriviliges) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  };

/**
 * Middleware for authentication and authorization.
 *
 * This middleware uses Passport to authenticate a JWT token. If authentication is successful,
 * it checks if the authenticated user has the required rights to access the endpoint.
 *
 * @param {...string[]} requiredPriviliges - An array of strings representing the rights required to access the endpoint.
 * @returns An Express middleware function that handles the authentication and authorization process.
 */
export const authJWT = (...requiredPriviliges: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        passportStrategyNames.jwt,
        { session: false },
        checkRolesJWT(req, resolve, reject, requiredPriviliges)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
};
