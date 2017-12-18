'use strict';
let assert = require('assert');
let symbol = require('../components/symbol');

describe('symbol', function() {
  describe('createCurrencyPairSymbol', function() {
    it('should return error when given invalid symbols/names', function() {
      let coin = 'unknown coin';
      let altCoin = 'Bitcoin';
      let testError = 'Invalid currency';
      let symbolCurrencyPair = symbol.createCurrencyPairSymbol(coin, altCoin);
      assert.equal(testError, symbolCurrencyPair);
    });
    it('should return error when given invalid symbols/names', function() {
      let coin = 'unknown coin';
      let altCoin = '';
      let testError = 'Invalid currency';
      let symbolCurrencyPair = symbol.createCurrencyPairSymbol(coin, altCoin);
      assert.equal(testError, symbolCurrencyPair);
    });
    it('should return correct pair symbol when given names', function() {
      let coin = 'bitcoin';
      let altCoin = 'ethereum';
      let symbolCurrencyPair = symbol.createCurrencyPairSymbol(coin, altCoin);
      assert.equal('BTC/ETH', symbolCurrencyPair);
    });
    it('should return correct pair symbol when given names', function() {
      let coin = 'Bitcoin';
      let altCoin = 'ethereum';
      let symbolCurrencyPair = symbol.createCurrencyPairSymbol(coin, altCoin);
      assert.equal('BTC/ETH', symbolCurrencyPair);
    });
  }),
  describe('getSymbolFromCoinName', function() {
    it('should return error when given invalid coinName', function() {
      let coinName = 'unknown coin';
      let testError = 'Invalid currency';
      let gotSymbol = symbol.getSymbolFromCoinName(coinName);
      assert.equal(testError, gotSymbol);
    });
    it('should return symbol when given invalid coinName', function() {
      let coinName = 'BitCoin';
      let testData = 'BTC';
      let gotSymbol = symbol.getSymbolFromCoinName(coinName);
      assert.equal(testData, gotSymbol);
    });
  }),
  describe('getCoinNameFromSymbol', function() {
    it('should return error when given invalid symbols/names', function() {
      let symbolToCheck = 'invalid symbol';
      let testError = 'Invalid currency';
      let coinName = symbol.getCoinNameFromSymbol(symbolToCheck);
      assert.equal(testError, coinName);
    });
    it('should return error when given invalid symbols/names', function() {
      let symbolToCheck = 'btc';
      let testData = 'bitcoin';
      let coinName = symbol.getCoinNameFromSymbol(symbolToCheck);
      assert.equal(testData, coinName);
    });
  });
  describe('getCurrencyNameFromPair', function() {
    it('should return error when given invalid symbols/names', function() {
      let pairSymbol = 'BTC/eee';
      let testError = 'Invalid currency';
      let coinName = symbol.getCurrencyNameFromPair(pairSymbol);
      assert.equal(testError, coinName);
    });
    it('should return error when given invalid symbols/names', function() {
      let pairSymbol = 'BTC/123';
      let testError = 'Invalid currency';
      let coinName = symbol.getCurrencyNameFromPair(pairSymbol);
      assert.equal(testError, coinName);
    });
    it('should return coin name array when given valid symbol pair', function() {
      let symbolToCheck = 'btc/eth';
      let testData = ['bitcoin', 'ethereum'];
      let coinName = symbol.getCurrencyNameFromPair(symbolToCheck);
      assert.deepEqual(testData, coinName);
    });
  });
});
