import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getPublicKey } from './getPublicKey';

jest.mock('../helpers/extensionMessaging', () => ({
  sendMessageToContentScript: jest.fn()
}));

describe('getPublicKey', () => {
  it('should return address response when called', async () => {
    (sendMessageToContentScript as jest.Mock).mockResolvedValue({
      result: {
        publicKey: 'fakeKey',
        address: 'fakeAddress'
      }
    });
    const address = await getPublicKey();
    expect(address).toEqual({
      result: {
        publicKey: 'fakeKey',
        address: 'fakeAddress'
      }
    });
  });

  it('should throw an error when sendMessageToContentScript throws an error', async () => {
    (sendMessageToContentScript as jest.Mock).mockRejectedValue(new Error('Error'));
    await expect(getPublicKey()).rejects.toThrow('Error');
  });
});
