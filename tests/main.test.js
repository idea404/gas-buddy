const api = require("../src/api");

describe("gasBuddy", () => {
  it("should error if contract account id is not set", async () => {
    try {
      await api.gasBuddy(null, "test", "latest", {});
    } catch (e) {
      expect(e.message).toBe("contract_account_id is not set");
    }
  });

  it("should only accept .near contract account ids", async () => {
    try {
      await api.gasBuddy("test", "test", "latest", {});
    } catch (e) {
      expect(e.message).toBe("Expected Smart Contract Account ID to end with .near");
    }
  });

  it("should error if account does not exist", async () => {
    try {
      await api.gasBuddy("someunexistingaccountnobodywouldevertake.near", "test", "latest", {});
    } catch (e) {
      expect(e.message).toBe("Account someunexistingaccountnobodywouldevertake.near does not exist");
    }
  });

  it("should error if function name is not set", async () => {
    jest.mock("../src/asserts", () => ({
      ...require.requireActual("../src/asserts"),
      validateContractAccountId: jest.fn(),
    }));
    try {
      await api.gasBuddy("test.near", null, "latest", {});
    } catch (e) {
      expect(e.message).toBe("function_name is not set");
    }
  });

  it.todo("should fetch contract without data if contract state exceeds 50KB");
  it.todo("should error if contract is not initialized");
  it.todo("should error if contract is not deployed");
  it.todo("should error if wrong args are provided");
  it.todo("should error if function name does not exist");
  it.todo("should error if function performs cross-contract calls");
});
