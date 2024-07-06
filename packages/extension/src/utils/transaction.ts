import { dropsToXrp, xrpToDrops } from 'xrpl';
import { Amount, Memo as XRPLMemo, Signer as XRPLSigner } from 'xrpl/dist/npm/models/common';

import { Memo, Signer } from '@gemwallet/constants';

import { DEFAULT_MEMO_TYPE } from '../constants/payload';

/**
 * Build default memos when a single MemoData is provided from the UI.
 * For display purposes, will need to be converted to hex before sending the transaction.
 *
 * Unused by the API.
 * @param memoData - MemoData string from the UI.
 */
export const buildDefaultMemos = (memoData: string | undefined): Memo[] | undefined => {
  if (memoData === undefined || memoData === '') return undefined;
  return toHexMemos([
    {
      memo: {
        memoType: DEFAULT_MEMO_TYPE,
        memoData: memoData
      }
    }
  ]);
};

export const fromHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map(({ memo }) => {
    return {
      memo: {
        ...(memo.memoType ? { memoType: Buffer.from(memo.memoType, 'hex').toString('utf8') } : {}),
        ...(memo.memoData ? { memoData: Buffer.from(memo.memoData, 'hex').toString('utf8') } : {}),
        ...(memo.memoFormat
          ? { memoFormat: Buffer.from(memo.memoFormat, 'hex').toString('utf8') }
          : {})
      }
    };
  });
};

export const toHexMemos = (memos: Memo[] | undefined): Memo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map(({ memo }) => {
    return {
      memo: {
        ...(memo.memoType
          ? { memoType: Buffer.from(memo.memoType, 'utf8').toString('hex').toUpperCase() }
          : {}),
        ...(memo.memoData
          ? { memoData: Buffer.from(memo.memoData, 'utf8').toString('hex').toUpperCase() }
          : {}),
        ...(memo.memoFormat
          ? { memoFormat: Buffer.from(memo.memoFormat, 'utf8').toString('hex').toUpperCase() }
          : {})
      }
    };
  });
};

export const toXRPLMemos = (memos: Memo[] | undefined): XRPLMemo[] | undefined => {
  if (memos === undefined) return undefined;
  return memos.map(({ memo }) => {
    return {
      Memo: {
        ...(memo.memoType ? { MemoType: memo.memoType } : {}),
        ...(memo.memoData ? { MemoData: memo.memoData } : {}),
        ...(memo.memoFormat ? { MemoFormat: memo.memoFormat } : {})
      }
    };
  });
};

export const toXRPLSigners = (signers: Signer[] | undefined): XRPLSigner[] | undefined => {
  if (signers === undefined) return undefined;
  return signers.map(({ signer }) => {
    return {
      Signer: {
        Account: signer.account,
        SigningPubKey: signer.signingPubKey,
        TxnSignature: signer.txnSignature
      }
    };
  });
};

export const buildDestinationTag = (destinationTag: string | undefined): number | undefined => {
  if (destinationTag === undefined || destinationTag === '') return undefined;
  return Number(destinationTag);
};

export const checkFee = (fee: string | null) => {
  if (fee) {
    try {
      if (Number(fee) && dropsToXrp(fee)) {
        return fee;
      }
    } catch (e) {
      /* empty */
    }
  }
  return null;
};

export const buildAmount = (
  value: string,
  currency: string | undefined,
  issuer: string | undefined
): Amount | string => {
  return currency && issuer
    ? {
        currency,
        issuer,
        value
      }
    : xrpToDrops(value);
};
