import { Request, Response, NextFunction } from "express";

/**
 * A higher-order function for wrapping async route handlers and passing errors to Express's next function.
 * This allows for centralized error handling in Express applications, avoiding the need for try/catch blocks
 * in each async route handler.
 *
 * @param fn - An async function that takes Express's Request, Response, and NextFunction as arguments.
 *             This function represents an async route handler.
 * @returns A function that takes Request, Response, and NextFunction as arguments. When called, it executes
 *          the provided async route handler (`fn`) and catches any errors, passing them to the next function
 *          for error handling.
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err: Error) => next(err));
  };

export default catchAsync;
