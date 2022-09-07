const api = require("../src/api");

describe("gasBuddy", () => {
  jest.setTimeout(30000000);
  const IS_MAINNET = false;
  const TEST_CONTRACT_SMALL_STATE = "smallgb.idea404.testnet"; // TODO: CI
  const TEST_CONTRACT_LARGE_STATE = "xxx"; // TODO

  it("should error if contract account id is not set", async () => {
    try {
      await api.gasBuddy(null, "test", null, {}, IS_MAINNET);
    } catch (e) {
      expect(e.message).toBe("contract_account_id is not set");
    }
  });

  it("should only accept .near contract account ids", async () => {
    try {
      await api.gasBuddy("test", "test", null, {}, IS_MAINNET);
    } catch (e) {
      expect(e.message).toBe("Invalid contract account id: test. Expected contract account id to end with .near or .testnet");
    }
  });

  it("should error if account does not exist", async () => {
    try {
      await api.gasBuddy("someunexistingaccountnobodywouldevertake.near", "test", null, {}, IS_MAINNET);
    } catch (e) {
      expect(e.message).toBe("Account someunexistingaccountnobodywouldevertake.near does not exist");
    }
  });

  it("should error if function name is not set", async () => {
    jest.spyOn(require("../src/asserts"), "validateContractAccountId").mockImplementation(() => {});
    try {
      await api.gasBuddy("test.near", null, null, {}, IS_MAINNET);
    } catch (e) {
      expect(e.message).toBe("function_name is not set");
    }
  });

  it("should return gas profile with data if contract state is less than 50KB", async () => {
    jest.spyOn(require("../src/asserts"), "validateContractAccountId").mockImplementation(() => {});
    const gasProfile = await api.gasBuddy(TEST_CONTRACT_SMALL_STATE, "add_message", null, { message: "Hello World!" }, IS_MAINNET);
    expect(gasProfile).toBeDefined();
    expect(gasProfile.withData).toBe(true);
    expect(gasProfile.summary.totalGasUnitsUsed).toBeGreaterThan(0);
  });

  it.todo("should fetch contract without data if contract state exceeds 50KB");
  it.todo("should error if contract is not initialized");
  it.todo("should error if contract is not deployed");
  it.todo("should error if prepaid gas is exceeded");
  it.todo("should error if wrong args are provided");
  it.todo("should error if function name does not exist");
  it.todo("should error if function performs cross-contract calls");
});
