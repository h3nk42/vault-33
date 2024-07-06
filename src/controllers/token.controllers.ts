import catchAsync from "../utils/catchAsync";

const tokenize = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  res.send({ token: "test" });
});

const detokenize = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  res.send({ token: "test" });
});

export const tokenController = { tokenize, detokenize };
