import { redisClients } from "../../src/app";
import { getKeys } from "../../src/utils/getKeys";

export const setupTestDB = () => {
  beforeEach(async () => {
    // flush redis
    const clientNames = getKeys(redisClients);
    await Promise.all(
      clientNames.map(async (clientName) => {
        await redisClients[clientName].flushAll();
      })
    );
  });

  afterAll(async () => {
    const clientNames = getKeys(redisClients);
    await Promise.all(
      clientNames.map(async (clientName) => {
        await redisClients[clientName].disconnect();
      })
    );
  });
};
