import { truncateAddress } from '.';

describe('Truncate Address util', () => {
  describe('truncateAddress', () => {
    test('should return rJxo...iUEd', () => {
      expect(truncateAddress('rJxoHDLrT1soHXLJ6uwMs5opms1kuiUEdN')).toEqual('rJxo...iUEd');
    });
  });
});
