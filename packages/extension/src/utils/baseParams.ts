import { Memo, Signer } from '@gemwallet/constants';

import { parseMemos, parseSigners } from './parseParams';
import { checkFee } from './transaction';

export type BaseTransactionParamsNew = {
  fee?: string;
  sequence?: number;
  accountTxnID?: string;
  lastLedgerSequence?: number;
  memos?: Memo[];
  signers?: Signer[];
  sourceTag?: number;
  signingPubKey?: string;
  ticketSequence?: number;
  txnSignature?: string;
};

export const parseBaseParamsFromURLParamsNew = (
  urlParams: URLSearchParams
): BaseTransactionParamsNew => {
  const result: Partial<BaseTransactionParamsNew> = {};

  const addParam = <T extends keyof BaseTransactionParamsNew>(
    key: T,
    value: BaseTransactionParamsNew[T] | null
  ) => {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  };

  addParam('fee', checkFee(urlParams.get('fee')));
  addParam('sequence', urlParams.get('sequence') ? Number(urlParams.get('sequence')) : undefined);
  addParam('accountTxnID', urlParams.get('accountTxnID'));
  addParam(
    'lastLedgerSequence',
    urlParams.get('lastLedgerSequence') ? Number(urlParams.get('lastLedgerSequence')) : undefined
  );
  addParam('memos', parseMemos(urlParams.get('memos')));
  addParam('signers', parseSigners(urlParams.get('signers')));
  addParam(
    'sourceTag',
    urlParams.get('sourceTag') ? Number(urlParams.get('sourceTag')) : undefined
  );
  addParam('signingPubKey', urlParams.get('signingPubKey'));
  addParam(
    'ticketSequence',
    urlParams.get('ticketSequence') ? Number(urlParams.get('ticketSequence')) : undefined
  );
  addParam('txnSignature', urlParams.get('txnSignature'));

  return result;
};

/*
 * Legacy part: Will be removed after all the views have been migrated.
 */
export type BaseTransactionParams = {
  fee: string | null;
  sequence: number | null;
  accountTxnID: string | null;
  lastLedgerSequence: number | null;
  memos: Memo[] | null;
  signers: Signer[] | null;
  sourceTag: number | null;
  signingPubKey: string | null;
  ticketSequence: number | null;
  txnSignature: string | null;
};

export const initialBaseTransactionParams: BaseTransactionParams = {
  fee: null,
  sequence: null,
  accountTxnID: null,
  lastLedgerSequence: null,
  memos: null,
  signers: null,
  sourceTag: null,
  signingPubKey: null,
  ticketSequence: null,
  txnSignature: null
};

export const parseBaseParamsFromURLParams = (urlParams: URLSearchParams): BaseTransactionParams => {
  return {
    fee: checkFee(urlParams.get('fee')),
    sequence: urlParams.get('sequence') ? Number(urlParams.get('sequence')) : null,
    accountTxnID: urlParams.get('accountTxnID'),
    lastLedgerSequence: urlParams.get('lastLedgerSequence')
      ? Number(urlParams.get('lastLedgerSequence'))
      : null,
    memos: parseMemos(urlParams.get('memos')),
    signers: parseSigners(urlParams.get('signers')),
    sourceTag: urlParams.get('sourceTag') ? Number(urlParams.get('sourceTag')) : null,
    signingPubKey: urlParams.get('signingPubKey'),
    ticketSequence: urlParams.get('ticketSequence')
      ? Number(urlParams.get('ticketSequence'))
      : null,
    txnSignature: urlParams.get('txnSignature')
  };
};

export const getBaseFromParams = (params: any) => {
  return {
    fee: params.fee || undefined,
    sequence: params.sequence || undefined,
    accountTxnID: params.accountTxnID || undefined,
    lastLedgerSequence: params.lastLedgerSequence || undefined,
    memos: params.memos || undefined,
    signers: params.signers || undefined,
    sourceTag: params.sourceTag || undefined,
    signingPubKey: params.signingPubKey || undefined,
    ticketSequence: params.ticketSequence || undefined,
    txnSignature: params.txnSignature || undefined
  };
};
