import { setupTestDB } from "../utils/setupTestRedis";
import request from "supertest";
import app from "../../src/app";
import { env } from "../../src/config/config";

setupTestDB();

const tokenizeUrl = "/v1/dataToken/tokenize";
const detokenizeUrl = "/v1/dataToken/detokenize";

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
  let tokenId: string;
  beforeAll(async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .send({ userId: env.admin.id, password: env.admin.password });
    const jwt = response.body.tokens.access.token;
    const apiKeyResponse = await request(app)
      .post("/v1/apiKey/create")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        roles: ["service"],
      });
    apiKeyService = apiKeyResponse.body.apiKey;
    const apiKeyResponseServiceReadOnly = await request(app)
      .post("/v1/apiKey/create")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        roles: ["serviceReadOnly"],
      });
    apiKeyServiceReadOnly = apiKeyResponseServiceReadOnly.body.apiKey;
    const apiKeyResponseServiceWriteOnly = await request(app)
      .post("/v1/apiKey/create")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        roles: ["serviceReadOnly"],
      });
    apiKeyServiceWriteOnly = apiKeyResponseServiceWriteOnly.body.apiKey;

    const tokenizeResponse = await request(app)
      .post(tokenizeUrl)
      .set("x-api-key", apiKeyService)
      .send({ id: "123", data: { field2: "value2" } });
    tokenId = tokenizeResponse.body.data["field2"];
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
      console.log(detokenizeRequestBody);
      await request(app)
        .post(detokenizeUrl)
        .set("x-api-key", apiKeyService)
        .send(detokenizeRequestBody)
        .expect(200)
        .expect((response) => {
          console.log(response.body);
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
