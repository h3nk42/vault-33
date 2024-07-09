const authTokenTypes = {
  ACCESS: "access",
} as const;

type AuthTokenType = (typeof authTokenTypes)[keyof typeof authTokenTypes];
export { authTokenTypes, AuthTokenType };
