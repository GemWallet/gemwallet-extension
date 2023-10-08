import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import { CancelOfferRequest } from '@gemwallet/constants';
import { MintNFTRequest } from '@gemwallet/constants';

import {
  buildBaseTransaction,
  buildNFTokenAcceptOffer,
  buildNFTokenBurn,
  buildNFTokenCancelOffer,
  buildNFTokenCreateOffer,
  buildNFTokenMint,
  buildOfferCancel
} from './buildXRPLTransaction';

describe('buildBaseTransaction', () => {
  it('should build base transaction correctly', () => {
    const payload = {
      fee: '100',
      sequence: 1,
      accountTxnID: 'txn123',
      lastLedgerSequence: 1000
    };

    const txType = 'Payment';
    const result = buildBaseTransaction(payload, wallet, txType);

    expect(result.TransactionType).toEqual(txType);
    expect(result.Account).toEqual(wallet.publicAddress);
    expect(result.Fee).toEqual('100');
    expect(result.Sequence).toEqual(1);
    expect(result.AccountTxnID).toEqual('txn123');
    expect(result.LastLedgerSequence).toEqual(1000);
  });
});

describe('buildNFTokenAcceptOffer', () => {
  it('should build NFTokenAcceptOffer correctly', () => {
    const params = {
      NFTokenSellOffer: 'sellOffer',
      NFTokenBuyOffer: 'buyOffer',
      NFTokenBrokerFee: 'brokerFee'
    };

    const result = buildNFTokenAcceptOffer(params, wallet);

    expect(result.TransactionType).toEqual('NFTokenAcceptOffer');
    expect(result.Account).toEqual('publicAddress');
    expect(result.NFTokenSellOffer).toEqual('sellOffer');
    expect(result.NFTokenBuyOffer).toEqual('buyOffer');
    expect(result.NFTokenBrokerFee).toEqual('brokerFee');
  });
});

describe('buildNFTokenBurn', () => {
  it('should build NFTokenBurn with NFTokenID and Owner correctly', () => {
    const params = {
      NFTokenID: 'tokenId',
      owner: 'ownerAddress'
    };

    const result = buildNFTokenBurn(params, wallet);

    expect(result.NFTokenID).toEqual('tokenId');
    expect(result.Owner).toEqual('ownerAddress');

    const result2 = buildNFTokenBurn({ NFTokenID: 'tokenId' }, wallet);
    expect(result2.NFTokenID).toEqual('tokenId');
    expect(result2.Owner).toEqual(undefined);
  });
});

describe('buildNFTokenCancelOffer', () => {
  it('should build NFTokenCancelOffer correctly', () => {
    const params = {
      NFTokenOffers: ['offer1', 'offer2']
    };

    const result = buildNFTokenCancelOffer(params, wallet);

    expect(result.NFTokenOffers).toEqual(['offer1', 'offer2']);
  });
});

describe('buildNFTokenCreateOffer', () => {
  it('should build NFTokenCreateOffer with all optional fields provided', () => {
    const params = {
      NFTokenID: 'tokenId',
      amount: '1000',
      owner: 'ownerAddress',
      expiration: 123456,
      destination: 'destinationAddress'
    };

    const result = buildNFTokenCreateOffer(params, wallet);

    expect(result.NFTokenID).toEqual('tokenId');
    expect(result.Amount).toEqual('1000');
    expect(result.Owner).toEqual('ownerAddress');
    expect(result.Expiration).toEqual(123456);
    expect(result.Destination).toEqual('destinationAddress');
    expect(result.Flags).toBeUndefined();
  });

  it('should build NFTokenMint with given parameters', () => {
    const params: MintNFTRequest = {
      NFTokenTaxon: 0,
      issuer: 'rXYZ...',
      transferFee: 10,
      URI: 'someURI',
      flags: 0
    };

    const result: NFTokenMint = buildNFTokenMint(params, wallet);

    expect(result.NFTokenTaxon).toEqual(params.NFTokenTaxon);
    expect(result.Issuer).toEqual(params.issuer);
    expect(result.TransferFee).toEqual(params.transferFee);
    expect(result.URI).toEqual(params.URI);
    expect(result.Flags).toEqual(params.flags);
  });
});

describe('buildOfferCancel', () => {
  it('should build OfferCancel correctly', () => {
    const params: CancelOfferRequest = {
      offerSequence: 123
    };

    const result = buildOfferCancel(params, wallet);

    expect(result.TransactionType).toEqual('OfferCancel');
    expect(result.Account).toEqual('publicAddress');
    expect(result.OfferSequence).toEqual(123);
  });
});
