import { env } from "../config/config";

const { version } = require("../../package.json");

export const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "Zasta DPV challenge",
    version,
    license: {
      name: "",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${env.port}/v1`,
    },
  ],
};
