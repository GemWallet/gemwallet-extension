import { Memo, Signer } from '@gemwallet/constants';

import { parseMemos, parseSigners } from './parseFromString';
import { checkFee } from './transaction';

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
