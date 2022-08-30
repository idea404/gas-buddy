const https = require("https");

function validateArgs(contractAccountId, functionName, blockId, args) {
  validateContractAccountId(contractAccountId);
  validateFunctionName(functionName);
  validateBlockId(blockId);
  validateArgs(args);
}

function validateContractAccountId(contractAccountId) {
  if (!contractAccountId) {
    throw new Error("contract_account_id is not set");
  }
  checkAccountExist(contractAccountId);
}

function validateFunctionName(functionName) {
  if (!functionName) {
    throw new Error("function_name is not set");
  }
  // TODO
}

function validateBlockId(blockId) {
  // TODO
}

function validateArgs(args) {
  // TODO
}

async function checkAccountExist(accountId) {
  const body = JSON.stringify({
    jsonrpc: "2.0",
    id: "dontcare",
    method: "query",
    params: {
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    },
  });

  const options = {
    hostname: "rpc.testnet.near.org",
    port: "443",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": body.length,
    },
  };

  var req = https.request(options, (res) => {
    console.log("statusCode:", res.statusCode);
    console.log("headers:", res.headers);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.write(body);
  req.end();
}

module.exports = { validateArgs, checkAccountExist };
