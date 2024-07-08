import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { env } from "./config";
import { authTokenTypes } from "./token";
import { AuthTokenPayload } from "../services/authToken.service";

const jwtOptions = {
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
