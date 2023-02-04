import { GEM_WALLET, Message } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getNetwork } from './getNetwork';

jest.mock('../helpers/extensionMessaging', () => ({
  sendMessageToContentScript: jest.fn()
}));

describe('getNetwork', () => {
  it('should return network response when called', async () => {
    (sendMessageToContentScript as jest.Mock).mockResolvedValue({ network: 'testnet' });
    const network = await getNetwork();
    expect(network).toEqual('testnet');
    expect(sendMessageToContentScript).toHaveBeenCalledWith({
      app: GEM_WALLET,
      type: Message.RequestNetwork
    });
  });

  it('should throw an error when sendMessageToContentScript throws an error', async () => {
    (sendMessageToContentScript as jest.Mock).mockRejectedValue(new Error('Error'));
    await expect(getNetwork()).rejects.toThrow('Error');
  });
});
