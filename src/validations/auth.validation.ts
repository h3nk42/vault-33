const Joi = require("joi");

const login = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const authValidation = {
  login,
};
