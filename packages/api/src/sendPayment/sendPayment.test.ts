import { MessageListenerEvent, Payment } from '@gemwallet/constants';
import { sendPayment } from './sendPayment';

const hash = '7CB690AE100B8294C13A2E925B7524B68FA14146382A68820BAEC6907D5267D7';

const errorMessageFromContentScript = 'sendMessageToContentScriptError';
const errorThrownFromContentScript = 'errorThrownFromContentScript';

const payload: Payment = {
  amount: '10',
  destination: 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o'
};

jest.mock('../helpers/extensionMessaging', () => ({
  sendMessageToContentScript: async (message: MessageListenerEvent) => {
    // Mock returning an error if payload destination = error
    if (message.payload!.destination === 'error') {
      return { error: errorMessageFromContentScript };
    }
    // Mock throwing an error if payload destination = errorThrow
    if (message.payload!.destination === 'errorThrow') {
      throw new Error(errorThrownFromContentScript);
    }
    return { hash };
  }
}));

describe('sendPayment api', () => {
  test('should return a transaction hash as sendMessageToContentScript is returning a hash', async () => {
    let response;
    await sendPayment(payload).then((res) => {
      response = res;
    });
    expect(response).toEqual(hash);
  });

  test('should return an error if sendMessageToContentScript is returning an error', async () => {
    let error;
    payload.destination = 'error';
    await sendPayment(payload)
      .then()
      .catch((e) => {
        error = e.message;
      });
    expect(error).toEqual(errorMessageFromContentScript);
  });

  test('should return an error if sendMessageToContentScript failed', async () => {
    let error;
    payload.destination = 'errorThrow';
    await sendPayment(payload)
      .then()
      .catch((e) => {
        error = e.message;
      });
    expect(error).toEqual(errorThrownFromContentScript);
  });
});
