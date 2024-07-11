import Joi from "joi";

export type DataTokenInStore = {
  tokenId: string;
  value: any;
  creatorId: string;
  fieldName: string;
};

export const dataTokenInStoreSchema = Joi.object()
  .keys({
    tokenId: Joi.string().required(),
    value: Joi.string().required(),
    creatorId: Joi.string().required(),
  })
  .unknown(true);

export const isDataToken = (data: any): data is DataTokenInStore => {
  const { error, value: decryptedData } = dataTokenInStoreSchema.validate(data);
  if (error) {
    return false;
  }
  return true;
};
