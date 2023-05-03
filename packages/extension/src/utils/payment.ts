import { Memo } from 'xrpl/dist/npm/models/common';

import { DEFAULT_MEMO_TYPE } from '../constants/payload';

/**
 * Build default memos when a single MemoData is provided from the UI.
 * For display purposes, will need to be converted to hex before sending the transaction.
 *
 * Unused by the API.
 * @param memoData - MemoData string from the UI.
 */
export const buildDefaultMemos = (
  memoData: string | undefined
): Memo[] | undefined => {
  if (memoData === undefined || memoData === '') return undefined;
  return toHexMemos([
    {
      Memo: {
        MemoType: DEFAULT_MEMO_TYPE,
        MemoData: memoData,
      }
    }
  ]);
};

export const fromHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map((memo) => {
    return {
      Memo: {
        ...memo.Memo.MemoType ? {MemoType: Buffer.from(memo.Memo.MemoType, 'hex').toString('utf8')} : {},
        ...memo.Memo.MemoData ? {MemoData: Buffer.from(memo.Memo.MemoData, 'hex').toString('utf8')} : {},
        ...memo.Memo.MemoFormat ? {MemoFormat: Buffer.from(memo.Memo.MemoFormat, 'hex').toString('utf8')} : {}
      }
    };
  });
}

export const toHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map((memo) => {
    return {
      Memo: {
        ...memo.Memo.MemoType ? {MemoType: Buffer.from(memo.Memo.MemoType, 'utf8').toString('hex').toUpperCase()} : {},
        ...memo.Memo.MemoData ? {MemoData: Buffer.from(memo.Memo.MemoData, 'utf8').toString('hex').toUpperCase()} : {},
        ...memo.Memo.MemoFormat ? {MemoFormat: Buffer.from(memo.Memo.MemoFormat, 'utf8').toString('hex').toUpperCase()} : {}
      }
    };
  });
}

export const buildDestinationTag = (destinationTag: string | undefined): number | undefined => {
  if (destinationTag === undefined || destinationTag === '') return undefined;
  return Number(destinationTag);
};
