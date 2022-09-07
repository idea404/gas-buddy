const asserts = require("./asserts");
const profiler = require("./profiler");

async function gasBuddy(contractAccountId, functionName, blockId, args) {
  const isMainnet = await asserts.validateContractAccountId(contractAccountId);
  asserts.validateFunctionName(functionName);
  return await profiler.profileGasCosts(contractAccountId, functionName, blockId || null, args, isMainnet);
}

module.exports = { gasBuddy };
