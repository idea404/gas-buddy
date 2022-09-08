import test from "ava";
import { gasBuddy } from "../src/api.js";

const IS_MAINNET = false;
const TEST_CONTRACT_SMALL_STATE = "smallgb.idea404.testnet";
const TEST_CONTRACT_LARGE_STATE = "largegb.idea404.testnet";

test("should error if contract account id is not set", async (t) => {
  try {
    await gasBuddy(null, "test", null, {}, IS_MAINNET);
  } catch (e) {
    t.is(e.message, "contract_account_id is not set");
  }
});

test("should only accept .near contract account ids", async (t) => {
  try {
    await gasBuddy("test", "test", null, {}, IS_MAINNET);
  } catch (e) {
    t.is(e.message, "Invalid contract account id: test. Expected contract account id to end with .near or .testnet");
  }
});

test("should error if account does not exist", async (t) => {
  const accountId = "some.account.nobody.has.testnet";
  try {
    await gasBuddy(accountId, "test", null, {}, IS_MAINNET);
  } catch (e) {
    t.is(e.message, `Account ${accountId} does not exist`);
  }
});

test("should error if function name is not set", async (t) => {
  try {
    await gasBuddy("test.near", null, null, {}, IS_MAINNET);
  } catch (e) {
    t.is(e.message, "function_name is not set");
  }
});

test("should return gas profile with data if contract state is less than 50KB", async (t) => {
  const gasProfile = await gasBuddy(TEST_CONTRACT_SMALL_STATE, "add_message", null, { message: "Hello World!" }, IS_MAINNET);
  t.true(gasProfile.withData);
  t.true(gasProfile.summary.totalGasUnitsUsed > 0);
});

test.failing("should fetch contract without data if contract state exceeds 50KB", async (t) => {
  const gasProfile = await gasBuddy(TEST_CONTRACT_SMALL_STATE, "add_message", null, { message: "Hello World!" }, IS_MAINNET);
  t.false(gasProfile.withData);
  t.true(gasProfile.summary.totalGasUnitsUsed > 0);
});

test.todo("should error if contract is not initialized");
test.todo("should error if contract is not deployed");
test.todo("should error if prepaid gas is exceeded");
test.todo("should error if wrong args are provided");
test.todo("should error if function name does not exist");
test.todo("should error if function performs cross-contract calls");
