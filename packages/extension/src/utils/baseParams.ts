import { Memo, Signer } from '@gemwallet/constants';

import { parseMemos, parseSigners } from './parseParams';
import { checkFee } from './transaction';

export type BaseTransactionParamsNew = {
  fee?: string;
  sequence?: number;
  accountTxnID?: string;
  lastLedgerSequence?: number;
  memos?: Memo[];
  networkID?: number;
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

export const parseBaseParamsFromStoredData = (storedObject: object): BaseTransactionParamsNew => {
  const result: Partial<BaseTransactionParamsNew> = {};
  const obj = storedObject as Record<string, unknown>;

  const addParam = <T extends keyof BaseTransactionParamsNew>(
    key: T,
    value: BaseTransactionParamsNew[T] | null
  ) => {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  };

  addParam('fee', 'fee' in obj ? checkFee(obj.fee as string | null) : undefined);
  addParam('sequence', 'sequence' in obj ? Number(obj.sequence) : undefined);
  addParam('accountTxnID', 'accountTxnID' in obj ? (obj.accountTxnID as string) : undefined);
  addParam(
    'lastLedgerSequence',
    'lastLedgerSequence' in obj ? Number(obj.lastLedgerSequence) : undefined
  );
  addParam('memos', 'memos' in obj ? parseMemos(obj.memos as string | null) : undefined);
  addParam('networkID', 'networkID' in obj ? (obj.networkID as number) : undefined);
  addParam('signers', 'signers' in obj ? parseSigners(obj.signers as string | null) : undefined);
  addParam('sourceTag', 'sourceTag' in obj ? Number(obj.sourceTag) : undefined);
  addParam('signingPubKey', 'signingPubKey' in obj ? (obj.signingPubKey as string) : undefined);
  addParam('ticketSequence', 'ticketSequence' in obj ? Number(obj.ticketSequence) : undefined);
  addParam('txnSignature', 'txnSignature' in obj ? (obj.txnSignature as string) : undefined);

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

export const getBaseFromParams = (params: object) => {
  const p = params as BaseTransactionParams;
  return {
    fee: p.fee || undefined,
    sequence: p.sequence || undefined,
    accountTxnID: p.accountTxnID || undefined,
    lastLedgerSequence: p.lastLedgerSequence || undefined,
    memos: p.memos || undefined,
    signers: p.signers || undefined,
    sourceTag: p.sourceTag || undefined,
    signingPubKey: p.signingPubKey || undefined,
    ticketSequence: p.ticketSequence || undefined,
    txnSignature: p.txnSignature || undefined
  };
};
