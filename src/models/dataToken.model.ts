import Joi from "joi";

export type DataTokensInStore = {
  [fieldName: string]: DataTokenInStore;
};

export type DataTokenInStore = {
  tokenId: string;
  value: any;
};

export const dataTokenInStoreSchema = Joi.object()
  .keys({
    tokenId: Joi.string().required(),
    value: Joi.string().required(),
  })
  .unknown(true);

export const isDataToken = (data: any): data is DataTokenInStore => {
  const { error, value: decryptedData } = dataTokenInStoreSchema.validate(data);
  if (error) {
    return false;
  }
  return true;
};

export const isDataTokens = (data: any): data is DataTokensInStore => {
  for (const key in data) {
    if (!isDataToken(data[key])) {
      return false;
    }
  }
  return true;
};
