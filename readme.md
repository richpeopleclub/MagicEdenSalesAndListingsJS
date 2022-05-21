# MagicEden Sales & Listings

MagicEden Sales & Listings is an nodejs library that allows you to capture NFT Listings, Sales, Bids, and more as they happen!

IMPORTANT: 
It is recommended to use a custom RPC url for this, if you don't, you will most likely get banned from the public ones within a minute of running this script. 

## Installation

Using the NPM package manager

```bash
npm i magicedensales
```

## Usage

Track the specific sales of a certain nft Mint
```javascript
var MESales = require("magicedensales");
var tracker = MESales.track("zGz1NfxMFqZV6W1HR4NNoNr9Q7jbqrQKQch2LFSFejf"); // first parameter is mint to track

tracker.on("list", (list) => console.log(list));
tracker.on("sale", (sale) => console.log(sale));
tracker.on("bid", (bid) => console.log(bid));
tracker.on("all", (event) => console.log(event));
```
Track the events of an array of mints
```javascript
var tracker = MESales.track(["zGz1NfxMFqZV6W1HR4NNoNr9Q7jbqrQKQch2LFSFejf", "zGz1NfxMFqZV6W1HR4NNoNr9Q7jbqrQKQch2LFSFejf"]); // array of mints to track
```

Tracking options 
```javascript
var tracker = MESales.track("zGz1NfxMFqZV6W1HR4NNoNr9Q7jbqrQKQch2LFSFejf",
{
    interval: 5, // interval in seconds to request new magic eden transactions
    connectUrl: "CUSTOM-RPC-URL" // your custom RPC url 
}); 
```

### Get All Mints From Creator / CandyMachine

Ive added a utility to get all of the nft mints from a certain candy machine (nft drop) which is also creator #0 on most NFTs. Its recommended you only use this once and save it to a file as it usually takes quite a bit to run. 

```javascript
var MESales = require("magicedensales");
var mints = await MESales.getMintsFromCandyMachine("8RMqBV79p8sb51nMaKMWR94XKjUvD2kuUSAkpEJTmxyx", OPTIONAL-CUSTOM-RPC-URL)
```

#### Finding the candy machine ID: 

Finding the candy machine ID is fairly simple. navigate to one of the nfts in the collection you want to track on [https://explorer.solana.com](https://explorer.solana.com) and click creators, it will be the first one with a royalty of 0%. 

![Example](https://i.imgur.com/dy2xDQm.png)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)



A bunch of people asked me to do this for and I needed it for some projects so why not make it public

By Ryan Trattner [https://github.com/RTISCOOL](https://github.com/RTISCOOL)
