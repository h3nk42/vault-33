import Joi from "joi";

const tokenize = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    data: Joi.object().pattern(Joi.any(), Joi.any()).required(),
  }),
};

const detokenize = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    data: Joi.object().pattern(Joi.any(), Joi.any()).required(),
  }),
};

export const tokenValidation = { tokenize, detokenize };
