'use strict';
const coinCap_fees = require('./coincap');
const kraken_fees = require('./kraken');
const poloniex_fees = require('./poloniex');

module.exports = {
  getFee: function(exchange, tradeVolume, basePrice, makerTaker, monthlyVolume) {
    let volumePrice = (basePrice * tradeVolume);
    switch (exchange) {
      case 'coinCap':
        return coinCap_fees.getFee();
        break;
      case 'kraken':
        return kraken_fees.getFee(makerTaker, monthlyVolume, volumePrice);
        break;
      case 'poloniex':
        return poloniex_fees.getFee(makerTaker, monthlyVolume, volumePrice);
        break;
      default:
        return 0;
    }
  }
}
