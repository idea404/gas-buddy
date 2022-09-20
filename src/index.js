import express, { json } from "express";
import { hostname } from "os";
import { gasBuddy } from "./api.js";

export const app = express();
const PORT = 3000;

app.use(json());

app.get("/test", (req, res) => {
  res.send({
    message: "Welcome to the API",
    machine_serving_response: hostname(),
  });
});

app.post("/test", (req, res) => {
  const { contract_account_id, function_name } = req.query;
  const args = req.body;

  res.status(200).send({
    message: "Welcome to the API",
    machine_serving_response: hostname(),
    provided_parameters: `contract_account_id: ${contract_account_id}, function_name: ${function_name}`,
    provided_args: "args: " + JSON.stringify(args),
    args: `paramA: ${args.paramA}, paramB: ${args.paramB}`,
  });
});

app.post("/profile", async (req, res) => {
  const { contract_account_id, function_name, block_id, args } = req.body;

  try {
    const gasData = await gasBuddy(contract_account_id, function_name, block_id, args);
    res.status(200).send(gasData);
  } catch (e) {
    res.status(e.status || 500).json({
      error: {
        message: e.message,
      },
    });
  }
});

app.use((req, res, next) => {
  res.status(404).send({
    message: "Page not found.",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err,
    message: err.message,
  });
});

app.listen(PORT, () => {
  if (!PORT) {
    throw new Error("PORT is not set");
  }
  console.log(`Server is running on port ${PORT}`);
});
