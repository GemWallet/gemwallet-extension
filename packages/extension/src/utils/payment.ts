import { xrpToDrops } from 'xrpl';
import { Memo as XRPLMemo } from 'xrpl/dist/npm/models/common';

import { Amount, Memo } from '@gemwallet/constants';

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
      memo: {
        memoType: DEFAULT_MEMO_TYPE,
        memoData: memoData,
      }
    }
  ]);
};

export const fromHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map((memo) => {
    return {
      memo: {
        ...memo.memo.memoType ? {memoType: Buffer.from(memo.memo.memoType, 'hex').toString('utf8')} : {},
        ...memo.memo.memoData ? {memoData: Buffer.from(memo.memo.memoData, 'hex').toString('utf8')} : {},
        ...memo.memo.memoFormat ? {memoFormat: Buffer.from(memo.memo.memoFormat, 'hex').toString('utf8')} : {}
      }
    };
  });
};

export const toHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map((memo) => {
    return {
      memo: {
        ...memo.memo.memoType ? {memoType: Buffer.from(memo.memo.memoType, 'utf8').toString('hex').toUpperCase()} : {},
        ...memo.memo.memoData ? {memoData: Buffer.from(memo.memo.memoData, 'utf8').toString('hex').toUpperCase()} : {},
        ...memo.memo.memoFormat ? {memoFormat: Buffer.from(memo.memo.memoFormat, 'utf8').toString('hex').toUpperCase()} : {}
      }
    };
  });
};

export const toXRPLMemos = (memos: Memo[] | undefined): XRPLMemo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map((memo) => {
    return {
      Memo: {
        ...memo.memo.memoType ? {MemoType: memo.memo.memoType} : {},
        ...memo.memo.memoData ? {MemoData: memo.memo.memoData} : {},
        ...memo.memo.memoFormat ? {MemoFormat: memo.memo.memoFormat} : {}
      }
    };
  });
};

export const buildDestinationTag = (destinationTag: string | undefined): number | undefined => {
  if (destinationTag === undefined || destinationTag === '') return undefined;
  return Number(destinationTag);
};

export const buildAmount = (value: string, currency?: string, issuer?: string): Amount | string => {
  return currency && issuer
    ? {
      currency,
      issuer,
      value
    }
    : xrpToDrops(value);
};
