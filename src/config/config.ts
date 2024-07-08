import Joi from "joi";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    ENCRYPTION_KEY: Joi.string().required().description("Encryption key"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
    ADMIN_ID: Joi.string().required().description("Admin ID"),
    ADMIN_PASSWORD: Joi.string().required().description("Admin password"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

export const env = {
  env: envVars.NODE_ENV as "production" | "development" | "test",
  port: envVars.PORT as number,
  encryptionKey: envVars.ENCRYPTION_KEY as string,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
  admin: {
    id: envVars.ADMIN_ID,
    password: envVars.ADMIN_PASSWORD,
  },
};
