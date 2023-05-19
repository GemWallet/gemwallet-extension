import {
  parseAmount,
  parseLimitAmount,
  parseMemos,
  parsePaymentFlags,
  parseTrustSetFlags
} from './parseFromString';

describe('parseAmount', () => {
  test('parse amount in drops', () => {
    expect(parseAmount('123')).toEqual('123');
  });
  test('parse amount in drops with decimals', () => {
    expect(parseAmount('123.456')).toEqual('123.456');
  });
  test('parse amount object', () => {
    expect(parseAmount('{"value":"123","issuer":"issuer","currency":"USD"}')).toEqual({
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
