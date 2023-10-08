import { WalletLedger } from '../../../types';
import { buildBaseTransaction, buildNFTokenAcceptOffer } from './buildXRPLTransaction';

describe('buildBaseTransaction', () => {
  it('should build base transaction correctly', () => {
    const payload = {
      fee: '100',
      sequence: 1,
      accountTxnID: 'txn123',
      lastLedgerSequence: 1000
    };

    const wallet: WalletLedger = {
      name: 'name',
      publicAddress: 'publicAddress',
      wallet: {} as any
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

    const wallet: WalletLedger = {
      name: 'name',
      publicAddress: 'publicAddress',
      wallet: {} as any
    };

    const result = buildNFTokenAcceptOffer(params, wallet);

    expect(result.TransactionType).toEqual('NFTokenAcceptOffer');
    expect(result.Account).toEqual('publicAddress');
    expect(result.NFTokenSellOffer).toEqual('sellOffer');
    expect(result.NFTokenBuyOffer).toEqual('buyOffer');
    expect(result.NFTokenBrokerFee).toEqual('brokerFee');
  });
});
