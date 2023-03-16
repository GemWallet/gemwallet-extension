import {
  APIMessages,
  IsConnectedResponse,
  Message,
  NetworkResponse,
  PublicAddressResponse
} from '@gemwallet/constants';

declare global {
  interface Window {
    gemWallet?: boolean;
    GemWalletApi?: Record<string, any>;
  }
}

/*
 * Send message from current window to content script, for example API to content script
 */
export const sendMessageToContentScript = (msg: APIMessages): Promise<any> => {
  /* 
    In the case of multiple calls coming in sequentially, we use this MESSAGE_ID to make sure we're responding to
    the appropriate message sender. Otherwise, we can run into race conditions where we simply resolve all 
    sent messages with the first thing that comes back.
  */
  const MESSAGE_ID = Date.now() + Math.random();

  window.postMessage(
    {
      source: Message.MsgRequest,
      messageId: MESSAGE_ID,
      ...msg
    },
    window.location.origin
  );

  return new Promise((resolve, reject) => {
    if (!window.gemWallet && msg.type !== Message.RequestConnection) {
      reject(
        new Error(
          'Please check if GemWallet is connected \n GemWallet needs to be installed: https://gemwallet.app'
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
      if (event?.data?.source !== Message.MsgResponse) return;
      // Only respond to messages that this instance of sendMessageToContentScript sent
      if (event?.data?.messagedId !== MESSAGE_ID) return;

      resolve(event.data);
      window.removeEventListener('message', messageListener);
    };
    window.addEventListener('message', messageListener, false);
  });
};
