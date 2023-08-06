import { TrustSet, xrpToDrops } from 'xrpl';

import {
  formatAmount,
  formatCurrencyName,
  formatFlags,
  formatFlagsToNumber,
  truncateStringOnLongWord,
  formatToken,
  formatTransferFee
} from './format';

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

describe('formatFlagsToNumber', () => {
  it('should return Flags as is if they are already a number', () => {
    const tx: TrustSet = {
      Account: 'fake',
      LimitAmount: {
        currency: 'USD',
        issuer: 'fake',
        value: '100'
      },
      TransactionType: 'TrustSet',
      Flags: 131072
    };
    const result = formatFlagsToNumber(tx);
    expect(result).toBe(131072);
  });

  it('should convert Flags from string to number using setTransactionFlagsToNumber function', () => {
    const tx: TrustSet = {
      Account: 'fake',
      LimitAmount: {
        currency: 'USD',
        issuer: 'fake',
        value: '100'
      },
      TransactionType: 'TrustSet',
      Flags: {
        tfSetNoRipple: true
      }
    };
    const result = formatFlagsToNumber(tx);
    expect(result).toBe(131072);
  });
});

describe('formatTransferFee', () => {
  it('should format transfer fee', () => {
    const fee = 3000;
    expect(formatTransferFee(fee)).toBe(3);
  });
});

describe('formatCurrencyName', () => {
  it('should convert hex to currency and make it uppercase when currency length is equal to 40', () => {
    const currency = '534F4C4F00000000000000000000000000000000';

    const formattedCurrency = formatCurrencyName(currency);

    expect(formattedCurrency).toEqual('SOLO');
  });

  it('should just make the currency uppercase when currency length is not equal to 40', () => {
    const currency = 'Eth'; // Not in hex, should just be made uppercase

    const formattedCurrency = formatCurrencyName(currency);

    expect(formattedCurrency).toEqual('ETH');
  });
});

describe('truncateStringOnLongWord', () => {
  it('should return the string as it is if its length is lower than or equal to the given length', () => {
    expect(truncateStringOnLongWord('Test string', 11)).toEqual('Test string');
    expect(truncateStringOnLongWord('Test string', 12)).toEqual('Test string');
  });

  it('should return the string truncated with "..." at the end if there is no space within the given length', () => {
    expect(truncateStringOnLongWord('Teststring', 8)).toEqual('Teststri...');
  });

  it('should return the string truncated with "..." at the end if there is a word with a length bigger than the given length', () => {
    expect(
      truncateStringOnLongWord('This is a supercalifragilisticexpialidocious test', 15)
    ).toEqual('This is a super...');
  });

  it('should return the string raw if there is a space within the given length and no words longer than the length', () => {
    expect(truncateStringOnLongWord('This is a test', 10)).toEqual('This is a test');
  });
});
