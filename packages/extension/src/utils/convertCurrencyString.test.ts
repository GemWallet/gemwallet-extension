import { convertCurrencyString, handleAmountHexCurrency } from './convertCurrencyString';

describe('convertCurrencyString', () => {
  it('should convert a currency string with 40 characters into its corresponding characters', () => {
    const currency = '534F4C4F00000000000000000000000000000000';
    const expected = 'SOLO';
    expect(convertCurrencyString(currency)).toMatch(expected);
  });

  it('should return the original currency string if it does not have 40 characters', () => {
    const currency = 'USD';
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it cannot be split into two-character codes', () => {
    const currency = '7F20362';
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains non-ASCII characters', () => {
    const currency = 'BTC❌'; // Contains a non-ASCII character
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains more than 3 ASCII characters', () => {
    const currency = 'ABCDEF'; // Contains more than 3 characters
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains uppercase XRP', () => {
    const currency = 'XRP'; // Contains uppercase XRP
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains lowercase xrp', () => {
    const currency = 'xrp'; // Contains lowercase xrp
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains XRP with mixed case', () => {
    const currency = 'XrP'; // Contains mixed case XRP
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should return the original currency string if it contains a disallowed symbol', () => {
    const currency = 'BTC#'; // Contains a disallowed symbol
    expect(convertCurrencyString(currency)).toEqual(currency);
  });

  it('should convert a valid currency code with mixed case', () => {
    const currency = 'bTc'; // Valid currency code with mixed case
    const expected = 'bTc';
    expect(convertCurrencyString(currency)).toEqual(expected);
  });

  it('should convert a valid currency with all authorized characters', () => {
    const currency = '7151313f21402324255e00000000000000000000';
    const expected = 'qQ1?!@#$%^';
    expect(convertCurrencyString(currency)).toMatch(expected);
    const currency2 = '262a28293c3e28297b7d5b5d0000000000000000';
    const expected2 = '&*()<>(){}[]';
    expect(convertCurrencyString(currency2)).toMatch(expected2);
    //
  });
});

describe('handleAmountHexCurrency', () => {
  it('should convert currency to hex when currency length is greater than 3 and not equal to 40', () => {
    const issuedCurrencyAmount = {
      currency: 'SOLO', // length 4, so it should be converted
      value: '10',
      issuer: ''
    };

    handleAmountHexCurrency(issuedCurrencyAmount);

    expect(issuedCurrencyAmount.currency).toEqual('534F4C4F00000000000000000000000000000000');
  });

  it('should not convert currency to hex when currency length is not greater than 3', () => {
    const issuedCurrencyAmount = {
      currency: 'TE', // length 2, so it should not be converted
      value: '20',
      issuer: ''
    };

    handleAmountHexCurrency(issuedCurrencyAmount);

    expect(issuedCurrencyAmount.currency).toEqual('TE');
  });

  it('should not convert currency to hex when currency length is equal to 40', () => {
    const issuedCurrencyAmount = {
      currency: '1234567890123456789012345678901234567890', // length 40, so it should not be converted
      value: '30',
      issuer: ''
    };

    handleAmountHexCurrency(issuedCurrencyAmount);

    expect(issuedCurrencyAmount.currency).toEqual('1234567890123456789012345678901234567890');
  });
});
