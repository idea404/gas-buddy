function validateArgs(contractAccountId, functionName, blockId, args) {
  validateContractAccountId(contractAccountId);
  validateFunctionName(functionName);
  validateBlockId(blockId);
  validateArgs(args);
}

function validateContractAccountId(contractAccountId) {
  if (!contractAccountId) {
    throw new Error("contract_account_id is not set");
  }
  // TODO
}

function validateFunctionName(functionName) {
  if (!functionName) {
    throw new Error("function_name is not set");
  }
  // TODO
}

function validateBlockId(blockId) {
  // TODO
}

function validateArgs(args) {
  // TODO
}

module.exports = { validateArgs };
