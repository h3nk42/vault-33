import { Moment } from "moment";
import { AuthTokenType, authTokenTypes } from "../config/token";
import { env } from "../config/config";
import moment from "moment";
import jwt from "jsonwebtoken";

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: string,
  expires: Moment,
  type: AuthTokenType,
  secret = env.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export type AuthTokenPayload = {
  sub: string;
  iat: number;
  exp: number;
  type: AuthTokenType;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: AuthTokenType) => {
  const payload = jwt.verify(token, env.jwt.secret);
  return payload;
};

/**
 * Generate auth tokens
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const generateAuthToken = async (userId: string) => {
  const accessTokenExpires = moment().add(
    env.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    authTokenTypes.ACCESS
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

export const authTokenService = {
  verifyToken,
  generateAuthToken,
};
