import { AuthTokenType } from "../config/token";

type AuthToken = {
  token: string;
  userId: string;
  type: AuthTokenType;
  expires: Date;
  blacklisted: boolean;
};

export { AuthToken };
