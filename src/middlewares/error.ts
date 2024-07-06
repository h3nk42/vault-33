import httpStatus from "http-status";
import config from "../config/config";
import logger from "../config/logger";
import ApiError from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";

/**
 * Converts a thrown error into an ApiError if it is not already one, allowing for uniform error handling.
 * @param err - The error object thrown.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
const errorConverter = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: ApiError | (Error & { statusCode?: number }) = err as
    | ApiError
    | (Error & { statusCode?: number });
  if (!(error instanceof ApiError)) {
    const statusCode: number =
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message: string =
      error.message || httpStatus[statusCode as keyof typeof httpStatus] + "";
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * Handles errors thrown during request processing, sending a formatted response to the client.
 * @param err - The error object to handle.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack. Not used here, but required by Express middleware signature.
 */
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
