const https = require('https');
let symbol = require('../components/symbol');

let backupData = require('../backupData/poloniex');

module.exports = {
  fetchPairData: function(pairSymbol) {
    return new Promise(( resolve, reject ) => {

      let url = 'https://poloniex.com/public?command=returnTicker';
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          if(process.env.NODE_ENV==='offline'){
            resolve(this.formatPairData(backupData, pairSymbol));
          } else {
            resolve(this.formatPairData(JSON.parse(data), pairSymbol));
          }
        });
      }).on("error", (err) => {
        if(process.env.NODE_ENV==='offline'){
          resolve(module.exports.formatPairData(backupData, pairSymbol));
        } else {
          reject("Error: " + err.message);
        }
      });
    });
  },
  fetchUSDToSymbol: function(pairData, symbol) {
    let pairSymbol = 'USDT_' + symbol;
  //  console.log('THIS PAIR:',pairData[pairSymbol]);
    if( pairData[pairSymbol] != undefined ) {
      return pairData[pairSymbol].last
    }
  },
  formatPairData: function(pairData, pairSymbol) {

    let formattedPairSymbol = this.formatPairSymbol(pairSymbol);

    let baseCurrency = symbol.getCurrencyNameFromPair(pairSymbol)[0];
    let quoteCurrency = symbol.getCurrencyNameFromPair(pairSymbol)[1];

    let splitSymbol = formattedPairSymbol.split('_');

    let baseInUSD = this.fetchUSDToSymbol(pairData, splitSymbol[0]);
    let quoteInUSD = this.fetchUSDToSymbol(pairData, splitSymbol[1]);

    // console.log('baseToUSD', baseInUSD);
    // console.log('quoteToUSD', quoteInUSD);

    let formatted = {
      exchange: 'poloniex',
      symbol: formattedPairSymbol,
      baseCurrency: baseCurrency,
      quoteCurrency: quoteCurrency,
      baseInUSD: baseInUSD,
      quoteInUSD: quoteInUSD,
      bid: pairData[formattedPairSymbol].highestBid,
      ask: pairData[formattedPairSymbol].lowestAsk,
      high: pairData[formattedPairSymbol].high24hr,
      low: pairData[formattedPairSymbol].low24hr,
      open: '',
      change: pairData[formattedPairSymbol].percentChange,
      time: Math.round(+new Date()/1000)
    }

    return formatted;
  },
  // custom formatter for poloniex data
  formatPairSymbol: function(pairSymbol) {
    pairSymbol = pairSymbol.replace('/', '_');
    return pairSymbol
  },
};
// https://poloniex.com/public?command=returnTicker&currency=BTC_LTC
// https://poloniex.com/public?command=return24hVolume
// https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_NXT&depth=10
// https://poloniex.com/public?command=returnTradeHistory&currencyPair=BTC_NXT&start=1410158341&end=1410499372
// https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1405699200&end=9999999999&period=14400
// https://poloniex.com/public?command=returnCurrencies
// https://poloniex.com/public?command=returnLoanOrders&currency=BTC

// { id: 7,
// last: '0.00000018',
// lowestAsk: '0.00000019',
// highestBid: '0.00000018',
// percentChange: '-0.05263157',
// baseVolume: '77.77664067',
// quoteVolume: '410961182.08407509',
// isFrozen: '0',
// high24hr: '0.00000021',
// low24hr: '0.00000017' }
