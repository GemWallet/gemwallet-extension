import { truncateAddress } from '.';

describe('Truncate Address util', () => {
  describe('truncateAddress', () => {
    test('should return rJxo...UEdN', () => {
      expect(truncateAddress('rJxoHDLrT1soHXLJ6uwMs5opms1kuiUEdN')).toEqual('rJxo...UEdN');
    });
  });
});
