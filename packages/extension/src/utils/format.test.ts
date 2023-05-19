import { xrpToDrops } from 'xrpl';

import { formatAmount, formatFlags, formatToken } from './format';

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
      const value = 1234567;
      const currency = 'XRP';
      const isDrops = true;
      expect(formatToken(value, currency, isDrops)).toEqual('1.234567 XRP');
    });

    test('should return 1,234,567.8977 USD', () => {
      const value = 1234567.8977;
      const currency = 'USD';
      const isDrops = false;
      expect(formatToken(value, currency, isDrops)).toEqual('1,234,567.8977 USD');
    });
  });
});

describe('formatFlags', () => {
  it('should return a number as it is if flags is a number', () => {
    expect(formatFlags(123456)).toBe(123456);
  });

  it('should return formatted string if flags is an object', () => {
    const paymentFlags = {
      tfNoDirectRipple: true,
      tfPartialPayment: false,
      tfLimitQuality: false
    };
    let expectedResult = 'tfNoDirectRipple: true\ntfPartialPayment: false\ntfLimitQuality: false';
    expect(formatFlags(paymentFlags)).toBe(expectedResult);

    const trustSetFlags = {
      tfSetfAuth: true,
      tfSetNoRipple: false,
      tfClearNoRipple: false,
      tfSetFreeze: false,
      tfClearFreeze: false
    };

    expectedResult =
      'tfSetfAuth: true\ntfSetNoRipple: false\ntfClearNoRipple: false\ntfSetFreeze: false\ntfClearFreeze: false';
    expect(formatFlags(trustSetFlags)).toBe(expectedResult);
  });

  it('should return empty string if flags is an empty object', () => {
    const flags = {};
    const expectedResult = '';
    expect(formatFlags(flags)).toBe(expectedResult);
  });
});
