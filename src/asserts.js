import { logger } from "./logger.js";
import { providers } from "near-api-js";

async function validateContractAccountId(contractAccountId) {
  logger.debug(`Validating contract account id ${contractAccountId}`);
  if (!contractAccountId) {
    throw new Error("contract_account_id is not set");
  }
  const isMainnet = hasMainnetAddress(contractAccountId);
  await accountExists(contractAccountId, isMainnet ? "mainnet" : "testnet");
  return isMainnet;
}

function validateFunctionName(functionName) {
  logger.debug(`Validating function name ${functionName}`);
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
      logger.debug(`Account ${accountId} does not exist`);
      throw new Error(`Account ${accountId} does not exist`);
    }
  }
  logger.debug(`Account ${accountId} exists`);
}

function hasMainnetAddress(contractAccountId) {
  const envRootAccountName = contractAccountId.split(".")[contractAccountId.split(".").length - 1];
  if (envRootAccountName !== "near" && envRootAccountName !== "testnet") {
    throw new Error(`Invalid contract account id: ${contractAccountId}. Expected contract account id to end with .near or .testnet`);
  }
  return envRootAccountName === "near";
}

export { validateContractAccountId, validateFunctionName };
