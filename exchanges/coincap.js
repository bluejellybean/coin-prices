const https = require('https');
let symbol = require('../components/symbol');
let backupData = require('../backupData/coinCap');

module.exports = {
  fetchPairData: function(pairSymbol) {
    return new Promise(( resolve, reject ) => {
      pairs = symbol.getCurrencyNameFromPair(pairSymbol);
      Promise.all([
        this.fetchSymbolData(pairs[0]),
        this.fetchSymbolData(pairs[1])
      ]).then(( resolved ) => {
        let pairsData = this.formatPairData(resolved[0], resolved[1], pairSymbol);
        resolve(pairsData);
      }).catch(( rejected ) => {
        reject( rejected );
      });
    });
  },
  fetchSymbolData: function(singleSymbol) {
    return new Promise(( resolve, reject ) => {
      singleSymbol = this.symbolToCoin(singleSymbol);
      let url = 'https://coincap.io/page/' + singleSymbol;
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          if(process.env.NODE_ENV==='offline'){
            resolve(backupData[singleSymbol]);
          } else {
            resolve(JSON.parse(data));
          }
        });
      }).on("error", (err) => {
        if(process.env.NODE_ENV==='offline'){
          resolve(backupData[singleSymbol]);
        } else {
          reject("Error: " + err.message);
        }
      });
    });
  },
  formatPairData: function(baseData, quoteData, pairSymbol) {
    let baseInUSD = baseData['price_usd'];
    let quoteInUSD = quoteData['price_usd'];

    let fakeAsk = quoteInUSD / baseInUSD;
    let formatted = {
      exchange: 'coincap',
      symbol: pairSymbol,
      baseCurrency: symbol.getCurrencyNameFromPair(pairSymbol)[0],
      quoteCurrency: symbol.getCurrencyNameFromPair(pairSymbol)[1],
      baseInUSD: baseInUSD,
      quoteInUSD: quoteInUSD,
      bid: 'undefined',
      ask: fakeAsk,
      high: 'undefined',
      low: 'undefined',
      open: 'undefined',
      change: 'undefined',
      time: Math.round(+new Date()/1000)
    }
    return formatted;
  },
  formatPairSymbol: function(symbol) {
    symbol = symbol.replace('/', '_');
    return symbol
  },
  splitPairSymbol: function(pairSymbol) {
    var symbols = pairSymbol.split('/');
    return symbols;
  },
  symbolToCoin: function(coinName) {
    let coins = {
      'dash': 'DASH',
      'litecoin': 'LTC',
      'bitcoin': 'BTC',
      'ethereum': 'ETH'
    }
    let coin = coins[coinName];
    return coin;
  }
};
