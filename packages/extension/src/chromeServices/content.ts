import {
  AddressEventListener,
  EventListener,
  GEM_WALLET,
  Message,
  NetworkResponse,
  PaymentEventListener,
  PaymentResponse,
  PublicAddressResponse,
  PublicKeyEventListener,
  PublicKeyResponse,
  ReceiveAddressContentMessage,
  ReceivePaymentHashContentMessage,
  ReceivePublicKeyContentMessage,
  ReceiveSignMessageContentMessage,
  RequestAddressMessage,
  RequestNetworkMessage,
  RequestPaymentMessage,
  RequestPublicKeyMessage,
  RequestSignMessageMessage,
  SignedMessageResponse,
  SignMessageListener
} from '@gemwallet/constants';

/**
 * Execute the function if the document is fully ready
 */
setTimeout(() => {
  // Redirect Messages To Background script
  window.addEventListener(
    'message',
    (event: EventListener) => {
      const messagedId = event.data.messageId;
      if (event.source !== window && event.data.app === GEM_WALLET) return;
      if (!event.data.source || event.data.source !== Message.MsgRequest) return;

      const {
        data: { app, type }
      } = event;
      // Check if it's an allowed event type to be forwarded
      if (type === Message.RequestNetwork) {
        chrome.runtime.sendMessage<RequestNetworkMessage>(
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
        } = event as AddressEventListener;
        chrome.runtime.sendMessage<RequestAddressMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveAddressContentMessage,
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
                      publicAddress: payload.publicAddress
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
        } = event as PublicKeyEventListener;
        chrome.runtime.sendMessage<RequestPublicKeyMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceivePublicKeyContentMessage,
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
                      address: payload.address,
                      publicKey: payload.publicKey
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
        } = event as PaymentEventListener;
        chrome.runtime.sendMessage<RequestPaymentMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceivePaymentHashContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from gem-wallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === Message.ReceivePaymentHash) {
                  const { hash } = payload;
                  window.postMessage(
                    { source: Message.MsgResponse, messagedId, hash } as PaymentResponse,
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
        } = event as SignMessageListener;
        chrome.runtime.sendMessage<RequestSignMessageMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveSignMessageContentMessage,
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
                      signedMessage: payload.signedMessage
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
