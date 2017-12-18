'use strict';
let assert = require('assert');
let exchangeFees = require('../fees/exchangeFees');
let kraken_fees = require('../fees/kraken');
let poloniex_fees = require('../fees/poloniex');

describe('kraken fees', function() {
  describe('exchangeFees', function() {
    it('should get poloniex fee amount', function() {
      let pairSymbol = 'LTCXBT';
      let exchange = 'poloniex'
      let monthlyVolume = 30000;
      let makerTaker = 'maker';
      let volume = 5;
      let price = 102;
      let fee = exchangeFees.getFee(exchange, volume, price, makerTaker, monthlyVolume);
      assert.equal(.71, fee);
    });
    it('should get invalid makerTaker', function() {
      let pairSymbol = 'LTCXBT';
      let exchange = 'poloniex'
      let monthlyVolume = 30000;
      let makerTaker = 'foo';
      let volume = 5;
      let price = 102;
      let fee = exchangeFees.getFee(exchange, volume, price, makerTaker, monthlyVolume);
      assert.equal('invalid makerTaker', fee);
    });
  }),
  describe('getFeeTeir', function() {
    it('should get first fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 25000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(0, feeTeir);
    }),
    it('should get second fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 55000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(1, feeTeir);
    }),
    it('should get third fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 245000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(2, feeTeir);
    }),
    it('should get fourth fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 400000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(3, feeTeir);
    }),
    it('should get fith fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 999999;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(4, feeTeir);
    }),
    it('should get sixth fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 2400000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(5, feeTeir);
    }),
    it('should get seventh fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 4000000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(6, feeTeir);
    }),
    it('should get eigth fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 9000000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(7, feeTeir);
    }),
    it('should get ninth fee teir', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 10000000;
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(8, feeTeir);
    }),
    it('should throw error when bad volume given', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 'foo';
      let feeTeir = kraken_fees.getFeeTeir(monthlyVolume);

      assert.equal(-1, feeTeir);
    });
  }),
  describe('getFee', function() {
    it('should get fee amount', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 30000;
      let makerTaker = 'maker';
      let volume = 5;
      let price = 100;
      let volumePrice = volume * price;

      let fee = kraken_fees.getFee(makerTaker, monthlyVolume, volumePrice);

      assert.equal(.80, fee);
    });
    it('should get fee amount', function() {
      let pairSymbol = 'LTCXBT';

      let monthlyVolume = 30000;
      let makerTaker = 'maker';
      let volume = 5;
      let price = 102;
      let volumePrice = volume * price;
      let fee = kraken_fees.getFee(makerTaker, monthlyVolume, volumePrice);
      assert.equal(.82, fee);
    });

    it('should get fee amount', function() {
      let monthlyVolume = 90000;
      let makerTaker = 'maker';
      let price = 102;
      let volume = 5;
      let volumePrice = volume * price;
      let fee = kraken_fees.getFee(makerTaker, monthlyVolume, volumePrice);
      assert.equal(.71, fee);
    });
    it('should get invalid amount', function() {
      let monthlyVolume = 90000;
      let makerTaker = 'masker';
      let volume = 5;
      let price = 102;
      let volumePrice = volume * price;
      let fee = kraken_fees.getFee(makerTaker, monthlyVolume, volumePrice);
      assert.equal('invalid makerTaker', fee);
    });
  });
});
