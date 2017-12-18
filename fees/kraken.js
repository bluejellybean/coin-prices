'use strict';
//https://www.kraken.com/help/fees
module.exports = {
  getFee: function(makerTaker, monthlyVolume, volumePrice) {
    if( (makerTaker == 'maker' || makerTaker == 'taker') == false ) {
      return 'invalid makerTaker'
    }
    let feeTeir = this.getFeeTeir(monthlyVolume);
    let feePercentage = fees[makerTaker][feeTeir];
    let fee = volumePrice * feePercentage;
    return Math.round(fee * 100) / 100;
  },

  getFeeTeir: function( monthlyVolume ) {
    if (monthlyVolume < 50000) {
      return 0;
    }
    if (monthlyVolume < 100000) {
      return 1;
    }
    if (monthlyVolume < 250000) {
      return 2;
    }
    if (monthlyVolume < 500000) {
      return 3;
    }
    if (monthlyVolume < 1000000) {
      return 4;
    }
    if (monthlyVolume < 2500000) {
      return 5;
    }
    if (monthlyVolume < 5000000) {
      return 6;
    }
    if (monthlyVolume < 10000000) {
      return 7;
    }
    if (monthlyVolume >= 10000000) {
      return 8;
    }
    return -1;
  }
}


// kraken has differing fees but for the coins we care about, it doesn't
let fees = {
  'maker': [
    0.0016,
    0.0014,
    0.0012,
    0.0010,
    0.0008,
    0.0006,
    0.0004,
    0.0002,
    0.0000,
  ],
  'taker': [
    0.0026,
    0.0024,
    0.0022,
    0.0020,
    0.0018,
    0.0016,
    0.0014,
    0.0012,
    0.0010,
  ]
}
