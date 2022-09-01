const asserts = require("./asserts");
const profiler = require("./profiler");

async function gasBuddy(contractAccountId, functionName, blockId, args) {
  await asserts.validateContractAccountId(contractAccountId);
  asserts.validateFunctionName(functionName);
  await profiler.profileGasCosts(contractAccountId, functionName, blockId || "latest", args);
}

module.exports = { gasBuddy };
