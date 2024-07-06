import Joi from "joi";

const tokenize = {
  body: Joi.object().keys({}),
};

const detokenize = {
  body: Joi.object().keys({}),
};

export const tokenValidation = { tokenize, detokenize };
