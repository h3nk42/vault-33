import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
  VerifiedCallback,
} from "passport-jwt";

import { Strategy as CustomStrategy } from "passport-custom";
import { env } from "./config";
import { authTokenTypes } from "./token";
import { AuthTokenPayload } from "../services/authToken.service";
import { Request } from "express";
import { Role, roles } from "./roles";
import { redisUtils } from "../utils/redis.utils";
import { redisClientNames } from "./redis.config";

const jwtOptions: StrategyOptionsWithoutRequest = {
  secretOrKey: env.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: AuthTokenPayload, done: VerifiedCallback) => {
  try {
    if (payload.type !== authTokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    if (payload.sub !== env.admin.id) {
      return done(null, false);
    }
    done(null, payload.sub);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export const apiKeyStrategy = new CustomStrategy(
  async (
    req: Request,
    done: (error: any, user?: any, options?: { message: string }) => void
  ) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
      return done(null, false, { message: "Unauthorized" });
    }
    const rolesDecrypted = await redisUtils.retrieveHashedAndDecrypt(
      apiKey,
      env.encryptionKey,
      redisClientNames.apiKey
    );
    if (!isObjectWithRoles(rolesDecrypted)) {
      return done(null, false, { message: "Unauthorized" });
    }
    done(null, rolesDecrypted.roles);
  }
);

const isObjectWithRoles = (
  objectWithRoles: any
): objectWithRoles is { roles: Role } => {
  return (
    objectWithRoles &&
    typeof objectWithRoles === "object" &&
    "roles" in objectWithRoles &&
    objectWithRoles.roles.every((role: Role) => roles.includes(role))
  );
};
