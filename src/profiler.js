import { NEAR, Worker } from "near-workspaces";
import { logger } from "./logger.js";

const DEFAULT_CONTRACT_INIT_BALANCE = NEAR.parse("1000 N").toJSON();
const DEFAULT_ACCOUNT_INIT_BALANCE = NEAR.parse("100 N").toJSON();
const DEFAULT_OPTIONS = {
  gas: "300000000000000", // 300 TGas // TODO: can fetch dynamically
  attached_deposit: "10" + "0".repeat(24), // 10 NEAR in yoctoNEAR
};

// function for profiling
async function profileGasCosts(contractAccountId, functionName, blockId, argsObject, isMainnet) {
  logger.info(`Profiling gas costs for contract: ${contractAccountId} function: ${functionName}`);
  logger.debug(`Args: ${JSON.stringify(argsObject)} blockId: ${blockId}`);
  const worker = await Worker.init();
  const root = worker.rootAccount;

  const { contract, withData } = await spoonContract(root, contractAccountId, blockId, isMainnet);

  const alice = await root.createSubAccount("alice", { initialBalance: DEFAULT_ACCOUNT_INIT_BALANCE });

  const result = await alice.callRaw(contract, functionName, argsObject, DEFAULT_OPTIONS);

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
  logger.info(`Enriching gas profile}`);
  const summary = getSummary(gasProfileObject);
  const resultProfile = { details: { ...gasProfileObject.result }, withData: isFullData, summary: summary };
  logger.debug(`Gas profile: ${JSON.stringify(resultProfile)}`);
  return resultProfile;
}

function getSummary(gasProfileObject) {
  const totalGasUnitsUsedReceiptCreation = getGasUsedReceiptCreation(gasProfileObject);
  const totalGasUnitsUsedReceiptExecution = getGasUsedReceiptExecution(gasProfileObject);
  const totalGasUnitsUsed = totalGasUnitsUsedReceiptCreation + totalGasUnitsUsedReceiptExecution;
  return {
    totalGasUnitsUsedReceiptCreation,
    totalGasUnitsUsedReceiptExecution,
    totalGasUnitsUsed,
  };
}

function getGasUsedReceiptCreation(gasProfileObject) {
  let gasUsedReceiptCreation = 0;
  for (const receipt of gasProfileObject.result.receipts_outcome) {
    const receiptStatus = receipt.outcome.status;
    if (receiptStatus.hasOwnProperty("SuccessValue")) {
      if (receipt.outcome.metadata.gas_profile.length > 0) {
        gasUsedReceiptCreation += parseInt(receipt.outcome.gas_burnt);
      }
    }
  }
  return gasUsedReceiptCreation;
}

function getGasUsedReceiptExecution(gasProfileObject) {
  return gasProfileObject.result.transaction_outcome.outcome.gas_burnt;
}

export { profileGasCosts };
