const r = require("./asserts");
const api = require("./api");

// r.checkAccountExistRaw('idea404.testnet');

// r.checkAccountExistRaw("ifdafdadea404.testnet")
//   .then((res) => {
//     const f = JSON.parse(res);
//     console.log(f);
//     if (f["error"] && f["error"]["cause"]["name"] === "UNKNOWN_ACCOUNT") {
//       console.log("Account does not exist");
//       throw new Error("Account does not exist");
//     } else {
//       console.log("Account exists");
//     }
//   })
//   .catch(() => {
//     console.error("error");
//   });

// r.validateContractAccountId("idea4adasa04.testnet");
api.gasBuddy("ideafdsafda404.testnet", "transfer", "latest", {});
// r.accountExists("idedafdsasafd404.testnet");
