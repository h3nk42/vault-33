import Joi from "joi";

export type TokenDataInStore = {
  tokenId: string;
  value: any;
};

export const tokenDataInStoreSchema = Joi.object().keys({
  tokenId: Joi.string().required(),
  value: Joi.string().required(),
});

export const isTokenData = (data: any): data is TokenDataInStore => {
  const { error, value: decryptedData } = tokenDataInStoreSchema.validate(data);
  if (error) {
    return false;
  }
  return true;
};
