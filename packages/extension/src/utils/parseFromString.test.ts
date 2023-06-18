import { NFTokenCreateOfferFlags, NFTokenMintFlags, NFTokenMintFlagsInterface } from 'xrpl';

import { Signer } from '@gemwallet/constants';

import {
  createNFTOfferFlagsToNumber,
  mintNFTFlagsToNumber,
  parseAmount,
  parseLimitAmount,
  parseMemos,
  parseMintNFTFlags,
  parsePaymentFlags,
  parseSigners,
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
});
