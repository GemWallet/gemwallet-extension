import { DEFAULT_MEMO_TYPE } from '../constants/payload';
import { buildMemos } from './payment';

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
