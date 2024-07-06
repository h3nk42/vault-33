import catchAsync from "../utils/catchAsync";
import { v4 as uuidv4 } from "uuid";

type TokenMemory = { [key: string]: { tokenId: string; value: any } };
const tokenMemory: TokenMemory = {};

const tokenize = catchAsync(async (req, res) => {
  const { id, data } = req.body;

  const addedData: { [key: string]: any } = {};

  // generate a uuid and store the data in memory
  Object.keys(data).forEach((key) => {
    const tokenId = uuidv4();
    tokenMemory[key] = { tokenId, value: data[key] };
    addedData[key] = tokenId;
  });

  console.log(tokenMemory);
  res.send({ id, data: addedData });
});

const detokenize = catchAsync(async (req, res) => {
  const { id, data } = req.body;
  const retrievedData: { [key: string]: any } = {};
  Object.keys(data).forEach((key) => {
    if (!tokenMemory[key] || tokenMemory[key].tokenId !== data[key]) {
      retrievedData[key] = "invalid token";
    } else {
      retrievedData[key] = tokenMemory[key].value;
    }
  });
  res.send({ id, data: retrievedData });
});

export const tokenController = { tokenize, detokenize };
