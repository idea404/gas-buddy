const express = require("express");
const app = express();
const api = require("./api");
const PORT = process.env.PORT;

app.use(express.json());

app.post("/test", (req, res) => {
  const { contract_account_id, function_name } = req.query;
  const args = req.body;

  res.status(200).send({
    message: "Welcome to the API",
    provided_parameters: `contract_account_id: ${contract_account_id}, function_name: ${function_name}`,
    provided_args: "args: " + JSON.stringify(args),
    args: `paramA: ${args.paramA}, paramB: ${args.paramB}`,
  });
});

app.post("/", async (req, res) => {
  const { contract_account_id, function_name, block_id } = req.query;
  const { args } = req.body;
  
  res.status(200).send(
      await api.gasBuddy(contract_account_id, function_name, block_id, args)
  );
});


app.listen(PORT, () => {
  if (!PORT) {
    throw new Error("PORT is not set");
  }
  console.log(`Server is running on port ${PORT}`);
});
