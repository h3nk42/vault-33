import { setupTestDB } from "../utils/setupTestRedis";
import request from "supertest";
import app from "../../src/app";
import { env } from "../../src/config/config";

setupTestDB();

const createApiKeyRequestBody = {
  roles: ["service"],
};
const createPath = "/v1/apiKey/create";

describe("ApiKey routes", () => {
  let jwt: string;
  beforeAll(async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ userId: env.admin.id, password: env.admin.password });
    jwt = response.body.tokens.access.token;
  });

  describe("POST /v1/apiKey/create", () => {
    test("should return 201 - created apiKey", async () => {
      await request(app)
        .post(createPath)
        .set("Authorization", `Bearer ${jwt}`) // Add this line to include the JWT in the header
        .send(createApiKeyRequestBody)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty("apiKey");
        });
    });
    test("should return 400 - wrong request body", async () => {
      //@ts-ignore
      const localBody = { ...createApiKeyRequestBody, x: "y" };
      await request(app)
        .post(createPath)
        .set("Authorization", `Bearer ${jwt}`) // Add this line to include the JWT in the header
        .send(localBody)
        .expect(400); // Assuming 400
    });

    test("should return 400 - wrong credentials", async () => {
      const localBody = { ...createApiKeyRequestBody, roles: ["servicex"] };
      await request(app)
        .post(createPath)
        .set("Authorization", `Bearer ${jwt}`) // Add this line to include the JWT in the header
        .send(localBody)
        .expect({ code: 400, message: "Invalid role provided" });
    });

    test("should return 401 - wrong token", async () => {
      await request(app)
        .post(createPath)
        .set("Authorization", `Bearer ${jwt + "a"}`) // Add this line to include the JWT in the header
        .send(createApiKeyRequestBody)
        .expect(401);
    });
  });
});
