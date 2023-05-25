import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getAddress } from './getAddress';

jest.mock('../helpers/extensionMessaging', () => ({
  sendMessageToContentScript: jest.fn()
}));

describe('getAddress', () => {
  it('should return address response when called', async () => {
    (sendMessageToContentScript as jest.Mock).mockResolvedValue({
      result: { publicAddress: 'fake' }
    });
    const address = await getAddress();
    expect(address).toEqual({ result: { publicAddress: 'fake' } });
  });

  it('should throw an error when sendMessageToContentScript throws an error', async () => {
    (sendMessageToContentScript as jest.Mock).mockRejectedValue(new Error('Error'));
    await expect(getAddress()).rejects.toThrow('Error');
  });
});
