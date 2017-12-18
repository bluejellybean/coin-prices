'use strict';
// coin-cap uses shapeshift API
// https://info.shapeshift.io/about

module.exports = {
  getFee: function() {
      // fees should only be miner transaction fee
      return 0
  }
}
