const express = require("express");
// const auth = require("../../middlewares/auth");
const router = express.Router();

router.post(
  "/tokenize",
  validate(authValidation.register),
  authController.register
);
router.post(
  "/detokenize",
  validate(authValidation.register),
  authController.register
);
