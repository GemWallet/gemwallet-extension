import {
  EventListenerEvent,
  GEM_WALLET,
  Message,
  MessageListenerEvent,
  NetworkResponse,
  PaymentResponse,
  PaymentResponseError,
  PaymentResponseHash,
  PublicAddressResponse,
  PublicKeyResponse,
  SignedMessageResponse
} from '@gemwallet/constants';

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
      if (!event.data.source || event.data.source !== Message.MsgRequest) return;

      const {
        data: { app, type }
      } = event as EventListenerEvent;
      // Check if it's an allowed event type to be forwarded
      if (type === Message.RequestNetwork) {
        chrome.runtime.sendMessage(
          {
            app,
            type
          },
          (network) => {
            // Send the response back to GemWallet API
            const response: NetworkResponse = {
              source: Message.MsgResponse,
              messagedId,
              network
            };
            window.postMessage(response, window.location.origin);
          }
        );
      } else if (type === Message.RequestAddress) {
        const {
          data: { payload }
        } = event as EventListenerEvent;
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
                if (type === Message.ReceiveAddress) {
                  window.postMessage(
                    {
                      source: Message.MsgResponse,
                      messagedId,
                      publicAddress: payload?.publicAddress
                    } as PublicAddressResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === Message.RequestPublicKey) {
        const {
          data: { payload }
        } = event as EventListenerEvent;
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
                if (type === Message.ReceivePublicKey) {
                  window.postMessage(
                    {
                      source: Message.MsgResponse,
                      messagedId,
                      address: payload?.address,
                      publicKey: payload?.publicKey
                    } as PublicKeyResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === Message.SendPayment) {
        const {
          data: { payload }
        } = event as EventListenerEvent;

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
                if (type === Message.ReceivePaymentHash) {
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
                    { source: Message.MsgResponse, messagedId, ...res } as PaymentResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === Message.RequestSignMessage) {
        const {
          data: { payload }
        } = event as EventListenerEvent;
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
                if (type === Message.ReceiveSignMessage) {
                  window.postMessage(
                    {
                      source: Message.MsgResponse,
                      messagedId,
                      signedMessage: payload?.signedMessage
                    } as SignedMessageResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === Message.RequestConnection) {
        window.postMessage(
          { source: Message.MsgResponse, messagedId, isConnected: true },
          window.location.origin
        );
      }
    },
    false
  );
}, 0);
