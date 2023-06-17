import { parseBaseParamsFromURLParams } from './baseParams';

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
});
