import { WalletLedger } from '../../../types';
import {
  buildBaseTransaction,
  buildNFTokenAcceptOffer,
  buildNFTokenBurn,
  buildNFTokenCancelOffer
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
