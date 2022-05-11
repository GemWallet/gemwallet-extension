import { formatToken } from '.';

describe('Format util', () => {
  describe('formatToken', () => {
    test('should return XRP 1,234,567', () => {
      const value = 1234567;
      const token = 'XRP';
      const nonBreakingSpace = '\xa0';

      expect(formatToken(value, token)).toEqual(`${token}${nonBreakingSpace}1,234,567`);
    });

    test('should return XRP 1,234,567.8977', () => {
      const value = 1234567.8977;
      const token = 'XRP';
      const nonBreakingSpace = '\xa0';

      expect(formatToken(value, token)).toEqual(`${token}${nonBreakingSpace}1,234,567.8977`);
    });

    test('should return 1,234,567.8977', () => {
      const value = 1234567.8977;
      const nonBreakingSpace = '\xa0';

      expect(formatToken(value, '')).toEqual(`${nonBreakingSpace}1,234,567.8977`);
    });
  });
});
