import { roles } from "../config/roles.config";

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

export const apiKeyValidation = {
  createApiKey,
};
