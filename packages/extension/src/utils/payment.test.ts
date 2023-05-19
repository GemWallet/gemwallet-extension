import { DEFAULT_MEMO_TYPE } from '../constants/payload';
import {
  buildDefaultMemos,
  buildDestinationTag,
  toXRPLMemos,
  buildAmount,
  toHexMemos,
  fromHexMemos,
  checkFee
} from './payment';

describe('buildDefaultMemos', () => {
  test('returns undefined when memoData is undefined or an empty string', () => {
    expect(buildDefaultMemos(undefined)).toBeUndefined();
    expect(buildDefaultMemos('')).toBeUndefined();
  });

  test('returns an array with Memo object when memoData is a non-empty string', () => {
    const memoData = 'Test Memo';

    const expectedResult = [
      {
        memo: {
          memoType: Buffer.from(DEFAULT_MEMO_TYPE, 'utf8').toString('hex').toUpperCase(),
          memoData: Buffer.from(memoData, 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    expect(buildDefaultMemos(memoData)).toEqual(expectedResult);

    const expectedResultXRPLFormat = [
      {
        Memo: {
          MemoType: Buffer.from(DEFAULT_MEMO_TYPE, 'utf8').toString('hex').toUpperCase(),
          MemoData: Buffer.from(memoData, 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    expect(toXRPLMemos(buildDefaultMemos(memoData))).toEqual(expectedResultXRPLFormat);
  });
});

describe('fromHexMemos', () => {
  test('returns undefined if memos is undefined', () => {
    expect(fromHexMemos(undefined)).toBe(undefined);
  });

  test('returns an array of Memos with decoded hex memo fields', () => {
    const memos = [
      {
        memo: {
          memoType: '6d656d6f2074797065',
          memoData: '6d656d6f2064617461',
          memoFormat: '6d656d6f20666f726d61'
        }
      }
    ];

    const expectedMemos = [
      { memo: { memoType: 'memo type', memoData: 'memo data', memoFormat: 'memo forma' } }
    ];

    expect(fromHexMemos(memos)).toEqual(expectedMemos);
  });

  test('returns an empty array if memos is an empty array', () => {
    expect(fromHexMemos([])).toEqual([]);
  });
});

describe('toHexMemos', () => {
  it('should return undefined if memos is undefined', () => {
    const result = toHexMemos(undefined);
    expect(result).toBe(undefined);
  });

  it('should return an array of memos with hex values', () => {
    const memos = [
      { memo: { memoType: 'Type', memoData: 'Data', memoFormat: 'Format' } },
      { memo: { memoType: 'Type2', memoData: 'Data2', memoFormat: 'Format2' } }
    ];

    const expected = [
      {
        memo: {
          memoType: Buffer.from('Type', 'utf8').toString('hex').toUpperCase(),
          memoData: Buffer.from('Data', 'utf8').toString('hex').toUpperCase(),
          memoFormat: Buffer.from('Format', 'utf8').toString('hex').toUpperCase()
        }
      },
      {
        memo: {
          memoType: Buffer.from('Type2', 'utf8').toString('hex').toUpperCase(),
          memoData: Buffer.from('Data2', 'utf8').toString('hex').toUpperCase(),
          memoFormat: Buffer.from('Format2', 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    const result = toHexMemos(memos);
    expect(result).toEqual(expected);
  });

  it('should skip memo properties that are not present', () => {
    const memos = [
      { memo: { memoType: 'Type' } },
      { memo: { memoData: 'Data' } },
      { memo: { memoFormat: 'Format' } },
      { memo: { memoType: 'Type2', memoData: 'Data2' } },
      { memo: { memoType: 'Type3', memoFormat: 'Format3' } }
    ];

    const expected = [
      {
        memo: {
          memoType: Buffer.from('Type', 'utf8').toString('hex').toUpperCase()
        }
      },
      {
        memo: {
          memoData: Buffer.from('Data', 'utf8').toString('hex').toUpperCase()
        }
      },
      {
        memo: {
          memoFormat: Buffer.from('Format', 'utf8').toString('hex').toUpperCase()
        }
      },
      {
        memo: {
          memoType: Buffer.from('Type2', 'utf8').toString('hex').toUpperCase(),
          memoData: Buffer.from('Data2', 'utf8').toString('hex').toUpperCase()
        }
      },
      {
        memo: {
          memoType: Buffer.from('Type3', 'utf8').toString('hex').toUpperCase(),
          memoFormat: Buffer.from('Format3', 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    const result = toHexMemos(memos);
    expect(result).toEqual(expected);
  });
});

describe('toXRPLMemos', () => {
  test('should return undefined if memos is undefined', () => {
    const result = toXRPLMemos(undefined);
    expect(result).toBe(undefined);
  });

  test('should convert memos to XRPLMemos format', () => {
    const memos = [
      { memo: { memoType: 'type1', memoData: 'data1', memoFormat: 'format1' } },
      { memo: { memoType: 'type2', memoData: 'data2', memoFormat: 'format2' } }
    ];

    const expected = [
      { Memo: { MemoType: 'type1', MemoData: 'data1', MemoFormat: 'format1' } },
      { Memo: { MemoType: 'type2', MemoData: 'data2', MemoFormat: 'format2' } }
    ];

    const result = toXRPLMemos(memos);
    expect(result).toEqual(expected);
  });

  test('should omit undefined memo properties', () => {
    const memos = [{ memo: { memoType: 'type1', memoData: 'data1' } }];

    const expected = [{ Memo: { MemoType: 'type1', MemoData: 'data1' } }];

    const result = toXRPLMemos(memos);
    expect(result).toEqual(expected);
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

describe('buildAmount', () => {
  test('should return an object with currency, issuer, and value if both currency and issuer are provided', () => {
    const value = '10';
    const currency = 'USD';
    const issuer = 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN';

    const result = buildAmount(value, currency, issuer);

    expect(result).toEqual({ currency, issuer, value });
  });

  test('should call xrpToDrops function and return its result if currency or issuer is not provided', () => {
    const value = '10';

    const result = buildAmount(value, undefined, undefined);

    expect(result).toEqual('10000000');
  });
});

describe('checkFee', () => {
  it('should return null if fee is null', () => {
    expect(checkFee(null)).toBe(null);
  });

  it('should return null if fee is an empty string', () => {
    expect(checkFee('')).toBe(null);
  });

  it('should return null if fee is not a number string', () => {
    expect(checkFee('abc')).toBe(null);
  });

  it('should return the fee if it is a number string and dropsToXrp does not throw an error', () => {
    expect(checkFee('123')).toBe('123');
  });
});
