const ws = require("near-workspaces");
const lg = require("./logger");

const DEFAULT_CONTRACT_INIT_BALANCE = ws.NEAR.parse("1000 N").toJSON(); 
const DEFAULT_ACCOUNT_INIT_BALANCE = ws.NEAR.parse("100 N").toJSON();
const DEFAULT_OPTIONS = {
  gas: "100000",
  attached_deposit: "0",
};

// function for profiling
async function profileGasCosts(contractAccountId, functionName, blockId, argsObject) {
  lg.logger.info(`Profiling gas costs for contract: ${contractAccountId} function: ${functionName}`);
  lg.logger.debug(`Args: ${JSON.stringify(argsObject)} blockId: ${blockId}`);
  const worker = await ws.Worker.init();
  const root = worker.rootAccount;

  const contract = await spoonContract(root, contractAccountId, blockId);

  const alice = await root.createSubAccount("alice", { initialBalance: DEFAULT_ACCOUNT_INIT_BALANCE });

  const result = await alice.callRaw(contract, functionName, argsObject, DEFAULT_OPTIONS);
  console.log(result); // TODO: remove
  console.log(JSON.stringify(result)); // TODO: remove

  await t.context.worker.tearDown().catch((error) => { 
    console.log("Failed to tear down the worker:", error); 
  });

  const gasProfileObject = extractGasProfile(result);
  const enrichedGasProfileObject = enrichGasProfile(gasProfileObject);

  return enrichedGasProfileObject;
}

async function spoonContract(root, contractAccountId, blockId) {
  lg.logger.info(`Loading contract from ${contractAccountId} at block ${blockId}`);	
  try {
    return (contract = await root.importContract({
      mainnetContract: contractAccountId,
      blockId: blockId,
      withData: true,
      initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
    }));
  } catch (error) {
    if (error.message.includes(`State of contract ${contractAccountId} is too large to be viewed`)) {
      lg.logger.warn(`State of contract ${contractAccountId} is too large to be viewed, loading without data`);
      return (contract = await root.importContract({
        mainnetContract: contractAccountId,
        blockId: blockId,
        withData: false,
        initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
      }));
    }
    if (error.message.includes("The contract is not initialized")) {
      lg.logger.info(`Contract ${contractAccountId} is not initialized, throwing error`);
      throw new Error(`Contract deployed to ${contractAccountId} not initialized. Please provide a initialized contract.`);
    }
  }
}

function extractGasProfile(result) {
  lg.logger.info(`Extracting gas profile}`);
  lg.logger.debug(`Gas profile: ${JSON.stringify(result)}`);
  // TODO
  return result;
}

function enrichGasProfile(gasProfileObject) {
  lg.logger.info(`Enriching gas profile}`);
  lg.logger.debug(`Gas profile: ${JSON.stringify(gasProfileObject)}`);
  // TODO
  return gasProfileObject;
}

module.exports = { profileGasCosts };