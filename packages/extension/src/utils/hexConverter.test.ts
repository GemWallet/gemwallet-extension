import { currencyToHex, hexToCurrency } from './hexConverter';

describe('currencyToHex function', () => {
  it('should convert a string into hex and pad it to 40 characters', () => {
    const currency = 'SOLO';
    const hex = currencyToHex(currency);

    expect(hex).toEqual('534F4C4F00000000000000000000000000000000');
    expect(hex.length).toEqual(40);
  });
});

describe('hexToCurrency', () => {
  it('should convert hex to currency', () => {
    const hex = '534F4C4F00000000000000000000000000000000';

    const currency = hexToCurrency(hex);

    expect(currency).toEqual('SOLO');
  });

  it('should trim trailing zeros in the hex string', () => {
    const hex = '534F4C4F';

    const currency = hexToCurrency(hex);

    expect(currency).toEqual('SOLO');
  });

  it('should return empty string for empty input', () => {
    const hex = '';

    const currency = hexToCurrency(hex);

    expect(currency).toEqual('');
  });
});
