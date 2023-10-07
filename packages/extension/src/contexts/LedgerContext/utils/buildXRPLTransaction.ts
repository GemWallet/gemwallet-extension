import { NFTokenAcceptOffer, NFTokenBurn, NFTokenCancelOffer, NFTokenCreateOffer } from 'xrpl';
import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common';
import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import {
  AcceptNFTOfferRequest,
  BaseTransactionRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest,
  CreateNFTOfferRequest,
  MintNFTRequest
} from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import {
  createNFTOfferFlagsToNumber,
  handleAmountHexCurrency,
  mintNFTFlagsToNumber,
  toXRPLMemos,
  toXRPLSigners
} from '../../../utils';

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

export const buildNFTokenCreateOffer = (
  params: CreateNFTOfferRequest,
  wallet: WalletLedger
): NFTokenCreateOffer => {
  // Need to send the flags as number to xrpl.js, otherwise they won't be recognized
  const formattedFlags =
    params.flags && typeof params.flags === 'object'
      ? createNFTOfferFlagsToNumber(params.flags)
      : params.flags;

  handleAmountHexCurrency(params.amount);

  return {
    ...(buildBaseTransaction(params, wallet, 'NFTokenCreateOffer') as NFTokenCreateOffer),
    ...(params.NFTokenID && { NFTokenID: params.NFTokenID }),
    ...(params.amount && { Amount: params.amount }),
    ...(params.owner && { Owner: params.owner }),
    ...(params.expiration && { Expiration: params.expiration }),
    ...(params.destination && { Destination: params.destination }),
    Flags: formattedFlags
  };
};

export const buildNFTokenMint = (params: MintNFTRequest, wallet: WalletLedger): NFTokenMint => {
  // Need to send the flags as number to xrpl.js, otherwise they won't be recognized
  const formattedFlags =
    params.flags && typeof params.flags === 'object'
      ? mintNFTFlagsToNumber(params.flags)
      : params.flags;

  return {
    ...(buildBaseTransaction(params, wallet, 'NFTokenMint') as NFTokenMint),
    NFTokenTaxon: params.NFTokenTaxon,
    ...(params.issuer && { Issuer: params.issuer }),
    ...(params.transferFee && { TransferFee: params.transferFee }),
    ...(params.URI && { URI: params.URI }),
    Flags: formattedFlags
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
