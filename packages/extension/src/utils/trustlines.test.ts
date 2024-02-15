import { isLPToken } from './trustlines';
import { describe, it, expect } from 'vitest';

describe('isLPToken', () => {
  it('returns true for hex strings starting with 0x03', () => {
    expect(isLPToken('03abcdef')).toBeTruthy();
  });

  it('returns false for hex strings not starting with 0x03', () => {
    expect(isLPToken('04abcdef')).toBeFalsy();
    expect(isLPToken('00abcdef')).toBeFalsy();
    expect(isLPToken('ffabcdef')).toBeFalsy();
  });

  it('returns false for non-hex strings or strings with less than 2 characters', () => {
    expect(isLPToken('g3abcdef')).toBeFalsy();
    expect(isLPToken('z')).toBeFalsy();
    expect(isLPToken('')).toBeFalsy();
    expect(isLPToken('1')).toBeFalsy();
  });

  // Additional test for case insensitivity, if applicable
  it('correctly handles case-insensitive hex values', () => {
    expect(isLPToken('03ABCDEF')).toBeTruthy();
    expect(isLPToken('03abcdef')).toBeTruthy();
    expect(isLPToken('03AbCdEf')).toBeTruthy();
  });
});
