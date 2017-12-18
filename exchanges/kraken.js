const https = require('https');
let symbol = require('../components/symbol');
let kraken_fees = require('../fees/kraken');
let backupData = require('../backupData/kraken');

module.exports = {
  convertSymbolToKraken: function(singleSingle) {
    let symbolConversions = {
      "BTC": "XBT",
      "ETH": "XETHX",
      "LTC": "XLTCX",
      "DASH": "DASH",
    };
    if (symbolConversions[singleSingle] != undefined) {
      return symbolConversions[singleSingle];
    }
    return 'Invalid currency';
  },
  fetchPairData: function(pairSymbol) {
    return new Promise(( resolve, rejected ) => {
      krakenSymbolPair = this.formatPairSymbol(pairSymbol);
      let pairLink = 'https://api.kraken.com/0/public/Ticker?pair=' + krakenSymbolPair;
      https.get(pairLink, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          try {
            let prom;
            if(process.env.NODE_ENV==='offline'){
              prom = this.formatPairData(backupData[krakenSymbolPair], pairSymbol, krakenSymbolPair);
            } else {
              prom = this.formatPairData(JSON.parse(data), pairSymbol, krakenSymbolPair);
            }
            prom
            .then(( resolvedData ) => {
              resolve(resolvedData);
            }).catch(( rejected ) => {
              reject('Kraken Fetch Error:', rejected);
            });
          } catch (e) {
            reject('Kraken Fetch Error: can not parse json data');
          }
        });

      }).on('error', (e) => {
        if(process.env.NODE_ENV==='offline'){
          this.formatPairData(backupData[krakenSymbolPair], pairSymbol, krakenSymbolPair)
          .then(( resolvedData ) => {
            resolve(resolvedData);
          }).catch(( rejected ) => {
            reject('Kraken Fetch Error:', rejected);
          })
        } else {
          console.log("Error: " + e.message);
        }
      });
    });
  },
  fetchKrakenPairData: function(krakenSymbolPair) {
    return new Promise(( resolve, rejected ) => {
      let pairLink = 'https://api.kraken.com/0/public/Ticker?pair=' + krakenSymbolPair;
      https.get(pairLink, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          try {
            if(process.env.NODE_ENV==='offline'){
              resolve(backupData[krakenSymbolPair]);
            } else {
              resolve(JSON.parse(data));
            }
          } catch (e) {
            reject('Kraken Fetch Error: can not parse json data');
          }
        });

      }).on('error', function(e) {
        if(process.env.NODE_ENV==='offline'){
          resolve(backupData[krakenSymbolPair]);
        } else {
          console.log("Error: " + err.message);
        }
      });
    });
  },
  formatPairSymbol: function(pairSymbol) {
    let pairs = symbol.getCurrencyNameFromPair(pairSymbol)
    pairs[0] = symbol.getSymbolFromCoinName(pairs[0]);
    pairs[1] = symbol.getSymbolFromCoinName(pairs[1]);

    pairs[0] = this.convertSymbolToKraken(pairs[0])
    pairs[1] = this.convertSymbolToKraken(pairs[1]);

    if( pairs[0] != 'Invalid currency' && pairs[1] != 'Invalid currency'){
      // Need to swap pair symbol for kraken
      return pairs[1] + pairs[0];
    }
  },
  fetchUSDToSymbol: function(symbol) {
    return new Promise(( resolve, rejected ) => {
      let pairSymbols = {
        'BTC': 'XXBTZUSD',
        'ETH': 'XETHZUSD',
        'LTC': 'XLTCZUSD',
        'DASH': 'DASHUSD'
      }
      let pairSymbol = pairSymbols[symbol];

      this.fetchKrakenPairData(pairSymbol)
      .then(( pairData ) => {

        if( (pairData.error.length == 0) && pairData['result'][pairSymbol] != undefined ) {
          resolve(pairData['result'][pairSymbol]['c'][0]);
        } else {
          return 0;
        }
      }).catch(( rejected ) => {
        console.log('rejected', rejected)
      });
    });
  },
  formatPairData: function(pairData, pairSymbol, krakenSymbolPair) {
    return new Promise(( resolve, rejected ) => {

      if( pairData.error.length >= 1 ) {
        return formatted = {
          exchange: 'kraken',
          errors: pairData.error
        }
      }
      let baseCurrency = symbol.getCurrencyNameFromPair(pairSymbol)[1];
      let quoteCurrency = symbol.getCurrencyNameFromPair(pairSymbol)[0];

      let splitSymbol = pairSymbol.split('/');
      let baseInUSD;
      let quoteInUSD;
      Promise.all([
        this.fetchUSDToSymbol(splitSymbol[0]),
        this.fetchUSDToSymbol(splitSymbol[1])
      ]).then((resolved) => {
        baseInUSD = resolved[0];
        quoteInUSD = resolved[1];
        for (let fetchedSymbol of Object.keys(pairData['result'])) {
          if( krakenSymbolPair == fetchedSymbol) {
            let formatted = {
              exchange: 'kraken',
              symbol: krakenSymbolPair,
              baseCurrency: quoteCurrency,
              quoteCurrency: baseCurrency,
              baseInUSD: baseInUSD,
              quoteInUSD: quoteInUSD,
              bid: pairData['result'][fetchedSymbol].a[0],
              ask: pairData['result'][fetchedSymbol].b[0],
              high: pairData['result'][fetchedSymbol].h[0],
              low: pairData['result'][fetchedSymbol].l[0],
              open: pairData['result'][fetchedSymbol].o,
              change: '',
              time: Math.round(+new Date()/1000)
            }
            resolve(formatted);
          }
        }
      }).catch(( rejected ) => {
        reject( rejected );
      });
    });
  }
};
// a = ask array(<price>, <whole lot volume>, <lot volume>),
// b = bid array(<price>, <whole lot volume>, <lot volume>),
// c = last trade closed array(<price>, <lot volume>),
// v = volume array(<today>, <last 24 hours>),
// p = volume weighted average price array(<today>, <last 24 hours>),
// t = number of trades array(<today>, <last 24 hours>),
// l = low array(<today>, <last 24 hours>),
// h = high array(<today>, <last 24 hours>),
// o = today's opening price


// URL: https://api.kraken.com/0/public/Time
// URL: https://api.kraken.com/0/public/Assets
// URL: https://api.kraken.com/0/public/AssetPairs
// URL: https://api.kraken.com/0/public/Ticker
// URL: https://api.kraken.com/0/public/OHLC
// URL: https://api.kraken.com/0/public/Depth
// URL: https://api.kraken.com/0/public/Trades
// URL: https://api.kraken.com/0/public/Spread
