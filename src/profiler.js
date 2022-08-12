import { Worker, NEAR } from "near-workspaces"

const DEFAULT_CONTRACT_INIT_BALANCE = NEAR.parse('1000 N').toJSON();
const DEFAULT_OPTIONS = {
    gas: "1000000",
    attached_deposit: "0",
}

// function for profiling
export async function profileGasCosts(contractAccountId, functionName, argsObject, blockId) {
  const worker = await Worker.init();
  const root = worker.rootAccount;

  const contract = await root.importContract({
    mainnetContract: contractAccountId,
    blockId: blockId,
    withData: true,
    initialBalance: DEFAULT_CONTRACT_INIT_BALANCE,
  });

  // TODO: handle data > 50KB

  // const contract = await root.devDeploy(wasmFileLocation, { initialBalance: NEAR.parse("100 N").toJSON() });
  const alice = await root.createSubAccount("alice", { initialBalance: NEAR.parse("100 N").toJSON() });

  // TODO: pass parameters and account details
  await alice.callRaw(contract, functionName, argsObject, DEFAULT_OPTIONS);

  // Finally stop the sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to tear down the worker:", error);
  });
}
