import {
  APIMessages,
  IsConnectedResponse,
  NetworkResponse,
  PublicAddressResponse
} from '@gemwallet/constants';

declare global {
  interface Window {
    gemWallet?: boolean;
    GemWalletApi?: Record<string, any>;
  }
}

/**
 * Sends a message from the current window to the content script.
 *
 * @param msg The message to send.
 * @returns A Promise that resolves with the response from the content script.
 * @throws An error if GemWallet is not connected and the message type is not a connection request.
 */
export const sendMessageToContentScript = (msg: APIMessages): Promise<any> => {
  /* 
    In the case of multiple calls coming in sequentially, we use this MESSAGE_ID to make sure we're responding to
    the appropriate message sender. Otherwise, we can run into race conditions where we simply resolve all 
    sent messages with the first thing that comes back.
  */
  const messageId = Date.now() + Math.random();

  window.postMessage(
    {
      source: 'GEM_WALLET_MSG_REQUEST',
      messageId,
      ...serializeMessage(msg)
    },
    window.location.origin
  );

  return new Promise((resolve, reject) => {
    if (!window.gemWallet && msg.type !== 'REQUEST_CONNECTION') {
      reject(
        new Error(
          'Please check if GemWallet is connected - GemWallet needs to be installed: https://gemwallet.app'
        )
      );
    }

    const messageListener = (event: {
      source: any;
      data: NetworkResponse | PublicAddressResponse | IsConnectedResponse;
    }) => {
      // We only accept messages from ourselves
      if (event.source !== window) return;
      // Only respond to messages tagged as being from our content script
      if (event?.data?.source !== 'GEM_WALLET_MSG_RESPONSE') return;
      // Only respond to messages that this instance of sendMessageToContentScript sent
      if (event?.data?.messagedId !== messageId) return;

      resolve(event.data);
      window.removeEventListener('message', messageListener);
    };
    window.addEventListener('message', messageListener, false);
  });
};

/**
 * Serializes the message to be sent to the content script.
 * Fields that are objects are stringified:
 * - memos
 * - amount
 * - limitAmount
 * - flags
 *
 * @param msg
 * @returns The message with each object field stringified.
 */
const serializeMessage = (msg: APIMessages): any => {
  const modifiedMsg: any = { ...msg };
  if (modifiedMsg.payload?.memos) {
    modifiedMsg.payload.memos = JSON.stringify(modifiedMsg.payload.memos);
  }

  if (typeof modifiedMsg.payload?.amount === 'object') {
    modifiedMsg.payload.amount = JSON.stringify(modifiedMsg.payload.amount);
  }

  if (
    'payload' in modifiedMsg &&
    'limitAmount' in modifiedMsg.payload &&
    typeof modifiedMsg.payload.limitAmount === 'object'
  ) {
    modifiedMsg.payload.limitAmount = JSON.stringify(modifiedMsg.payload.limitAmount);
  }

  if (
    'payload' in modifiedMsg &&
    'flags' in modifiedMsg.payload &&
    typeof modifiedMsg.payload.flags === 'object'
  ) {
    modifiedMsg.payload.flags = JSON.stringify(modifiedMsg.payload.flags);
  }

  return modifiedMsg;
};
