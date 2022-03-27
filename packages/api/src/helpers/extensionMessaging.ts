import { MSG_REQUEST, MSG_RESPONSE } from '../constants/message';
import {
  MessageListenerEvent,
  NetworkResponse,
  IsConnectedResponse
} from '../constants/message.types';

declare global {
  interface Window {
    gemWallet?: boolean;
    gemWalletApi?: { [key: string]: any };
  }
}

/*
 * Send message from current window to content script, for example API to content script
 */
export const sendMessageToContentScript = (msg: MessageListenerEvent): Promise<any> => {
  /* 
    In the case of multiple calls coming in sequentially, we use this MESSAGE_ID to make sure we're responding to
    the appropriate message sender. Otherwise, we can run into race conditions where we simply resolve all 
    sent messages with the first thing that comes back.
  */
  const MESSAGE_ID = Date.now() + Math.random();

  window.postMessage(
    {
      source: MSG_REQUEST,
      messageId: MESSAGE_ID,
      ...msg
    },
    window.location.origin
  );

  return new Promise((resolve, reject) => {
    if (!window.gemWallet && msg.type !== 'REQUEST_CONNECTION') {
      reject(
        new Error(
          'Please check if Gem Wallet is connected \n Gem Wallet needs to be installed: https://gemwallet.app'
        )
      );
    }

    const messageListener = (event: {
      source: any;
      data: NetworkResponse | IsConnectedResponse;
    }) => {
      // We only accept messages from ourselves
      if (event.source !== window) return;
      // Only respond to messages tagged as being from our content script
      if (event?.data?.source !== MSG_RESPONSE) return;
      // Only respond to messages that this instance of sendMessageToContentScript sent
      if (event?.data?.messagedId !== MESSAGE_ID) return;

      resolve(event.data);
      window.removeEventListener('message', messageListener);
    };
    window.addEventListener('message', messageListener, false);
  });
};
