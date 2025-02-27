import { setupTestDB } from "../utils/setupTestRedis";
import request from "supertest";
import app from "../../src/app";
import { env } from "../../src/config/config";

setupTestDB();

const tokenizeUrl = "/v1/dataToken/tokenize";
const detokenizeUrl = "/v1/dataToken/detokenize";

jest.setTimeout(3 * 60 * 1000); // Set Jest timeout to 3 minutes

const tokenizeRequestBody = {
  id: "123",
  data: { field1: "value1" },
};

const detokenizeRequestBody = {
  id: "123",
  data: {
    field2: "",
  },
};

describe("DataToken routes", () => {
  let apiKeyService: string;
  let apiKeyServiceReadOnly: string;
  let apiKeyServiceWriteOnly: string;
  let jwt: string;
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ userId: env.admin.id, password: env.admin.password });
    jwt = loginResponse.body.tokens.access.token;
  });
  beforeAll(async () => {
    try {
      const [
        apiKeyResponse,
        apiKeyResponseServiceReadOnly,
        apiKeyResponseServiceWriteOnly,
      ] = await Promise.all([
        request(app)
          .post("/v1/apiKey/create")
          .set("Authorization", `Bearer ${jwt}`)
          .send({ roles: ["service"] }),
        request(app)
          .post("/v1/apiKey/create")
          .set("Authorization", `Bearer ${jwt}`)
          .send({ roles: ["serviceReadOnly"] }),
        request(app)
          .post("/v1/apiKey/create")
          .set("Authorization", `Bearer ${jwt}`)
          .send({ roles: ["serviceReadOnly"] }),
      ]);

      // Debugging logs
      console.log("API Key Response:", apiKeyResponse.body);
      console.log(
        "API Key Response Service ReadOnly:",
        apiKeyResponseServiceReadOnly.body
      );
      console.log(
        "API Key Response Service Write Only:",
        apiKeyResponseServiceWriteOnly.body
      );

      // Extract API keys from the responses
      apiKeyService = apiKeyResponse.body.apiKey;
      apiKeyServiceReadOnly = apiKeyResponseServiceReadOnly.body.apiKey;
      apiKeyServiceWriteOnly = apiKeyResponseServiceWriteOnly.body.apiKey;

      // Ensure variables are defined
      if (!apiKeyService || !apiKeyServiceReadOnly || !apiKeyServiceWriteOnly) {
        throw new Error("One or more API keys were not defined.");
      }
    } catch (error) {
      console.error("Error in beforeAll setup:", error);
      throw error; // Rethrow to ensure Jest is aware of the failure
    }
  }, 30000);

  beforeAll(async () => {
    // Finally, perform the tokenize operation
    const tokenizeResponse = await request(app)
      .post(tokenizeUrl)
      .set("x-api-key", apiKeyService)
      .send({ id: "123", data: { field2: "value2" } });
    const tokenId = tokenizeResponse.body.data["field2"];
    detokenizeRequestBody.data.field2 = tokenId;
  });

  describe("POST " + tokenizeUrl, () => {
    test("should return 201 - created token", async () => {
      await request(app)
        .post(tokenizeUrl)
        .set("x-api-key", apiKeyService)
        .send(tokenizeRequestBody)
        .expect(201)
        .expect((response) => {
          const { id, data } = response.body;
          expect(id).toBe(tokenizeRequestBody.id);
          expect(data).toHaveProperty("field1");
        });
    });
    test("should return 400 - wrong request body", async () => {
      const localRequestBody = { ...tokenizeRequestBody, x: "y" };
      await request(app).post(tokenizeUrl).send(localRequestBody).expect(400); // Assuming 400
    });

    test("should return 401 - wrong credentials", async () => {
      await request(app)
        .post(tokenizeUrl)
        .set("x-api-key", apiKeyService + "x")
        .send(tokenizeRequestBody)
        .expect(401);
    });

    test("should return 403 - apiKey is missing necessary privilige", async () => {
      await request(app)
        .post(tokenizeUrl)
        .set("x-api-key", apiKeyServiceReadOnly)
        .send(tokenizeRequestBody)
        .expect(403);
    });
  });

  describe("POST " + detokenizeUrl, () => {
    test("should return 200 - created token", async () => {
      await request(app)
        .post(detokenizeUrl)
        .set("x-api-key", apiKeyService)
        .send(detokenizeRequestBody)
        .expect(200)
        .expect((response) => {
          const { id, data } = response.body;
          expect(id).toBe(detokenizeRequestBody.id);
          expect(data).toHaveProperty("field2");
          expect(data.field2).toHaveProperty("found", true);
          expect(data.field2).toHaveProperty("value", "value2");
        });
    });

    test("should return 400 - wrong request body", async () => {
      const localRequestBody = { x: "y" };
      await request(app).post(detokenizeUrl).send(localRequestBody).expect(400); // Assuming 400
    });

    test("should return 401 - wrong credentials", async () => {
      await request(app)
        .post(detokenizeUrl)
        .set("x-api-key", apiKeyService + "x")
        .send(detokenizeRequestBody)
        .expect(401);
    });

    test("should return 403 - apiKey is missing necessary privilige", async () => {
      await request(app)
        .post(tokenizeUrl)
        .set("x-api-key", apiKeyServiceWriteOnly)
        .send(detokenizeRequestBody)
        .expect(403);
    });
  });
});
