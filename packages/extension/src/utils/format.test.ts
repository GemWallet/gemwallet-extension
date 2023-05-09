import { xrpToDrops } from 'xrpl';

import { formatAmount } from './format';

describe('Format util', () => {
  describe('formatAmount', () => {
    test('should return 1,234,567 XRP', () => {
      const amount = xrpToDrops(1234567);
      expect(formatAmount(amount)).toEqual('1,234,567 XRP');
    });

    test('should return 1,234,567.8977 XRP', () => {
      const amount = xrpToDrops(1234567.8977);
      expect(formatAmount(amount)).toEqual('1,234,567.8977 XRP');
    });

    test('should return 1,234,567.8977 USD', () => {
      const amount = {
        value: '1234567.8977',
        currency: 'USD',
        issuer: 'fake'
      };
      expect(formatAmount(amount)).toEqual('1,234,567.8977 USD');
    });
  });
});
