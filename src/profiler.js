import { NEAR, Worker } from "near-workspaces";
import { logger } from "./logger.js";

const DEFAULT_CONTRACT_INIT_BALANCE = NEAR.parse("1000 N").toJSON();
const DEFAULT_ACCOUNT_INIT_BALANCE = NEAR.parse("100 N").toJSON();

// function for profiling
async function profileGasCosts(contractAccountId, functionName, blockId, argsObject, isMainnet, options) {
  logger.info(`Profiling gas costs for contract: ${contractAccountId} function: ${functionName}`);
  logger.debug(`Args: ${JSON.stringify(argsObject)} blockId: ${blockId}`);
  const worker = await Worker.init();
  const root = worker.rootAccount;

  const { contract, withData } = await spoonContract(root, contractAccountId, blockId, isMainnet);

  const alice = await root.createSubAccount("alice", { initialBalance: DEFAULT_ACCOUNT_INIT_BALANCE });

  const result = await alice.callRaw(contract, functionName, argsObject, options);

  await worker.tearDown().catch((error) => {
    logger.error("Failed to tear down the worker:", error);
  });

  const enrichedResult = enrichGasProfile(result, withData);

  return enrichedResult;
}

async function spoonContract(root, contractAccountId, blockId, isMainnet) {
  logger.info(`Loading contract from ${contractAccountId} at block ${blockId}`);
  try {
    logger.debug(`Trying to load contract from ${contractAccountId} at block ${blockId}`);
    const contract = await root.importContract({
      mainnetContract: isMainnet ? contractAccountId : undefined,
      testnetContract: isMainnet ? undefined : contractAccountId,
      blockId: blockId,
      withData: true,
      initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
    });
    logger.debug(`Contract ${contract} loaded from ${contractAccountId} at block ${blockId}`);
    return { contract, withData: true };
  } catch (error) {
    if (error.message.includes(`State of contract ${contractAccountId} is too large to be viewed`)) {
      logger.warn(`State of contract ${contractAccountId} is too large to be viewed, loading without data`);
      const contract = await root.importContract({
        mainnetContract: isMainnet ? contractAccountId : undefined,
        testnetContract: isMainnet ? undefined : contractAccountId,
        blockId: blockId,
        withData: false,
        initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
      });
      return { contract, withData: false };
    }
    if (error.message.includes("The contract is not initialized")) {
      logger.info(`Contract ${contractAccountId} is not initialized, throwing error`);
      throw new Error(`Contract deployed to ${contractAccountId} not initialized. Please provide a initialized contract.`);
    }
    throw new Error(`Failed to load contract ${contractAccountId} at block ${blockId}: ${error}`);
  }
}

function enrichGasProfile(gasProfileObject, isFullData) {
  logger.info(`Enriching gas profile`);
  const summary = getSummary(gasProfileObject);
  const resultProfile = { details: { ...gasProfileObject.result }, withData: isFullData, summary: summary };
  logger.debug(`Gas profile summary: ${JSON.stringify(resultProfile.summary)}`);
  return resultProfile;
}

function getSummary(gasProfileObject) {
  const totalGasUnitsUsedReceiptCreation = getGasUsedReceiptCreation(gasProfileObject);
  const totalGasUnitsUsedReceiptExecution = getGasUsedReceiptExecution(gasProfileObject);
  const totalGasUnitsUsed = totalGasUnitsUsedReceiptCreation + totalGasUnitsUsedReceiptExecution;

  const objectStr = JSON.stringify(gasProfileObject);
  if (objectStr.includes("FunctionCallError")) {
    if (objectStr.includes("Exceeded the prepaid gas.")) {
      const gasAttached = parseInt(gasProfileObject.result.transaction.actions[0].FunctionCall.gas);
      logger.debug(`Function gas unit expense (${totalGasUnitsUsed}) exceeded attached: ${gasAttached}`);
      throw new Error(`Function gas unit expense (${totalGasUnitsUsed}) exceeded attached: ${gasAttached}`);
    }
    if (objectStr.includes("Smart contract panicked: The contract is not initialized")) {
      throw new Error(`Contract not initialized. Please provide an initialized contract.`);
    }
    if (objectStr.includes(`{"MethodResolveError":"MethodNotFound"}`)) {
      throw new Error(`Method not found. Please provide a valid method.`);
    }
    throw new Error(`FunctionCallError: ${JSON.stringify(gasProfileObject.result.status.Failure.ActionError.kind)}`);
  }


  return {
    totalGasUnitsUsedReceiptCreation,
    totalGasUnitsUsedReceiptExecution,
    totalGasUnitsUsed,
  };
}

function getGasUsedReceiptCreation(gasProfileObject) {
  let gasUsedReceiptCreation = 0;
  for (const receipt of gasProfileObject.result.receipts_outcome) {
    if (receipt.outcome.metadata.gas_profile.length > 0) {
      gasUsedReceiptCreation += parseInt(receipt.outcome.gas_burnt);
    }
  }
  return gasUsedReceiptCreation;
}

function getGasUsedReceiptExecution(gasProfileObject) {
  return gasProfileObject.result.transaction_outcome.outcome.gas_burnt;
}

export { profileGasCosts };
