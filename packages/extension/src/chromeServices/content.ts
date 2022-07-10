import {
  GEM_WALLET,
  MSG_REQUEST,
  MSG_RESPONSE,
  REQUEST_NETWORK,
  REQUEST_CONNECTION,
  SEND_PAYMENT,
  RECEIVE_PAYMENT_HASH
} from '@gemwallet/api/src/types/message';
import {
  NetworkResponse,
  PaymentResponse,
  PaymentResponseError,
  PaymentResponseHash,
  MessageListenerEvent
} from '@gemwallet/api/src';

/**
 * Execute the function if the document is fully ready
 */
setTimeout(() => {
  // Redirect Messages To Background script
  window.addEventListener(
    'message',
    (event) => {
      const messagedId = event?.data?.messageId || 0;
      if (event.source !== window && event.data.app === GEM_WALLET) return;
      if (!event.data.source || event.data.source !== MSG_REQUEST) return;

      const {
        data: { app, type }
      } = event;
      // Check if it's an allowed event type to be forwarded
      if (type === REQUEST_NETWORK) {
        let res: NetworkResponse = {
          error: 'Unable to send message to extension',
          network: null
        };

        chrome.runtime.sendMessage(
          {
            app,
            type
          },
          (network) => {
            if (network) {
              res = { network, error: '' };
            }
            // Send the response back to GemWallet API
            window.postMessage(
              { source: MSG_RESPONSE, messagedId, ...res },
              window.location.origin
            );
          }
        );
      } else if (type === SEND_PAYMENT) {
        const {
          data: { payload }
        } = event;

        chrome.runtime.sendMessage(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: MessageListenerEvent,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from gem-wallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === RECEIVE_PAYMENT_HASH) {
                  let res = {
                    error: 'Unable to send message to extension'
                  } as PaymentResponseError | PaymentResponseHash;
                  if (payload) {
                    const { hash, error } = payload;
                    if (hash) {
                      res = { hash } as PaymentResponseHash;
                    } else if (error) {
                      res = { error } as PaymentResponseError;
                    }
                  }
                  window.postMessage(
                    { source: MSG_RESPONSE, messagedId, ...res } as PaymentResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === REQUEST_CONNECTION) {
        window.postMessage(
          { source: MSG_RESPONSE, messagedId, isConnected: true },
          window.location.origin
        );
      }
    },
    false
  );
}, 0);
