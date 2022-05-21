var MESales = require("../index.js")

var tracker = MESales.track(JSON.parse(require("fs").readFileSync("./mints.json", "utf8")), {
    connectUrl: "https://solana-mainnet.trat.dev/79fbb70b70822e62f4e7b4401638b59a8c7413f4/",
    interval: 5 // 5 seconds between each check
}); 

tracker.on("list", (list) => console.log(list));
tracker.on("sale", (sale) => console.log(sale));
tracker.on("bid", (bid) => console.log(bid));
tracker.on("all", (event) => console.log(event));
