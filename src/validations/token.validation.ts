import Joi from "joi";

const tokenize = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    data: Joi.object().pattern(Joi.string(), Joi.any()).required(),
  }),
};

export type TokenData = { [key: string]: any };
export type TokenizeBody = {
  id: string;
  data: TokenData;
};

const detokenize = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    data: Joi.object().pattern(Joi.string(), Joi.any()).required(),
  }),
};
export type DetokenizeBody = {
  id: string;
  data: TokenData;
};

export const tokenValidation = { tokenize, detokenize };
