import { Memo } from 'xrpl/dist/npm/models/common';

import { DEFAULT_MEMO_TYPE } from '../constants/payload';

// For display purposes on the confirmation screen.
// Will be converted to hex before sending the transaction.
export const buildRawMemos = (
  memoData: string | undefined
): Memo[] | undefined => {
  if (memoData === undefined || memoData === '') return undefined;
  return [
    {
      Memo: {
        MemoType: DEFAULT_MEMO_TYPE,
        MemoData: memoData,
      }
    }
  ];
};

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
