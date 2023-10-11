import { TrustSet, xrpToDrops } from 'xrpl';

import {
  formatAmount,
  formatCurrencyName,
  formatFlags,
  formatFlagsToNumber,
  formatToken,
  formatTransferFee,
  parseAmountObject
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

    test('should handle values with long decimal parts gracefully', () => {
      const value = Number('10.000007') - 10;
      const currency = 'XRP';
      expect(formatToken(value, currency)).toEqual('0.000007 XRP');
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

  it('should return None string if flags is an empty object', () => {
    const flags = {};
    const expectedResult = 'None';
    expect(formatFlags(flags)).toBe(expectedResult);
  });

  it('should format flags as number for other flag types', () => {
    expect(formatFlags(123456, 'otherFlagType')).toBe(123456);
  });

  it('should format NFTokenCreateOffer flags correctly', () => {
    const flags = { tfSellNFToken: true };
    const expectedResult = 'Offer type: Sell offer';
    expect(formatFlags(flags, 'NFTokenCreateOffer')).toBe(expectedResult);
  });

  it('should format NFTokenCreateOffer flags (number) correctly', () => {
    const flags = 1;
    const expectedResult = 'Offer type: Sell offer';
    expect(formatFlags(flags, 'NFTokenCreateOffer')).toBe(expectedResult);
  });

  it('should format NFTokenCreateOffer flags as buy offer when false', () => {
    const flags = { tfSellNFToken: false };
    const expectedResult = 'Offer type: Buy offer';
    expect(formatFlags(flags, 'NFTokenCreateOffer')).toBe(expectedResult);
  });

  it('should format NFTokenMint flags correctly when given as a number', () => {
    const flags = 3; // both tfBurnable and tfOnlyXRP flags are set
    const expectedResult = 'Burnable\nOnly XRP';
    expect(formatFlags(flags, 'NFTokenMint')).toBe(expectedResult);
  });

  it('should format NFTokenMint flags correctly when given as an object', () => {
    const flags = {
      tfBurnable: true,
      tfOnlyXRP: true,
      tfTrustLine: false,
      tfTransferable: false
    };
    const expectedResult = 'Burnable\nOnly XRP';
    expect(formatFlags(flags, 'NFTokenMint')).toBe(expectedResult);
  });

  it('should not show false flags for NFTokenMint', () => {
    const flags = {
      tfBurnable: false,
      tfOnlyXRP: false,
      tfTrustLine: false,
      tfTransferable: true
    };
    expect(formatFlags(flags, 'NFTokenMint')).toBe('Transferable');
  });

  it('should format OfferCreate flags correctly when given as a number', () => {
    const flags = 196608; // both tfPassive and tfImmediateOrCancel flags are set
    const expectedResult = 'Passive\nImmediate Or Cancel';
    expect(formatFlags(flags, 'OfferCreate')).toBe(expectedResult);
  });

  it('should format OfferCreate flags correctly when given as an object', () => {
    const flags = {
      tfPassive: true,
      tfImmediateOrCancel: true,
      tfFillOrKill: false,
      tfSell: false
    };
    const expectedResult = 'Passive\nImmediate Or Cancel';
    expect(formatFlags(flags, 'OfferCreate')).toBe(expectedResult);
  });

  it('should not show false flags for OfferCreate', () => {
    const flags = {
      tfPassive: false,
      tfImmediateOrCancel: false,
      tfFillOrKill: false,
      tfSell: true
    };
    expect(formatFlags(flags, 'OfferCreate')).toBe('Sell');
  });

  it('should format Payment flags correctly when given as a number', () => {
    const flags = 196608; // both tfNoDirectRipple and tfPartialPayment flags are set
    const expectedResult = 'No Direct Ripple\nPartial Payment';
    expect(formatFlags(flags, 'Payment')).toBe(expectedResult);
  });

  it('should format Payment flags correctly when given as an object', () => {
    const flags = {
      tfNoDirectRipple: true,
      tfPartialPayment: true,
      tfLimitQuality: false
    };
    const expectedResult = 'No Direct Ripple\nPartial Payment';
    expect(formatFlags(flags, 'Payment')).toBe(expectedResult);
  });

  it('should not show false flags for Payment', () => {
    const flags = {
      tfNoDirectRipple: false,
      tfPartialPayment: false,
      tfLimitQuality: true
    };
    expect(formatFlags(flags, 'Payment')).toBe('Limit Quality');
  });

  it('should format Payment flags to "None" when no flags are set', () => {
    const flags = {
      tfNoDirectRipple: false,
      tfPartialPayment: false,
      tfLimitQuality: false
    };
    expect(formatFlags(flags, 'Payment')).toBe('None');
  });

  it('should format AccountSet flags correctly when given as a number', () => {
    const flags = 327680; // tfRequireDestTag and tfRequireAuth flags are set
    const expectedResult = 'Require Dest Tag\nRequire Auth';
    expect(formatFlags(flags, 'AccountSet')).toBe(expectedResult);
  });

  it('should format AccountSet flags correctly when given as an object', () => {
    const flags = {
      tfRequireDestTag: true,
      tfOptionalDestTag: false,
      tfRequireAuth: true,
      tfOptionalAuth: false,
      tfDisallowXRP: false,
      tfAllowXRP: true
    };
    const expectedResult = 'Require Dest Tag\nRequire Auth\nAllow XRP';
    expect(formatFlags(flags, 'AccountSet')).toBe(expectedResult);
  });

  it('should not show false flags for AccountSet', () => {
    const flags = {
      tfRequireDestTag: false,
      tfOptionalDestTag: false,
      tfRequireAuth: false,
      tfOptionalAuth: false,
      tfDisallowXRP: false,
      tfAllowXRP: false
    };
    expect(formatFlags(flags, 'AccountSet')).toBe('None');
  });

  it('should format AccountSet flags to "None" when no flags are set as a number', () => {
    const flags = 0; // no flags are set
    expect(formatFlags(flags, 'AccountSet')).toBe('None');
  });

  it('should format TrustSet flags correctly when given as a number', () => {
    const flags = 196608; // tfSetfAuth and tfSetNoRipple flags are set
    const expectedResult = 'Set Auth\nSet No Ripple';
    expect(formatFlags(flags, 'TrustSet')).toBe(expectedResult);
  });

  it('should format TrustSet flags correctly when given as an object', () => {
    const flags = {
      tfSetfAuth: true,
      tfSetNoRipple: true,
      tfClearNoRipple: false,
      tfSetFreeze: false,
      tfClearFreeze: false
    };
    const expectedResult = 'Set Auth\nSet No Ripple';
    expect(formatFlags(flags, 'TrustSet')).toBe(expectedResult);
  });

  it('should not show false flags for TrustSet', () => {
    const flags = {
      tfSetfAuth: false,
      tfSetNoRipple: false,
      tfClearNoRipple: false,
      tfSetFreeze: true,
      tfClearFreeze: false
    };
    expect(formatFlags(flags, 'TrustSet')).toBe('Set Freeze');
  });

  it('should format TrustSet flags to "None" when no flags are set as a number', () => {
    const flags = 0; // no flags are set
    expect(formatFlags(flags, 'TrustSet')).toBe('None');
  });

  it('should format TrustSet flags to "None" when no flags are set as an object', () => {
    const flags = {
      tfSetfAuth: false,
      tfSetNoRipple: false,
      tfClearNoRipple: false,
      tfSetFreeze: false,
      tfClearFreeze: false
    };
    expect(formatFlags(flags, 'TrustSet')).toBe('None');
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

describe('parseAmountObject', () => {
  it('should correctly parse XRP amount when input is a string', () => {
    const amount = '1000000';
    const result = parseAmountObject(amount);
    expect(result).toEqual({
      amount: '1',
      currency: 'XRP'
    });
  });

  it('should correctly parse issued currency amount when input is an object', () => {
    const amount = {
      value: '100',
      currency: 'USD',
      issuer: 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
    };
    const result = parseAmountObject(amount);
    expect(result).toEqual({
      amount: '100',
      currency: 'USD',
      issuer: 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
    });
  });

  it('should correctly convert hex currency to string if currency is in hex', () => {
    const amount = {
      value: '200',
      currency: '534F4C4F00000000000000000000000000000000',
      issuer: 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
    };
    const result = parseAmountObject(amount);
    expect(result).toEqual({
      amount: '200',
      currency: 'SOLO',
      issuer: 'rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS'
    });
  });
});
