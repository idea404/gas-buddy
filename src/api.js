import { validateContractAccountId, validateFunctionName } from "./asserts.js";
import { profileGasCosts } from "./profiler.js";

async function gasBuddy(contractAccountId, functionName, blockId, args) {
  const isMainnet = await validateContractAccountId(contractAccountId);
  validateFunctionName(functionName);
  return await profileGasCosts(contractAccountId, functionName, blockId || null, args, isMainnet);
}

export { gasBuddy };
