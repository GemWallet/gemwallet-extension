import { currencyToHex } from './hexConverter';

describe('currencyToHex function', () => {
  it('should convert a string into hex and pad it to 40 characters', () => {
    const currency = 'SOLO';
    const hex = currencyToHex(currency);

    expect(hex).toEqual('534F4C4F00000000000000000000000000000000');
    expect(hex.length).toEqual(40);
  });
});
