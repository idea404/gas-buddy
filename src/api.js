import { assertParameters } from "./asserts.js";
import { profileGasCosts } from "./profiler.js";

async function gasBuddy(contractAccountId, functionName, blockId, args) {
  const isMainnet = await assertParameters(contractAccountId, functionName);
  return await profileGasCosts(contractAccountId, functionName, blockId || null, args, isMainnet);
}

export { gasBuddy };
