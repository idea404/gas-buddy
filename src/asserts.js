import { logger } from "./logger.js";
import { providers } from "near-api-js";

async function assertParameters(contractAccountId, functionName) {
  const isMainnet = await validateContractAccountId(contractAccountId);
  assertFunctionName(functionName);
  await hasDeployedContract(contractAccountId, isMainnet ? "mainnet" : "testnet");
  return isMainnet;
}

async function validateContractAccountId(contractAccountId) {
  logger.debug(`Validating contract account id ${contractAccountId}`);
  if (!contractAccountId) {
    throw new Error("contract_account_id is not set");
  }
  const isMainnet = hasMainnetAddress(contractAccountId);
  await accountExists(contractAccountId, isMainnet ? "mainnet" : "testnet");
  return isMainnet;
}

function assertFunctionName(functionName) {
  logger.debug(`Validating function name ${functionName}`);
  if (!functionName) {
    throw new Error("function_name is not set");
  }
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

async function hasDeployedContract(accountId, environmentNetwork) {
  const provider = new providers.JsonRpcProvider(`https://rpc.${environmentNetwork}.near.org`);
  const response = await provider.query({
    request_type: "view_account",
    account_id: accountId,
    finality: "final",
  });
  if (response.code_hash === "11111111111111111111111111111111") {
    logger.debug(`Account ${accountId} has not deployed a contract`);
    throw new Error(`Account ${accountId} has not deployed a contract`);
  }
}

function hasMainnetAddress(contractAccountId) {
  const envRootAccountName = contractAccountId.split(".")[contractAccountId.split(".").length - 1];
  if (envRootAccountName !== "near" && envRootAccountName !== "testnet") {
    throw new Error(`Invalid contract account id: ${contractAccountId}. Expected contract account id to end with .near or .testnet`);
  }
  return envRootAccountName === "near";
}

export { assertParameters };
