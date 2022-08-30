import { NEAR, Worker } from "near-workspaces";
import { logger } from "./logger";

const DEFAULT_CONTRACT_INIT_BALANCE = NEAR.parse("1000 N").toJSON();  // TODO: use config to set init_balance
const DEFAULT_OPTIONS = {
  gas: "100000", // TODO: use config to set gas
  attached_deposit: "0", // TODO: use config to set deposit
};

// function for profiling
export async function profileGasCosts(contractAccountId, functionName, argsObject, blockId) {
  const worker = await Worker.init();
  const root = worker.rootAccount;

  const contract = await spoonContract(root, contractAccountId, blockId);

  const alice = await root.createSubAccount("alice", { initialBalance: NEAR.parse("100 N").toJSON() }); // TODO: use config to set initial balance for account 

  const result = await alice.callRaw(contract, functionName, argsObject, DEFAULT_OPTIONS);

  await t.context.worker.tearDown().catch((error) => { 
    console.log("Failed to tear down the worker:", error); 
  });

  const gasProfileObject = extractGasProfile(result);
  const enrichedGasProfileObject = enrichGasProfile(gasProfileObject);

  return enrichedGasProfileObject;
}

async function spoonContract(root, contractAccountId, blockId) {
  logger.info(`Loading contract from ${contractAccountId} at block ${blockId}`);	
  try {
    return (contract = await root.importContract({
      mainnetContract: contractAccountId,
      blockId: blockId,
      withData: true,
      initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
    }));
  } catch (error) {
    if (error.message.includes(`State of contract ${contractAccountId} is too large to be viewed`)) {
      logger.warn(`State of contract ${contractAccountId} is too large to be viewed, loading without data`);
      return (contract = await root.importContract({
        mainnetContract: contractAccountId,
        blockId: blockId,
        withData: false,
        initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
      }));
    }
    if (error.message.includes("The contract is not initialized")) {
      logger.info(`Contract ${contractAccountId} is not initialized, throwing error`);
      throw new Error(`Contract deployed to ${contractAccountId} not initialized. Please provide a initialized contract.`);
    }
  }
}

function extractGasProfile(result) {
  // TODO
  return result;
}

function enrichGasProfile(gasProfileObject) {
  // TODO
  return gasProfileObject;
}