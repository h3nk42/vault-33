import httpStatus from "http-status";
import { setupTestDB } from "../utils/setupTestRedis";
import request from "supertest";
import app from "../../src/app";
import { env } from "../../src/config/config";

setupTestDB();

describe("Auth routes", () => {
  let loginRequestBody = {
    userId: env.admin.id,
    password: env.admin.password,
  };
  beforeEach(() => {
    loginRequestBody = {
      userId: env.admin.id,
      password: env.admin.password,
    };
  });

  describe("POST /v1/auth/login", () => {
    test("should return 201 - correct credentials", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send(loginRequestBody)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty("userId");
          expect(response.body).toHaveProperty("tokens");
          // Optionally, add more detailed checks for the structure of the tokens object
        });
    });
    test("should return 400- wrong request body", async () => {
      //@ts-ignore
      loginRequestBody.x = "y";
      await request(app)
        .post("/v1/auth/login")
        .send(loginRequestBody)
        .expect(400); // Assuming 400
    });

    test("should return 401 - wrong credentials", async () => {
      loginRequestBody.password = "wrongPassword";
      await request(app)
        .post("/v1/auth/login")
        .send(loginRequestBody)
        .expect({ code: 401, message: "Incorrect credentials" });
    });
  });
});
