import { breakStringByLine } from './breakStringByLine';

describe('breakStringByLine', () => {
  it('should wrap the string every 30 characters by default', () => {
    const originalString =
      'This is a very long string that needs to be wrapped every 30 characters.';
    const expectedString =
      'This is a very long strin\ng that needs to be wrap\nped every 30 character\ns.';
    expect(breakStringByLine(originalString, 30)).toEqual(expectedString);
  });

  it('should wrap the string every specified number of characters', () => {
    const originalString =
      'This is a very long string that needs to be wrapped every 50 characters.';
    const expectedString =
      'This is a very long strin\ng that needs to be wrapped\n every 50 characters.';
    expect(breakStringByLine(originalString, 50)).toEqual(expectedString);
  });

  it('should return an empty string for an empty input', () => {
    expect(breakStringByLine('', 20)).toEqual('');
  });

  it('should return the original string if it is shorter than the specified number of characters', () => {
    const originalString = 'This is a short string.';
    expect(breakStringByLine(originalString, 50)).toEqual(originalString);
  });
});
