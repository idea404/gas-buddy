import { app } from "../../src/index.js";
import test from "ava";
import request from "supertest";

test("GET /test", async (t) => {
  const res = await request(app).get("/test");
  const expected = {
    message: "Welcome to the API",
    machine_serving_response: "ABC",
  };
  t.is(res.status, 200);
  t.deepEqual({ ...res.body, ...{ machine_serving_response: "ABC" } }, expected);
});

test("POST /test", async (t) => {
  const contractAccountId = "test-cid";
  const functionName = "test-fn";
  const res = await request(app).post(`/test?contract_account_id=${contractAccountId}&function_name=${functionName}`).send({
    paramA: "hello",
    paramB: "world",
  });
  const expected = {
    message: "Welcome to the API",
    machine_serving_response: "ABC",
    provided_parameters: "contract_account_id: test-cid, function_name: test-fn",
    provided_args: 'args: {"paramA":"hello","paramB":"world"}',
    args: "paramA: hello, paramB: world",
  };
  t.is(res.status, 200);
  t.deepEqual({ ...res.body, ...{ machine_serving_response: "ABC" } }, expected);
});

test("POST /profile", async (t) => {
  const contractAccountId = "smallgb.idea404.testnet";
  const functionName = "add_message";
  const res = await request(app).post(`/profile?contract_account_id=${contractAccountId}&function_name=${functionName}`).send({
    text: "hello",
  });
  t.is(res.status, 200);
  t.is(res.body.details.status.SuccessValue, "");
  t.true(res.body.summary.totalGasUnitsUsed > 0);
  t.true(res.body.summary.totalGasUnitsUsedReceiptCreation > 0);
  t.true(res.body.summary.totalGasUnitsUsedReceiptExecution > 0);
});
