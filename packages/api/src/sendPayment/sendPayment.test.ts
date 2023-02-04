import { PaymentRequestPayload, RequestPaymentMessage } from '@gemwallet/constants';

import { sendPayment } from './sendPayment';

const hash = '7CB690AE100B8294C13A2E925B7524B68FA14146382A68820BAEC6907D5267D7';

const errorThrownFromContentScript = 'errorThrownFromContentScript';

const payload: PaymentRequestPayload = {
  amount: '10',
  destination: 'rNvFCZXpDtGeQ3bVas95wGLN6N2stGmA9o'
};

jest.mock('../helpers/extensionMessaging', () => ({
  sendMessageToContentScript: async (message: RequestPaymentMessage) => {
    // Mock returning an error if payload destination = error
    if (message.payload.destination === 'refused') {
      return { hash: null };
    }
    // Mock throwing an error if payload destination = errorThrow
    if (message.payload.destination === 'errorThrow') {
      throw new Error(errorThrownFromContentScript);
    }
    return { hash };
  }
}));

describe('sendPayment api', () => {
  test('should return a transaction hash as sendMessageToContentScript is returning a hash', async () => {
    let response;
    // deepcode ignore PromiseNotCaughtGeneral/test: Promise used in unit test
    await sendPayment(payload).then((res) => {
      response = res;
    });
    expect(response).toEqual(hash);
  });

  test('should return an null if the user refused the payment', async () => {
    let response;
    payload.destination = 'refused';
    // deepcode ignore PromiseNotCaughtGeneral/test: Promise used in unit test
    await sendPayment(payload).then((res) => {
      response = res;
    });
    expect(response).toEqual(null);
  });

  test('should return an undefined if sendMessageToContentScript failed', async () => {
    let error;
    payload.destination = 'errorThrow';
    await sendPayment(payload)
      .then()
      .catch((e) => {
        error = e.message;
      });
    expect(error).toEqual(undefined);
  });
});
