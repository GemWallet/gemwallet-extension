import { formatToken } from './format';

describe('Format util', () => {
  describe('formatToken', () => {
    test('should return 1,234,567 XRP', () => {
      const value = 1234567;
      expect(formatToken(value, 'XRP')).toEqual('1,234,567 XRP');
    });

    test('should return 1,234,567.8977 XRP', () => {
      const value = 1234567.8977;
      expect(formatToken(value, 'xrp')).toEqual('1,234,567.8977 XRP');
    });

    test('should return 1,234,567.8977', () => {
      const value = 1234567.8977;
      expect(formatToken(value, '')).toEqual('1,234,567.8977 ');
    });
  });
});
