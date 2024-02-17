import { breakStringByLine } from './breakStringByLine';
import { describe, expect, test } from 'vitest';

describe('breakStringByLine', () => {
  test('should wrap the string every 30 characters by default', () => {
    const originalString =
      'This is a very long string that needs to be wrapped every 30 characters.';
    const expectedString =
      'This is a very long string tha\nt needs to be wrapped every 30\n characters.';
    expect(breakStringByLine(originalString, 30)).toEqual(expectedString);
  });

  test('should wrap the string every specified number of characters', () => {
    const originalString =
      'This is a very long string that needs to be wrapped every 50 characters.';
    const expectedString =
      'This is a very long string that needs to be wrappe\nd every 50 characters.';
    expect(breakStringByLine(originalString, 50)).toEqual(expectedString);
  });

  test('should return an empty string for an empty input', () => {
    expect(breakStringByLine('', 20)).toEqual('');
  });

  test('should return the original string if it is shorter than the specified number of characters', () => {
    const originalString = 'This is a short string.';
    expect(breakStringByLine(originalString, 50)).toEqual(originalString);
  });
});
