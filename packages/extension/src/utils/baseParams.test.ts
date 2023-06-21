import {
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from './baseParams';

describe('parseBaseParamsFromURLParams', () => {
  it('should return the parsed base parameters from URL params', () => {
    const params = new URLSearchParams({
      fee: '20',
      sequence: '10',
      accountTxnID: 'id',
      lastLedgerSequence: '500',
      memos: JSON.stringify([{ type: 'text', data: 'test' }]),
      signers: JSON.stringify([
        { signer: { account: 'account1', txnSignature: 'sig', signingPubKey: 'key' } }
      ]),
      sourceTag: '0',
      signingPubKey: 'publicKey',
      ticketSequence: '1',
      txnSignature: 'signature'
    });

    // assuming checkFee, parseMemos, parseSigners work as expected
    const result = {
      fee: '20',
      sequence: 10,
      accountTxnID: 'id',
      lastLedgerSequence: 500,
      memos: [{ type: 'text', data: 'test' }],
      signers: [{ signer: { account: 'account1', txnSignature: 'sig', signingPubKey: 'key' } }],
      sourceTag: 0,
      signingPubKey: 'publicKey',
      ticketSequence: 1,
      txnSignature: 'signature'
    };

    expect(parseBaseParamsFromURLParams(params)).toEqual(result);
  });

  test('should handle null or undefined URL parameters', () => {
    const urlParams = new URLSearchParams();

    const result = parseBaseParamsFromURLParams(urlParams);

    expect(result).toEqual(initialBaseTransactionParams);
  });
});

describe('getBaseFromParams', () => {
  test('should get base transaction parameters from an object', () => {
    const params = {
      fee: '10',
      sequence: 1,
      accountTxnID: '123',
      lastLedgerSequence: 100,
      memos: ['memo1', 'memo2'],
      signers: ['signer1', 'signer2'],
      sourceTag: 2,
      signingPubKey: 'publicKey',
      ticketSequence: 3,
      txnSignature: 'signature'
    };

    const result = getBaseFromParams(params);

    expect(result).toEqual(params);
  });

  test('should handle undefined parameters', () => {
    const params = {};

    const result = getBaseFromParams(params);

    expect(result).toEqual({
      fee: undefined,
      sequence: undefined,
      accountTxnID: undefined,
      lastLedgerSequence: undefined,
      memos: undefined,
      signers: undefined,
      sourceTag: undefined,
      signingPubKey: undefined,
      ticketSequence: undefined,
      txnSignature: undefined
    });
  });
});
