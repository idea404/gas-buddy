import { app } from "../../src/index.js";
import test from "ava";
import request from "supertest";

import { logger } from "../../src/logger.js";
logger.level = "error";

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

test("GET /", async (t) => {
  const res = await request(app).get("/");
  const expected = {
    message: "Welcome to the GasBuddy API",
    methods: {
      "/profile": {
        method: "POST",
        description: "Get gas usage for a given contract call",
        body_parameters: {
          contract_account_id: "The contract account ID",
          method: "The method name",
          args: `The arguments to pass to the method, passed in as a JSON object of key-value pairs. For example, {"text": "hello"}`,
        },
      },
    },
  };
  t.is(res.status, 200);
  t.deepEqual(res.body, expected);
});

test("POST /profile", async (t) => {
  const contractAccountId = "smallgb.idea404.testnet";
  const functionName = "add_message";
  const res = await request(app)
    .post("/profile")
    .send({
      contract_account_id: contractAccountId,
      method: functionName,
      args: { text: "hello" },
    });
  t.is(res.status, 200);
  t.is(res.body.details.status.SuccessValue, "");
  t.true(res.body.summary.totalGasUnitsUsed > 0);
  t.true(res.body.summary.totalGasUnitsUsedReceiptCreation > 0);
  t.true(res.body.summary.totalGasUnitsUsedReceiptExecution > 0);
});
