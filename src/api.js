import { assertParameters } from "./asserts.js";
import { profileGasCosts } from "./profiler.js";

const DEFAULT_OPTIONS = {
  gas: "3" + "0".repeat(14), // 300 TGas // TODO: can fetch dynamically
  attached_deposit: "10" + "0".repeat(24), // 10 NEAR in yoctoNEAR
};

async function gasBuddy(contractAccountId, functionName, blockId, args, options = {}) {
  const isMainnet = await assertParameters(contractAccountId, functionName);
  return await profileGasCosts(contractAccountId, functionName, blockId || null, args, isMainnet, options || DEFAULT_OPTIONS);
}

export { gasBuddy };
