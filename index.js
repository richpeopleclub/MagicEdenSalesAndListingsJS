var MagicEdenListings = (() => {
  const web3 = require("@solana/web3.js");
  const bs58 = require("bs58");
  const EventEmitter = require("events");

  var track = (mints, options) => {
    const eventEmitter = new EventEmitter();

    if (!mints) throw new Error("Mints is required");
    if (!Array.isArray(mints)) {
      if (typeof myVar === "string" || myVar instanceof String) {
        mints = [mints];
      } else {
        throw new Error(
          "Mints must be an array of mint ids or a single mint id"
        );
      }
    }
    if (!options) options = {};
    if (!options.interval) options.interval = -1;
    if (!options.connectUrl)
      options.connectUrl = "https://api.mainnet-beta.solana.com";

    const connection = new web3.Connection(options.connectUrl);

    parser(connection, mints, options.interval, eventEmitter);
    return eventEmitter;
  };

  var TransactionParser = require("./transactionParser.js");
  var parser = async (
    connection,
    mints,
    interval,
    eventEmitter,
    lastHash = ""
  ) => {
    var signatures = await getSignatures(connection, lastHash);

    for (var i = 0; i < signatures.length; i++) {
      var signature = signatures[i];
      var parsed = await TransactionParser(connection, signature);
      if (parsed && mints.includes(parsed.mint)) {
        eventEmitter.emit(parsed.type, parsed);
        if (parsed.type == "list") eventEmitter.emit("listing", parsed);
        if (parsed.type == "buy") eventEmitter.emit("sale", parsed);
        eventEmitter.emit("all", parsed);
      }
    }
    if (signatures.length > 0) {
      lastHash = signatures[0];
    }
    setTimeout(() => {
      parser(connection, mints, interval, eventEmitter, lastHash);
    }, interval * 1000);
  };

  var getSignatures = async (connection, lastHash) => {
    let transactions = await connection.getConfirmedSignaturesForAddress2(
      new web3.PublicKey("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"), // magic eden program
      lastHash == "" ? { limit: 1 } : { until: lastHash }
    );
    var signatures = [];
    for (var i = 0; i < transactions.length; i++) {
      signatures.push(transactions[i].signature);
    }
    return signatures;
  };
  var getMintsFromCandyMachine = async (candyMachineId, connectUrl) => {
    if (!candyMachineId) throw new Error("candyMachineId is required");
    const connection = new web3.Connection(
      connectUrl || "https://api.mainnet-beta.solana.com"
    );
    const metadataAccounts = await connection.getProgramAccounts(
      new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      {
        dataSlice: { offset: 33, length: 32 },

        filters: [
          { dataSize: 679 },
          {
            memcmp: {
              offset: 326,
              bytes: candyMachineId,
            },
          },
        ],
      }
    );

    return metadataAccounts.map((metadataAccountInfo) =>
      bs58.encode(metadataAccountInfo.account.data)
    );
  };
  return {
    track: track,
    getMintsFromCandyMachine: getMintsFromCandyMachine,
  };
})();
module.exports = MagicEdenListings;
