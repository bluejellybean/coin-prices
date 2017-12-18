const coinCap = require('./exchanges/coincap');
const kraken = require('./exchanges/kraken');
const poloniex = require('./exchanges/poloniex');
const exchangeFees = require('./fees/exchangeFees');

const symbol = require('./components/symbol');
if(process.env.NODE_ENV==='offline'){
  console.log('offline-mode')
}
exports.determineCheapestExchangePair = function( marketData, makerTaker,
                                                  tradeVolume, monthlyVolume ) {
  let bestCoinsReceived = 0;
  let bestExchange;
  let coinsReceived;

  for (let exchange of Object.keys(marketData)) {
    if(marketData[exchange] != undefined){
      let volumePrice = tradeVolume * marketData[exchange].baseInUSD;
      let fee = exchangeFees.getFee(exchange,
                                    tradeVolume,
                                    marketData[exchange].baseInUSD,
                                    makerTaker,
                                    monthlyVolume);

      coinsReceived = (volumePrice - fee) / marketData[exchange].quoteInUSD;

      if(coinsReceived > bestCoinsReceived || bestCoinsReceived == 0) {
        console.log('New best exchange:', exchange, coinsReceived);
        bestCoinsReceived = coinsReceived;
        bestExchange = exchange;
      }
    } else {
      console.log('Exchange is undefined:', exchange);
    }
  }
  console.log('Best Exchange:', bestExchange);
  console.log('Coins Received:', bestCoinsReceived + '\n');
  return bestExchange;
}

exports.fetchLatestMarkestData = function( pairSymbol ) {
  return new Promise(( resolve, reject ) => {
    let marketData = {};
    Promise.all([
      coinCap.fetchPairData(pairSymbol),
      kraken.fetchPairData(pairSymbol),
      poloniex.fetchPairData(pairSymbol)
    ]).then((resolved) => {
      marketData['coinCap'] = resolved[0];
      marketData['kraken'] = resolved[1];
      marketData['poloniex'] = resolved[2];
      resolve (marketData);
    }).catch(( rejected ) => {
      console.log('rejected:', rejected);
    });
  });
}


let tradeSize = 5; // 5 bitcoins for example
let monthlyVolume = 0; // trust fund, not active trader

let btcToethereum = symbol.createCurrencyPairSymbol('bitcoin', 'ethereum');
let btcTolitecoin = symbol.createCurrencyPairSymbol('bitcoin', 'litecoin');
let btcTodash = symbol.createCurrencyPairSymbol('bitcoin', 'dash');

setTimeout(function() {
  exports.fetchLatestMarkestData(btcToethereum)
  .then(( marketData ) => {
    console.log('--- (' + tradeSize + ') btc -> eth ---');
    exports.determineCheapestExchangePair(marketData, 'maker', tradeSize, monthlyVolume);
  }).catch(( rejected ) => {
    console.log('rejected', rejected);
  });
}, 1);

setTimeout(function() {
  exports.fetchLatestMarkestData(btcTolitecoin)
  .then(( marketData ) => {
    console.log('--- (' + tradeSize + ') btc -> ltc ---');
    exports.determineCheapestExchangePair(marketData, 'maker', tradeSize, monthlyVolume);
  }).catch(( rejected ) => {
    console.log('rejected', rejected);
  });
}, 5000);

setTimeout(function() {
  exports.fetchLatestMarkestData(btcTodash)
  .then(( marketData ) => {
    console.log('--- (' + tradeSize + ') btc -> dash ---');
    exports.determineCheapestExchangePair(marketData, 'maker', tradeSize, monthlyVolume);
  }).catch(( rejected ) => {
    console.log('rejected', rejected);
  });
}, 10000);
