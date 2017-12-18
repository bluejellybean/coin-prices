'use strict';
//https://poloniex.com/fees/
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
    if (monthlyVolume < 600) {
      return 0;
    }
    if (monthlyVolume >= 600) {
      return 1;
    }
    if (monthlyVolume >= 1200) {
      return 2;
    }
    if (monthlyVolume >= 2400) {
      return 3;
    }
    if (monthlyVolume >= 6000) {
      return 4;
    }
    if (monthlyVolume >= 12000) {
      return 5;
    }
    if (monthlyVolume >= 18000) {
      return 6;
    }
    if (monthlyVolume >= 24000) {
      return 7;
    }
    if (monthlyVolume >= 60000) {
      return 8;
    }
    if (monthlyVolume >= 120000) {
      return 9;
    }
    return -1;
  }
}

let fees = {
  'maker':[
    .0015,
    .0014,
    .0012,
    .0010,
    .0008,
    .0005,
    .0002,
    .0000,
    .0000,
    .0000,
  ],
  'taker': [
    .0025,
    .0024,
    .0022,
    .0020,
    .0016,
    .0014,
    .0012,
    .0010,
    .0008,
    .0005
  ]
}
