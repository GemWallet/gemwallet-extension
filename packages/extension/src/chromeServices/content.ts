import {
  GEM_WALLET,
  MSG_REQUEST,
  MSG_RESPONSE,
  REQUEST_NETWORK,
  REQUEST_CONNECTION,
  REQUEST_TRANSACTION
} from '@gemwallet/constants/src/message';
import { NetworkResponse, TransactionResponse } from '@gemwallet/constants/src/message.types';

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
      } else if (type === REQUEST_TRANSACTION) {
        let res: TransactionResponse = {
          error: 'Unable to send message to extension',
          status: 'waiting'
        };
        const {
          data: { payload }
        } = event;

        chrome.runtime.sendMessage(
          {
            app,
            type,
            payload
          },
          (status) => {
            if (status) {
              res = { status, error: '' };
            }
            // Send the response back to GemWallet API
            window.postMessage(
              { source: MSG_RESPONSE, messagedId, ...res },
              window.location.origin
            );
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
