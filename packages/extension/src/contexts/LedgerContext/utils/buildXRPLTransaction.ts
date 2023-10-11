import {
  AccountSet,
  NFTokenAcceptOffer,
  NFTokenBurn,
  NFTokenCancelOffer,
  NFTokenCreateOffer,
  OfferCancel,
  OfferCreate,
  Payment,
  TrustSet,
  SetRegularKey
} from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { BaseTransaction } from 'xrpl/dist/npm/models/transactions/common';
import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import {
  AcceptNFTOfferRequest,
  BaseTransactionRequest,
  BurnNFTRequest,
  CancelNFTOfferRequest,
  CancelOfferRequest,
  CreateNFTOfferRequest,
  CreateOfferRequest,
  MintNFTRequest,
  SendPaymentRequest,
  SetAccountRequest,
  SetTrustlineRequest,
  SetRegularKeyRequest
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
    ...(formattedFlags !== undefined && { Flags: formattedFlags })
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
    ...(formattedFlags !== undefined && { Flags: formattedFlags })
  };
};

export const buildOfferCancel = (params: CancelOfferRequest, wallet: WalletLedger): OfferCancel => {
  return {
    ...(buildBaseTransaction(params, wallet, 'OfferCancel') as OfferCancel),
    OfferSequence: params.offerSequence
  };
};

export const buildOfferCreate = (params: CreateOfferRequest, wallet: WalletLedger): OfferCreate => {
  handleAmountHexCurrency(params.takerGets as Amount);
  handleAmountHexCurrency(params.takerPays as Amount);

  return {
    ...(buildBaseTransaction(params, wallet, 'OfferCreate') as OfferCreate),
    ...(params.expiration && { Expiration: params.expiration }),
    ...(params.offerSequence && { OfferSequence: params.offerSequence }),
    ...(params.takerGets && { TakerGets: params.takerGets }),
    ...(params.takerPays && { TakerPays: params.takerPays }),
    ...(params.flags !== undefined && { Flags: params.flags })
  };
};

export const buildPayment = (params: SendPaymentRequest, wallet: WalletLedger): Payment => {
  handleAmountHexCurrency(params.amount);

  return {
    ...(buildBaseTransaction(params, wallet, 'Payment') as Payment),
    Amount: params.amount,
    Destination: params.destination,
    ...(params.destinationTag && { DestinationTag: params.destinationTag }),
    ...(params.invoiceID && { InvoiceID: params.invoiceID }),
    ...(params.paths && { Paths: params.paths }),
    ...(params.sendMax && { SendMax: params.sendMax }),
    ...(params.deliverMin && { DeliverMin: params.deliverMin }),
    ...(params.flags !== undefined && { Flags: params.flags })
  };
};

export const buildAccountSet = (params: SetAccountRequest, wallet: WalletLedger): AccountSet => {
  return {
    ...(buildBaseTransaction(params, wallet, 'AccountSet') as AccountSet),
    ...(params.flags !== undefined && { Flags: params.flags }),
    ...(params.clearFlag && { ClearFlag: params.clearFlag }),
    ...(params.domain && { Domain: params.domain }),
    ...(params.emailHash && { EmailHash: params.emailHash }),
    ...(params.messageKey && { MessageKey: params.messageKey }),
    ...(params.setFlag && { SetFlag: params.setFlag }),
    ...(params.transferRate && { TransferRate: params.transferRate }),
    ...(params.tickSize && { TickSize: params.tickSize }),
    ...(params.NFTokenMinter && { NFTokenMinter: params.NFTokenMinter })
  };
};

export const buildTrustSet = (params: SetTrustlineRequest, wallet: WalletLedger): TrustSet => {
  handleAmountHexCurrency(params.limitAmount);

  return {
    ...(buildBaseTransaction(params, wallet, 'TrustSet') as TrustSet),
    LimitAmount: params.limitAmount,
    ...(params.qualityIn !== undefined && { QualityIn: params.qualityIn }),
    ...(params.qualityOut !== undefined && { QualityOut: params.qualityOut }),
    ...(params.flags !== undefined && { Flags: params.flags })
  };
};

export const buildSetRegularKey = (
  params: SetRegularKeyRequest,
  wallet: WalletLedger
): SetRegularKey => {
  return {
    ...(buildBaseTransaction(params, wallet, 'SetRegularKey') as SetRegularKey),
    ...(params.regularKey && { RegularKey: params.regularKey })
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
    | 'SetRegularKey'
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
