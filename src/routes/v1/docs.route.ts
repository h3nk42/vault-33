import { swaggerDef } from "../../docs/swaggerDef";

const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

export const docsRouter = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition: swaggerDef,
  apis: ["src/docs/*.yml", "src/routes/v1/*.ts"],
});

docsRouter.use("/", swaggerUi.serve);
docsRouter.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
