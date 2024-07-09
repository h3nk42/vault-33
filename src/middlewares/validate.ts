import { Request, Response, NextFunction } from "express";
import pick from "../utils/pick";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import Joi, { ObjectSchema } from "joi";

interface Schema {
  params?: ObjectSchema;
  query?: ObjectSchema;
  body?: ObjectSchema;
}

const validate =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema)) as Partial<Request>;
    const { value, error } = Joi.compile(Joi.object(validSchema))
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);
    if (error) {
      let errorMessage = error.details
        ?.map((details) => details.message)
        .join(", ");
      if (!errorMessage) {
        errorMessage = error.message;
      }
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };

export { validate };
