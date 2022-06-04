var transactionParser = async function (connection, signature) {
  var parsers = [
    parseCancelListOnMagicEden,
    parseBuyOnMagicEdenV2,
    parseListOnMagicEdenV1,
    parseListOnMagicEdenV2,
    parseBidOnMagicEdenv2,
    parseCancelBidMagicEdenv2,
    parseBidOnMagicEdenv2_2,
  ];

  var transaction = await connection.getConfirmedTransaction(signature);
  if (transaction == null) return null;
  if (!transaction.meta) return null;
  if (transaction.meta.err != null) return null;

  var info = null;
  for (var parser in parsers) {
    info = parsers[parser](transaction, signature);
    if (info != null) {
      break;
    }
  }
  return info;
};

function parseCancelBidMagicEdenv2(transaction, signature) {
  try {
    if (!transaction.meta.logMessages.length == 4) {
      return null;
    }
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (
      !(
        transaction.meta.logMessages[1] == "Program log: Instruction: CancelBuy"
      )
    ) {
      return null;
    }

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }

    var bidderPub = transaction.transaction.instructions[0].keys[0];

    var mint = transaction.transaction.instructions[0].keys[2];

    var returned = {
      type: "cancelBid",
      name: "Cancel Bid",
      marketplace: "Magic Eden",
      data: {
        bidder: bidderPub.pubkey.toBase58(),
        extras: "v2",
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}

function parseBidOnMagicEdenv2_2(transaction, signature) {
  try {
    if (!(transaction.meta.logMessages.length == 5)) {
      return null;
    }
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (!(transaction.meta.logMessages[1] == "Program log: Instruction: Buy")) {
      return null;
    }

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }

    var bidderPub = transaction.transaction.instructions[0].keys[0];

    var mint = transaction.transaction.instructions[0].keys[2];
    var priceLamports = JSON.parse(
      transaction.meta.logMessages[2].replace("Program log: ", "")
    ).price;

    var returned = {
      type: "bid",
      name: "Bid",
      marketplace: "Magic Eden",
      data: {
        bidder: bidderPub.pubkey.toBase58(),
        price: priceLamports,
        extras: "v2 type 2",
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}
function parseBidOnMagicEdenv2(transaction, signature) {
  try {
    if (!(transaction.meta.logMessages.length == 7)) {
      return null;
    }
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (!(transaction.meta.logMessages[1] == "Program log: Instruction: Buy")) {
      return null;
    }

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }

    var bidderPub = transaction.transaction.instructions[0].keys[0];

    var mint = transaction.transaction.instructions[0].keys[2];
    var priceLamports = JSON.parse(
      transaction.meta.logMessages[4].replace("Program log: ", "")
    ).price;

    var returned = {
      type: "bid",
      name: "Bid",
      marketplace: "Magic Eden",
      data: {
        bidder: bidderPub.pubkey.toBase58(),
        price: priceLamports,
        extras: "v2",
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}

function parseListOnMagicEdenV1(transaction, signature) {
  try {
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (
      !(transaction.meta.logMessages[1] == "Program log: Instruction: Sell")
    ) {
      return null;
    }
    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }
    if (!(transaction.meta.logMessages.length == 11)) {
      return null;
    }

    var sellerPub = transaction.transaction.instructions[0].keys[0];
    var mint = transaction.transaction.instructions[0].keys[4];
    var priceLamports = JSON.parse(
      transaction.meta.logMessages[8].replace("Program log: ", "")
    ).price;
    var returned = {
      type: "list",
      name: "List",
      marketplace: "Magic Eden",
      data: {
        seller: sellerPub.pubkey.toBase58(),
        price: priceLamports,
        extras: "v1",
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}
function parseListOnMagicEdenV2(transaction, signature) {
  try {
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    )
      return null;
    if (!(transaction.meta.logMessages[1] == "Program log: Instruction: Sell"))
      return null;

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    )
      return null;
    if (!(transaction.meta.logMessages.length == 5)) return null;

    var sellerPub = transaction.transaction.instructions[0].keys[0];
    var mint = transaction.transaction.instructions[0].keys[4];
    var priceLamports = JSON.parse(
      transaction.meta.logMessages[2].replace("Program log: ", "")
    ).price;
    var returned = {
      type: "list",
      name: "List",
      marketplace: "Magic Eden",
      data: {
        seller: sellerPub.pubkey.toBase58(),
        extras: "v2",
        price: priceLamports,
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}

function parseCancelListOnMagicEden(transaction, signature) {
  try {
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (
      !(
        transaction.meta.logMessages[1] ==
        "Program log: Instruction: CancelSell"
      )
    ) {
      return null;
    }

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }
    var sellerPub = transaction.transaction.instructions[0].keys[0];
    var mint = transaction.transaction.instructions[0].keys[3];
    var returned = {
      type: "cancelList",
      name: "Cancel Listing",
      marketplace: "Magic Eden",
      data: {
        seller: sellerPub.pubkey.toBase58(),
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}

function parseBuyOnMagicEdenV2(transaction, signature) {
  try {
    if (
      !transaction.meta.logMessages[0] ==
      "Program M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K invoke [1]"
    ) {
      return null;
    }
    if (
      !(
        transaction.meta.logMessages[14] ==
        "Program log: Instruction: ExecuteSale"
      )
    ) {
      return null;
    }

    if (
      !transaction.transaction.instructions[0].programId.toBase58() ==
      "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
    ) {
      return null;
    }

    var sellerPub = transaction.transaction.instructions[2].keys[1];
    var buyerPub = transaction.transaction.instructions[2].keys[0];

    var mint = transaction.transaction.instructions[2].keys[4];
    var priceLamports = JSON.parse(
      transaction.meta.logMessages[10].replace("Program log: ", "")
    ).price;

    var returned = {
      type: "buy",
      name: "buy",
      marketplace: "Magic Eden",
      data: {
        seller: sellerPub.pubkey.toBase58(),
        buyer: buyerPub.pubkey.toBase58(),
        extras: "v2",
        price: priceLamports,
      },
      mint: mint.pubkey.toBase58(),
      time: transaction.blockTime * 1000,
      signature: signature,
    };
    return returned;
  } catch (e) {
    //console.log(signature)
    return null;
  }
}

module.exports = transactionParser;
