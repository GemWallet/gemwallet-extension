import { Path } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';
import { NFTokenMint } from 'xrpl/dist/npm/models/transactions/NFTokenMint';

import {
  CancelOfferRequest,
  CreateOfferRequest,
  MintNFTRequest,
  SendPaymentRequest
} from '@gemwallet/constants';

import { WalletLedger } from '../../../types';
import {
  buildAccountSet,
  buildBaseTransaction,
  buildNFTokenAcceptOffer,
  buildNFTokenBurn,
  buildNFTokenCancelOffer,
  buildNFTokenCreateOffer,
  buildNFTokenMint,
  buildOfferCancel,
  buildOfferCreate,
  buildPayment,
  buildTrustSet
} from './buildXRPLTransaction';

const wallet: WalletLedger = {
  name: 'name',
  publicAddress: 'publicAddress',
  wallet: {} as any
};

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
});

describe('buildNFTokenMint', () => {
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

describe('buildOfferCreate', () => {
  it('should build OfferCreate correctly', () => {
    const takerGets: Amount = '100';

    const takerPays: Amount = {
      currency: 'USD',
      value: '200',
      issuer: 'rUsDIssuer'
    };

    const params: CreateOfferRequest = {
      takerGets,
      takerPays,
      expiration: 567,
      offerSequence: 123
    };

    const result = buildOfferCreate(params, wallet);

    expect(result.TransactionType).toEqual('OfferCreate');
    expect(result.Account).toEqual('publicAddress');
    expect(result.Expiration).toEqual(567);
    expect(result.OfferSequence).toEqual(123);
    expect(result.TakerGets).toEqual(takerGets);
    expect(result.TakerPays).toEqual(takerPays);
    expect(result.Flags).toBeUndefined();
  });
});

describe('buildAccountSet', () => {
  it('should build AccountSet with all optional fields provided', () => {
    const params = {
      flags: 123456,
      clearFlag: 2,
      domain: 'example.com',
      emailHash: 'abc123',
      messageKey: 'msgKey',
      setFlag: 1,
      transferRate: 1000,
      tickSize: 10,
      NFTokenMinter: 'minterAddress'
    };

    const expectedResult = {
      Flags: 123456,
      ClearFlag: 2,
      Domain: 'example.com',
      EmailHash: 'abc123',
      MessageKey: 'msgKey',
      SetFlag: 1,
      TransferRate: 1000,
      TickSize: 10,
      NFTokenMinter: 'minterAddress',
      TransactionType: 'AccountSet',
      Account: 'publicAddress'
    };

    expect(buildAccountSet(params, wallet)).toEqual(expectedResult);
  });

  it('should build AccountSet with some optional fields omitted', () => {
    const params = {
      flags: 123456,
      domain: 'example.com',
      emailHash: 'abc123'
    };

    const expectedResult = {
      Flags: 123456,
      Domain: 'example.com',
      EmailHash: 'abc123',
      TransactionType: 'AccountSet',
      Account: 'publicAddress'
    };

    expect(buildAccountSet(params, wallet)).toEqual(expectedResult);
  });
});

describe('buildTrustSet', () => {
  it('should build a TrustSet transaction with flags', () => {
    const params = {
      limitAmount: { currency: 'USD', value: '100', issuer: 'rSomeIssuer' },
      flags: 131072
    };

    const result = buildTrustSet(params, wallet as any);
    expect(result).toMatchObject({
      LimitAmount: params.limitAmount,
      Flags: params.flags
    });
  });

  it('should build a TrustSet transaction without flags', () => {
    const params = {
      limitAmount: { currency: 'USD', value: '100', issuer: 'rSomeIssuer' }
    };
    const result = buildTrustSet(params, wallet as any);
    expect(result).toMatchObject({
      LimitAmount: params.limitAmount
    });
    expect(result.Flags).toBeUndefined();
  });
});

describe('buildPayment', () => {
  it('should build Payment transaction with all fields', () => {
    const params = {
      amount: '1000',
      destination: 'rDestination',
      destinationTag: 1234,
      invoiceID: 'invoice123',
      paths: [[{ account: 'rAccount', currency: 'XRP', issuer: 'rIssuer' }]] as Path[],
      sendMax: '2000',
      deliverMin: '900'
    };

    const result = buildPayment(params, wallet);

    expect(result.TransactionType).toEqual('Payment');
    expect(result.Account).toEqual(wallet.publicAddress);
    expect(result.Amount).toEqual(params.amount);
    expect(result.Destination).toEqual(params.destination);
    expect(result.DestinationTag).toEqual(params.destinationTag);
    expect(result.InvoiceID).toEqual(params.invoiceID);
    expect(result.Paths).toEqual(params.paths);
    expect(result.SendMax).toEqual(params.sendMax);
    expect(result.DeliverMin).toEqual(params.deliverMin);
  });

  it('should build Payment transaction with only mandatory fields', () => {
    const params: SendPaymentRequest = {
      amount: '1000',
      destination: 'rDestination'
    };

    const result = buildPayment(params, wallet);

    expect(result.TransactionType).toEqual('Payment');
    expect(result.Account).toEqual(wallet.publicAddress);
    expect(result.Amount).toEqual(params.amount);
    expect(result.Destination).toEqual(params.destination);
    expect(result.DestinationTag).toBeUndefined();
    expect(result.InvoiceID).toBeUndefined();
    expect(result.Paths).toBeUndefined();
    expect(result.SendMax).toBeUndefined();
    expect(result.DeliverMin).toBeUndefined();
    expect(result.Flags).toBeUndefined();
  });
});
