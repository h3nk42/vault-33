import httpStatus from "http-status";
import { env } from "../config/config";
import ApiError from "../utils/ApiError";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUserIdAndPassword = async (
  userId: string,
  password: string
) => {
  if (userId != env.admin.id || password != env.admin.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect credentials");
  }
  return userId;
};

export const authService = {
  loginUserWithUserIdAndPassword,
};
