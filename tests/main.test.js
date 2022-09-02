// TODO: include tests for the following:
// - contract that is >50KB
// - contract that is not initialized
// - contract that is not deployed
// - wrong args provided
// - function name does not exist
// - function performs cross-contract calls
const api = require("../src/api");

describe("gasBuddy", () => {
  it("should error if contract account id is not set", async () => {
    try {
      await api.gasBuddy(null, "test", "latest", {});
    } catch (e) {
      expect(e.message).toBe("contract_account_id is not set");
    }
  });
});
