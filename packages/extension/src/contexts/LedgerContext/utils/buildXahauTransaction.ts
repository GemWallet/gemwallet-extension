import { BaseTransaction } from 'xrpl';

import { BaseTransactionRequest, SetHook, SetHookRequest } from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { toXRPLMemos, toXRPLSigners } from '../../../utils';

export const buildSetHook = (params: SetHookRequest, wallet: WalletLedger): SetHook => {
  return {
    ...(buildXahauBaseTransaction(params, wallet, 'SetHook') as SetHook),
    ...(params.hooks && { Hooks: params.hooks })
  };
};

const buildXahauBaseTransaction = (
  payload: BaseTransactionRequest,
  wallet: WalletLedger,
  txType: 'SetHook'
): BaseTransaction => ({
  TransactionType: txType,
  Account: wallet.publicAddress,
  ...(payload.fee && { Fee: payload.fee }),
  ...(payload.sequence && { Sequence: payload.sequence }),
  ...(payload.accountTxnID && { AccountTxnID: payload.accountTxnID }),
  ...(payload.lastLedgerSequence && { LastLedgerSequence: payload.lastLedgerSequence }),
  ...(payload.memos && { Memos: toXRPLMemos(payload.memos) }), // Each field of each memo is hex encoded
  ...(payload.networkID && { NetworkID: payload.networkID }),
  ...(payload.signers && { Signers: toXRPLSigners(payload.signers) }),
  ...(payload.sourceTag && { SourceTag: payload.sourceTag }),
  ...(payload.signingPubKey && { SigningPubKey: payload.signingPubKey }),
  ...(payload.ticketSequence && { TicketSequence: payload.ticketSequence }),
  ...(payload.txnSignature && { TxnSignature: payload.txnSignature })
});
