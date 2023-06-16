import { hexToString, stringToHex } from './crypto';

describe('stringToHex', () => {
  it('should convert a string to hexadecimal', () => {
    const testString = 'Hello World';
    const expectedOutput = '48656C6C6F20576F726C64';

    expect(stringToHex(testString)).toEqual(expectedOutput);
  });

  it('should return an empty string when the input is an empty string', () => {
    const testString = '';
    const expectedOutput = '';

    expect(stringToHex(testString)).toEqual(expectedOutput);
  });

  it('should handle special characters correctly', () => {
    const testString = 'Hello@123!';
    const expectedOutput = '48656C6C6F4031323321';

    expect(stringToHex(testString)).toEqual(expectedOutput);
  });
});

describe('hexToString', () => {
  it('should convert a hex string to a UTF-8 string', () => {
    const hex = '48656c6c6f20576f726c64'; // Hex for 'Hello World'
    expect(hexToString(hex)).toBe('Hello World');
  });

  it('should handle empty strings', () => {
    const hex = '';
    expect(hexToString(hex)).toBe('');
  });

  it('should handle non-ascii characters', () => {
    const hex = 'E4BDA0E5A5BD'; // Hex for '你好'
    expect(hexToString(hex)).toBe('你好');
  });
});
