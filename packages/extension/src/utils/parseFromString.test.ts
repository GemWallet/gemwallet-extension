import { parseAmount, parseMemos, parsePaymentFlags, parseTrustSetFlags } from './parseFromString';

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

describe('parseMemos', () => {
  test('parse memos', () => {
    expect(parseMemos('[{"Memo":{"MemoData":"memo"}}]')).toEqual(
      [
        {
          Memo: {
            MemoData: 'memo'
          }
        }
      ]
    );
    expect(parseMemos('[{"Memo":{"MemoData":"memo","MemoType":"type","MemoFormat":"format"}},{"Memo":{"MemoData":"memo","MemoType":"type","MemoFormat":"format"}}]')).toEqual(
      [
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
      ]
    );
  });
});

describe('parsePaymentFlags', () => {
  test('parse flags', () => {
    expect(parsePaymentFlags('123')).toEqual(123);
  });
  test('parse flags object', () => {
    expect(parsePaymentFlags('{"tfNoDirectRipple":true,"tfPartialPayment":true,"tfLimitQuality":false}')).toEqual({
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
    expect(parseTrustSetFlags('{"tfSetfAuth":true,"tfSetNoRipple":false,"tfClearNoRipple":true,"tfSetFreeze":true,"tfClearFreeze":true}')).toEqual({
      tfSetfAuth: true,
      tfSetNoRipple: false,
      tfClearNoRipple: true,
      tfSetFreeze: true,
      tfClearFreeze: true
    });
  });
});
