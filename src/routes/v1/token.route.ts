import express from "express";
import { tokenValidation } from "../../validations/token.validation";
import { tokenController } from "../../controllers/token.controllers";
import validate from "../../middlewares/validate";

const tokenRouter = express.Router();

tokenRouter.post(
  "/tokenize",
  validate(tokenValidation.tokenize),
  tokenController.tokenize
);

tokenRouter.post(
  "/detokenize",
  validate(tokenValidation.detokenize),
  tokenController.detokenize
);

export default tokenRouter;
