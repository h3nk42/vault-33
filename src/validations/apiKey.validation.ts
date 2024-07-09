import { allPriviligesArrayFlattened, roles } from "../config/roles";
import ApiError from "../utils/ApiError";

const Joi = require("joi");

const rolesWithoutAdmin = roles.filter((role) => role !== "admin");
type rolesWithoutAdmin = typeof rolesWithoutAdmin;

const createApiKey = {
  body: Joi.object().keys({
    roles: Joi.array()
      .items(Joi.string().valid(...rolesWithoutAdmin))
      .required()
      .error(new Error("Invalid role provided")),
  }),
};

export type CreateApiKeyBody = { roles: rolesWithoutAdmin };

const deleteApiKey = {
  body: Joi.object().keys({
    apiKey: Joi.string().required(),
  }),
};

export const apiKeyValidation = {
  createApiKey,
  deleteApiKey,
};
