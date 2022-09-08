import test from "ava";
import { gasBuddy } from "../src/api.js";

const TEST_CONTRACT_SMALL_STATE = "smallgb.idea404.testnet";
const TEST_CONTRACT_LARGE_STATE = "largegb.idea404.testnet";
const TEST_ACCOUNT_NO_CONTRACT = "nocontract.idea404.testnet";

test("should error if contract account id is not set", async (t) => {
  try {
    await gasBuddy(null, "test", null, {});
  } catch (e) {
    t.is(e.message, "contract_account_id is not set");
  }
});

test("should only accept .near contract account ids", async (t) => {
  try {
    await gasBuddy("test", "test", null, {});
  } catch (e) {
    t.is(e.message, "Invalid contract account id: test. Expected contract account id to end with .near or .testnet");
  }
});

test("should error if account does not exist", async (t) => {
  const accountId = "some.account.nobody.has.testnet";
  try {
    await gasBuddy(accountId, "test", null, {});
  } catch (e) {
    t.is(e.message, `Account ${accountId} does not exist`);
  }
});

test("should error if function name is not set", async (t) => {
  try {
    await gasBuddy("test.near", null, null, {});
  } catch (e) {
    t.is(e.message, "function_name is not set");
  }
});

test("should return gas profile with data if contract state is less than 50KB", async (t) => {
  const gasProfile = await gasBuddy(TEST_CONTRACT_SMALL_STATE, "add_message", null, { message: "Hello World!" });
  t.true(gasProfile.withData);
  t.true(gasProfile.summary.totalGasUnitsUsed > 0);
});

test("should fetch contract without data if contract state exceeds 50KB", async (t) => {
  const gasProfile = await gasBuddy(TEST_CONTRACT_LARGE_STATE, "add_message", null, { message: "Hello World!" });
  t.false(gasProfile.withData);
  t.true(gasProfile.summary.totalGasUnitsUsed > 0);
});

test("should error if contract is not deployed", async (t) => {
  try {
    await gasBuddy(TEST_ACCOUNT_NO_CONTRACT, "add_message", null, { message: "Hello World!" });
    t.fail();
  } catch (e) {
    t.is(e.message, `Account ${TEST_ACCOUNT_NO_CONTRACT} has not deployed a contract`);
  }
});

test("should error if prepaid gas is exceeded", async (t) => {
  const message = "Hello World!".repeat(100);
  const options = {
    gas: "3" + "0".repeat(1),
    attached_deposit: "10" + "0".repeat(24), // 10 NEAR in yoctoNEAR
  };
  try {
    await gasBuddy(TEST_CONTRACT_SMALL_STATE, "add_message", null, { message: message }, options);
    t.fail();
  } catch (e) {
    t.log(e.message);
    t.true(e.message.includes(`Function gas unit expense (4861320038330) exceeded attached: ${options.gas}`));
  }
});

test.todo("should error if contract is not initialized");
test.todo("should error if wrong args are provided");
test.todo("should error if function name does not exist");
test.todo("should error if function performs cross-contract calls");
