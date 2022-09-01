const lg = require("./logger");
const { providers } = require("near-api-js");

async function validateContractAccountId(contractAccountId) {
  lg.logger.debug(`Validating contract account id ${contractAccountId}`);
  if (!contractAccountId) {
    throw new Error("contract_account_id is not set");
  }
  const environmentNetwork = contractAccountId.split(".")[contractAccountId.split(".").length - 1];
  if (environmentNetwork !== "near") {
    throw new Error("Expected Smart Contract Account ID to end with .near");
  }
  await accountExists(contractAccountId, "mainnet");
}

function validateFunctionName(functionName) {
  lg.logger.debug(`Validating function name ${functionName}`);
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

async function accountExists(accountId, environmentNetwork) {
  const provider = new providers.JsonRpcProvider(`https://rpc.${environmentNetwork}.near.org`);
  try {
    await provider.query({
      request_type: "view_account",
      account_id: accountId,
      finality: "final",
    });
  } catch (e) {
    if (e.message === `[-32000] Server error: account ${accountId} does not exist while viewing`) {
      lg.logger.debug(`Account ${accountId} does not exist`);
      throw new Error(`Account ${accountId} does not exist`);
    }
  }
  lg.logger.debug(`Account ${accountId} exists`);
}

module.exports = { validateContractAccountId, validateFunctionName };
