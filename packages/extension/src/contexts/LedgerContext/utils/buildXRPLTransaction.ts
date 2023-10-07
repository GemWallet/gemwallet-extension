import { NFTokenAcceptOffer, NFTokenBurn, NFTokenCancelOffer } from 'xrpl';
import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common';

import {
  AcceptNFTOfferRequest,
  BaseTransactionRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest
} from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import { handleAmountHexCurrency, toXRPLMemos, toXRPLSigners } from '../../../utils';

export const buildNFTokenAcceptOffer = (
  params: AcceptNFTOfferRequest,
  wallet: WalletLedger
): NFTokenAcceptOffer => {
  if (params.NFTokenBrokerFee) {
    handleAmountHexCurrency(params.NFTokenBrokerFee);
  }

  return {
    ...(buildBaseTransaction(params, wallet, 'NFTokenAcceptOffer') as NFTokenAcceptOffer),
    ...(params.NFTokenSellOffer && { NFTokenSellOffer: params.NFTokenSellOffer }),
    ...(params.NFTokenBuyOffer && { NFTokenBuyOffer: params.NFTokenBuyOffer }),
    ...(params.NFTokenBrokerFee && { NFTokenBrokerFee: params.NFTokenBrokerFee })
  };
};

export const buildNFTokenBurn = (params: BurnNFTRequest, wallet: WalletLedger): NFTokenBurn => {
  return {
    ...(buildBaseTransaction(params, wallet, 'NFTokenBurn') as NFTokenBurn),
    ...(params.NFTokenID && { NFTokenID: params.NFTokenID }),
    ...(params.owner && { Owner: params.owner })
  };
};

export const buildNFTokenCancelOffer = (
  params: CancelNFTOfferRequest,
  wallet: WalletLedger
): NFTokenCancelOffer => {
  return {
    ...(buildBaseTransaction(params, wallet, 'NFTokenCancelOffer') as NFTokenCancelOffer),
    ...(params.NFTokenOffers && { NFTokenOffers: params.NFTokenOffers })
  };
};

export const buildBaseTransaction = (
  payload: BaseTransactionRequest,
  wallet: WalletLedger,
  txType:
    | 'NFTokenMint'
    | 'Payment'
    | 'TrustSet'
    | 'NFTokenCreateOffer'
    | 'NFTokenCancelOffer'
    | 'NFTokenAcceptOffer'
    | 'NFTokenBurn'
    | 'AccountSet'
    | 'OfferCreate'
    | 'OfferCancel'
    | 'AccountDelete'
): BaseTransaction => ({
  TransactionType: txType,
  Account: wallet.publicAddress,
  ...(payload.fee && { Fee: payload.fee }),
  ...(payload.sequence && { Sequence: payload.sequence }),
  ...(payload.accountTxnID && { AccountTxnID: payload.accountTxnID }),
  ...(payload.lastLedgerSequence && { LastLedgerSequence: payload.lastLedgerSequence }),
  ...(payload.memos && { Memos: toXRPLMemos(payload.memos) }), // Each field of each memo is hex encoded
  ...(payload.signers && { Signers: toXRPLSigners(payload.signers) }),
  ...(payload.sourceTag && { SourceTag: payload.sourceTag }),
  ...(payload.signingPubKey && { SigningPubKey: payload.signingPubKey }),
  ...(payload.ticketSequence && { TicketSequence: payload.ticketSequence }),
  ...(payload.txnSignature && { TxnSignature: payload.txnSignature })
});
