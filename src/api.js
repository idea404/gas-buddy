const asserts = require("./asserts");
const profiler = require("./profiler");

async function gasBuddy(contractAccountId, functionName, blockId, args) {
  await asserts.validateContractAccountId(contractAccountId);
  // await profiler.profileGasCosts(contractAccountId, functionName, blockId || "latest", args);
}

module.exports = { gasBuddy };
