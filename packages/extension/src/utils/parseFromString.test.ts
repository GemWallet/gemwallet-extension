import { NFTokenCreateOfferFlags, NFTokenMintFlags, NFTokenMintFlagsInterface } from 'xrpl';

import { Signer, TransactionWithID } from '@gemwallet/constants';

import {
  createNFTOfferFlagsToNumber,
  mintNFTFlagsToNumber,
  parseAmount,
  parseArray,
  parseCreateOfferFlags,
  parseLimitAmount,
  parseMemos,
  parseMintNFTFlags,
  parsePaymentFlags,
  parseSetAccountFlags,
  parseSigners,
  parseTransactionParam,
  parseTransactionsBulkMap,
  parseTrustSetFlags
} from './parseFromString';

describe('parseAmount', () => {
  test('parse amount in drops', () => {
    expect(parseAmount('123', null, null, '')).toEqual('123');
  });
  test('parse amount in drops with decimals', () => {
    expect(parseAmount('123.456', null, null, '')).toEqual('123.456');
  });
  test('parse amount object', () => {
    expect(
      parseAmount('{"value":"123","issuer":"issuer","currency":"USD"}', null, null, '')
    ).toEqual({
      value: '123',
      issuer: 'issuer',
      currency: 'USD'
    });
  });
});

describe('parseLimitAmount', () => {
  it('should return null if all parameters are null', () => {
    expect(parseLimitAmount(null, null, null, null)).toBeNull();
  });

  it('should return parsed object if amountString is valid JSON string', () => {
    const amountString = JSON.stringify({
      value: '100',
      currency: 'USD',
      issuer: 'Issuer1'
    });
    expect(parseLimitAmount(amountString, null, null, null)).toEqual({
      value: '100',
      currency: 'USD',
      issuer: 'Issuer1'
    });
  });

  it('should return null if amountString is invalid JSON string', () => {
    const amountString = 'invalid JSON string';
    expect(parseLimitAmount(amountString, null, null, null)).toBeNull();
  });

  it('should return null if amountString is a valid JSON string but not the correct format', () => {
    const amountString = JSON.stringify({ a: '1', b: '2', c: '3' });
    expect(parseLimitAmount(amountString, null, null, null)).toBeNull();
  });

  it('should return deprecated values if amountString is null and deprecated values are not null', () => {
    expect(parseLimitAmount(null, '200', 'EUR', 'Issuer2')).toEqual({
      value: '200',
      currency: 'EUR',
      issuer: 'Issuer2'
    });
  });

  it('should return null if amountString is null and any deprecated value is null', () => {
    expect(parseLimitAmount(null, '200', null, 'Issuer2')).toBeNull();
  });
});

describe('parseMemos', () => {
  test('parse memos', () => {
    expect(parseMemos('[{"Memo":{"MemoData":"memo"}}]')).toEqual([
      {
        Memo: {
          MemoData: 'memo'
        }
      }
    ]);
    expect(
      parseMemos(
        '[{"Memo":{"MemoData":"memo","MemoType":"type","MemoFormat":"format"}},{"Memo":{"MemoData":"memo","MemoType":"type","MemoFormat":"format"}}]'
      )
    ).toEqual([
      {
        Memo: {
          MemoData: 'memo',
          MemoType: 'type',
          MemoFormat: 'format'
        }
      },
      {
        Memo: {
          MemoData: 'memo',
          MemoType: 'type',
          MemoFormat: 'format'
        }
      }
    ]);
  });
});

describe('parseSigners', () => {
  it('should return null when input is null', () => {
    expect(parseSigners(null)).toBeNull();
  });

  it('should return null when input is an empty string', () => {
    expect(parseSigners('')).toBeNull();
  });

  it('should return null when input is not a valid JSON string', () => {
    expect(parseSigners('invalidJSON')).toBeNull();
  });

  it('should return null when input is a valid JSON string but not an array', () => {
    expect(parseSigners('{"key": "value"}')).toBeNull();
  });

  it('should return parsed signers when input is a valid JSON string of signers array', () => {
    const signers: Signer[] = [
      {
        signer: {
          account: 'account1',
          txnSignature: 'txnSignature1',
          signingPubKey: 'signingPubKey1'
        }
      },
      {
        signer: {
          account: 'account2',
          txnSignature: 'txnSignature2',
          signingPubKey: 'signingPubKey2'
        }
      }
    ];

    expect(parseSigners(JSON.stringify(signers))).toEqual(signers);
  });
});

describe('parsePaymentFlags', () => {
  test('parse flags', () => {
    expect(parsePaymentFlags('123')).toEqual(123);
  });
  test('parse flags object', () => {
    expect(
      parsePaymentFlags('{"tfNoDirectRipple":true,"tfPartialPayment":true,"tfLimitQuality":false}')
    ).toEqual({
      tfNoDirectRipple: true,
      tfPartialPayment: true,
      tfLimitQuality: false
    });
  });
});

describe('parseTrustSetFlags', () => {
  test('parse flags', () => {
    expect(parsePaymentFlags('123')).toEqual(123);
  });
  test('parse flags object', () => {
    expect(
      parseTrustSetFlags(
        '{"tfSetfAuth":true,"tfSetNoRipple":false,"tfClearNoRipple":true,"tfSetFreeze":true,"tfClearFreeze":true}'
      )
    ).toEqual({
      tfSetfAuth: true,
      tfSetNoRipple: false,
      tfClearNoRipple: true,
      tfSetFreeze: true,
      tfClearFreeze: true
    });
  });
});

describe('parseMintNFTFlags', () => {
  test('parse flags', () => {
    expect(parseMintNFTFlags('123')).toEqual(123);
  });

  test('parse flags object', () => {
    expect(
      parseMintNFTFlags(
        '{"tfBurnable":false,"tfOnlyXRP":false,"tfTrustLine":true,"tfTransferable":true}'
      )
    ).toEqual({
      tfBurnable: false,
      tfOnlyXRP: false,
      tfTrustLine: true,
      tfTransferable: true
    });
  });
});

describe('parseCreateOfferFlags', () => {
  test('should return null when flagsString is null', () => {
    const result = parseCreateOfferFlags(null);
    expect(result).toBeNull();
  });

  test('should return a number when flagsString is a numeric string', () => {
    const result = parseCreateOfferFlags('123');
    expect(result).toBe(123);
  });

  test('should return parsed object when flagsString is valid json', () => {
    const result = parseCreateOfferFlags(
      JSON.stringify({ tfPassive: true, tfImmediateOrCancel: false })
    );
    expect(result).toEqual({ tfPassive: true, tfImmediateOrCancel: false });
  });

  test('should return null when flagsString is invalid json', () => {
    const result = parseCreateOfferFlags('{ tfPassive: true, tfImmediateOrCancel: false }');
    expect(result).toBeNull();
  });

  test('should return null when flagsString does not contain any expected keys', () => {
    const result = parseCreateOfferFlags(JSON.stringify({ tfUnknownKey: true }));
    expect(result).toBeNull();
  });
});

describe('mintNFTFlagsToNumber', () => {
  it('should return 0 when all flags are false', () => {
    const flags: NFTokenMintFlagsInterface = {
      tfBurnable: false,
      tfOnlyXRP: false,
      tfTrustLine: false,
      tfTransferable: false
    };

    expect(mintNFTFlagsToNumber(flags)).toBe(0);
  });

  it('should return correct number when all flags are true', () => {
    const flags: NFTokenMintFlagsInterface = {
      tfBurnable: true,
      tfOnlyXRP: true,
      tfTrustLine: true,
      tfTransferable: true
    };

    const expectedResult =
      NFTokenMintFlags.tfBurnable |
      NFTokenMintFlags.tfOnlyXRP |
      NFTokenMintFlags.tfTrustLine |
      NFTokenMintFlags.tfTransferable;
    expect(mintNFTFlagsToNumber(flags)).toBe(expectedResult);
  });

  it('should return correct number when some flags are true', () => {
    const flags: NFTokenMintFlagsInterface = {
      tfBurnable: false,
      tfOnlyXRP: true,
      tfTrustLine: false,
      tfTransferable: true
    };

    const expectedResult = NFTokenMintFlags.tfOnlyXRP | NFTokenMintFlags.tfTransferable;
    expect(mintNFTFlagsToNumber(flags)).toBe(expectedResult);
  });

  it('should return 0 when flags are not provided', () => {
    const flags: NFTokenMintFlagsInterface = {};
    expect(mintNFTFlagsToNumber(flags)).toBe(0);
  });
});

describe('createNFTOfferFlagsToNumber', () => {
  test('should return 0 for empty flags', () => {
    const flags = {};
    const result = createNFTOfferFlagsToNumber(flags);
    expect(result).toBe(0);
  });

  test('should return correct number for tfSellNFToken flag', () => {
    const flags = {
      tfSellNFToken: true
    };
    const result = createNFTOfferFlagsToNumber(flags);
    expect(result).toBe(NFTokenCreateOfferFlags.tfSellNFToken);
  });

  test('should return 0 if flag value is false', () => {
    const flags = {
      tfSellNFToken: false
    };
    const result = createNFTOfferFlagsToNumber(flags);
    expect(result).toBe(0);
  });

  describe('parseArray', () => {
    it('should return a string array when input is a valid JSON array', () => {
      const input = '["element1", "element2"]';
      const result = parseArray(input);
      expect(result).toEqual(['element1', 'element2']);
    });

    it('should return null when input is not a valid JSON', () => {
      const input = 'not a valid JSON';
      const result = parseArray(input);
      expect(result).toBeNull();
    });

    it('should return null when input is a non-array JSON', () => {
      const input = '{"key": "value"}';
      const result = parseArray(input);
      expect(result).toBeNull();
    });

    it('should return null when input is null', () => {
      const result = parseArray(null);
      expect(result).toBeNull();
    });
  });

  describe('parseSetAccountFlags', () => {
    it('returns null if input is null', () => {
      const result = parseSetAccountFlags(null);
      expect(result).toBeNull();
    });

    it('returns a number if input is a numeric string', () => {
      const result = parseSetAccountFlags('12345');
      expect(result).toBe(12345);
    });

    it('returns parsed flags object if input is a valid flags JSON string', () => {
      const validFlags = '{"tfRequireDestTag": true, "tfAllowXRP": false}';
      const result = parseSetAccountFlags(validFlags);
      expect(result).toEqual({
        tfRequireDestTag: true,
        tfAllowXRP: false
      });
    });

    it('returns null if input is an invalid flags JSON string', () => {
      const invalidFlags = '{"invalidFlag": true}';
      const result = parseSetAccountFlags(invalidFlags);
      expect(result).toBeNull();
    });

    it('returns null if input is a non-JSON string', () => {
      const result = parseSetAccountFlags('nonJsonString');
      expect(result).toBeNull();
    });
  });
});

describe('parseTransactionParam', () => {
  it('should return null if the input is null', () => {
    expect(parseTransactionParam(null)).toBe(null);
  });

  it('should return null if the input is an empty string', () => {
    expect(parseTransactionParam('')).toBe(null);
  });

  it('should return null if the input is not valid JSON', () => {
    expect(parseTransactionParam('This is not a JSON string')).toBe(null);
  });

  it('should return a Transaction object if the input is a valid JSON string representing a Transaction', () => {
    const transactionJson = '{"id": "123", "amount": 456}';
    const expectedTransaction = { id: '123', amount: 456 };

    expect(parseTransactionParam(transactionJson)).toEqual(expectedTransaction);
  });

  it('should return null if the input is a JSON string representing a non-object value', () => {
    const notAnObject = '"This is a JSON string, but not an object"';

    expect(parseTransactionParam(notAnObject)).toBe(null);
  });
});

describe('parseTransactionsBulkMap', () => {
  it('should return null if input is null', () => {
    expect(parseTransactionsBulkMap(null)).toBeNull();
  });

  it('should return the same object if it is of type Record<number, TransactionWithID>', () => {
    const mockTransaction = { id: '123', amount: 456 };
    const input: Record<number, TransactionWithID> = { 0: mockTransaction as any };

    expect(parseTransactionsBulkMap(input)).toEqual(input);
  });

  it('should return the object even if it does not strictly match Record<number, TransactionWithID>', () => {
    const input = { key: 'value' }; // This doesn't match the type but our function should still return it

    expect(parseTransactionsBulkMap(input as any)).toEqual(input);
  });
});
