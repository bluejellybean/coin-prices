'use strict';
// Act as this programs symbol source
// Do this to avoid 3rd-party API differences

let coinSymbols = {
  'bitcoin' : 'BTC',
  'ethereum': 'ETH',
  'litecoin': 'LTC',
  'dash'    : 'DASH'
}

module.exports = {
  createCurrencyPairSymbol: function(baseCurrency, quoteCurrency) {
    baseCurrency = baseCurrency.toLowerCase();
    quoteCurrency = quoteCurrency.toLowerCase();
    if(coinSymbols[baseCurrency] && coinSymbols[quoteCurrency]) {
      let pairSymbol = coinSymbols[baseCurrency] + '/' + coinSymbols[quoteCurrency];
      return pairSymbol;
    }
    return 'Invalid currency';
  },
  getCurrencyNameFromPair: function(pairSymbol){
    pairSymbol = pairSymbol.split('/');
    let baseCoinName = this.getCoinNameFromSymbol(pairSymbol[0]);
    let quoteCoinName = this.getCoinNameFromSymbol(pairSymbol[1]);

    if(baseCoinName != 'Invalid currency' && quoteCoinName != 'Invalid currency') {
      return [baseCoinName, quoteCoinName]
    }
    return 'Invalid currency';
  },
  getSymbolFromCoinName: function(coinName) {
    coinName = coinName.toLowerCase();
    if(coinSymbols[coinName]) {
      return coinSymbols[coinName];
    }
    return 'Invalid currency';
  },
  getCoinNameFromSymbol: function(symbol) {
    try {
      symbol = symbol.toUpperCase();
    } catch (e) {
      return 'Invalid currency';
    }
    for (var i = 0; i < Object.keys(coinSymbols).length; i++) {
      let key = Object.keys(coinSymbols)[i];
      if(coinSymbols[key] == symbol) {
        return key;
      }
    }
    return 'Invalid currency';
  }
}
