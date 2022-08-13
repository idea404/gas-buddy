const express = require("express");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post("/test", (req, res) => {
  const { contract_account_id, function_name } = req.query;
  const args = req.body;

  // TODO: validate contract_account_id and function_name and args

  res.status(200).send({
    message: "Welcome to the API",
    provided_parameters: `contract_account_id: ${contract_account_id}, function_name: ${function_name}`,
    provided_args: "args: " + JSON.stringify(args),
    args: `paramA: ${args.paramA}, paramB: ${args.paramB}`,
  });
});

app.post("/", async (req, res) => {
  const { contract_account_id, function_name } = req.query;
  const { args } = req.body;

  // TODO: validate contract_account_id and function_name and args

  res.status(200).send(
    await profileGasCosts(contract_account_id, function_name, args)
  );
});


app.listen(PORT, () => {
  if (!PORT) {
    throw new Error("PORT is not set");
  }
  console.log(`Server is running on port ${PORT}`);
});
