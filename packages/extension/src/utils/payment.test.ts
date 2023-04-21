import { DEFAULT_MEMO_TYPE } from '../constants/payload';
import { buildMemos, buildDestinationTag } from './payment';

describe('buildMemos', () => {
  test('returns undefined when memoData is undefined or an empty string', () => {
    expect(buildMemos(undefined)).toBeUndefined();
    expect(buildMemos('')).toBeUndefined();
  });

  test('returns an array with Memo object when memoData is a non-empty string', () => {
    const memoData = 'Test Memo';

    const expectedResult = [
      {
        Memo: {
          MemoType: Buffer.from(DEFAULT_MEMO_TYPE, 'utf8').toString('hex').toUpperCase(),
          MemoData: Buffer.from(memoData, 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    expect(buildMemos(memoData)).toEqual(expectedResult);
  });
});


describe('buildDestinationTag', () => {
  it('should return undefined when destinationTag is undefined or an empty string', () => {
    expect(buildDestinationTag(undefined)).toBeUndefined();
    expect(buildDestinationTag('')).toBeUndefined();
  });

  it('should return a number when destinationTag is a valid string containing a number', () => {
    expect(buildDestinationTag('12345')).toBe(12345);
  });

  it('should return a number when destinationTag is a valid string containing a number with leading zeros', () => {
    expect(buildDestinationTag('000012345')).toBe(12345);
  });

  it('should return a number when destinationTag is a valid string containing a number with decimal values', () => {
    expect(buildDestinationTag('12345.67')).toBe(12345.67);
  });
});