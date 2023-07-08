import { truncateWalletName } from './truncateWalletName';

describe('truncateWalletName', () => {
  it('should truncate the wallet name if it exceeds the maximum length', () => {
    const name = 'MyLongWalletName';
    const maxLength = 8;
    const truncatedName = truncateWalletName(name, maxLength);
    expect(truncatedName).toBe('MyLongWa...');
  });

  it('should not truncate the wallet name if it does not exceed the maximum length', () => {
    const name = 'ShortName';
    const maxLength = 10;
    const truncatedName = truncateWalletName(name, maxLength);
    expect(truncatedName).toBe('ShortName');
  });

  it('should return an empty string if the wallet name is empty', () => {
    const name = '';
    const maxLength = 5;
    const truncatedName = truncateWalletName(name, maxLength);
    expect(truncatedName).toBe('');
  });
});
