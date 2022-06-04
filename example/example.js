var MESales = require("../index")

var tracker = MESales.track(JSON.parse(require("fs").readFileSync("./mints.json", "utf8")), {
    connectUrl: "", // your api endpoint
    interval: 5 // 5 seconds between each check
}); 

tracker.on("list", (list) => console.log(list));
tracker.on("sale", (sale) => console.log(sale));
tracker.on("bid", (bid) => console.log(bid));
tracker.on("all", (event) => console.log(event));
