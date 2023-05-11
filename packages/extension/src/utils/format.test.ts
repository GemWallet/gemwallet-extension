import { xrpToDrops } from 'xrpl';

import { formatAmount, formatToken } from './format';

describe('Format util', () => {
  describe('formatAmount', () => {
    test('should return 1,234,567 XRP', () => {
      const amount = xrpToDrops(1234567);
      expect(formatAmount(amount)).toEqual('1,234,567 XRP');
    });

    test('should return 1,234,567.8977 XRP', () => {
      const amount = xrpToDrops(1234567.8977);
      expect(formatAmount(amount)).toEqual('1,234,567.8977 XRP');
    });

    test('should return 1,234,567.8977 USD', () => {
      const amount = {
        value: '1234567.8977',
        currency: 'USD',
        issuer: 'fake'
      };
      expect(formatAmount(amount)).toEqual('1,234,567.8977 USD');
    });
  });

  describe('formatToken', () => {
    test('should return 1,234,567 XRP', () => {
      const value = 1234567;
      const currency = 'XRP';
      const isDrops = false;
      expect(formatToken(value, currency, isDrops)).toEqual('1,234,567 XRP');
    });

    test('should return 1.234567 XRP', () => {
      const value = 1234567;
      const currency = 'XRP';
      const isDrops = true;
      expect(formatToken(value, currency, isDrops)).toEqual('1.234567 XRP');
    });

    test('should return 1,234,567.8977 XRP', () => {
      const value = 1234567.8977;
      const currency = 'XRP';
      const isDrops = false;
      expect(formatToken(value, currency, isDrops)).toEqual('1,234,567.8977 XRP');
    });

    test('should return 1.2345678977 XRP', () => {
      const value = 1234567.8977;
      const currency = 'XRP';
      const isDrops = true;
      expect(formatToken(value, currency, isDrops)).toEqual('1.2345678977 XRP');
    });

    test('should return 1,234,567.8977 USD', () => {
      const value = 1234567.8977;
      const currency = 'USD';
      const isDrops = false;
      expect(formatToken(value, currency, isDrops)).toEqual('1,234,567.8977 USD');
    });

    test('should return 1,234,567.89779 USD', () => {
      const value = 1234567.8977;
      const currency = 'USD';
      const isDrops = true;
      expect(formatToken(value, currency, isDrops)).toEqual('1,234,567.8977 USD');
    });
  });
});
