import {
  AddressEventListener,
  AddTrustlineEventListener,
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
  ReceiveNetworkContentMessage,
  ReceivePaymentHashContentMessage,
  ReceivePublicKeyContentMessage,
  ReceiveSignMessageContentMessage,
  ReceiveTrustlineHashContentMessage,
  RequestAddressMessage,
  RequestNetworkMessage,
  RequestPaymentMessage,
  RequestPublicKeyMessage,
  RequestSignMessageMessage,
  RequestTrustlineMessage,
  SignedMessageResponse,
  SignMessageListener,
  TrustlineResponse
} from '@gemwallet/constants';

/**
 * Execute the function if the document is fully ready
 */
setTimeout(() => {
  // Redirect Messages To Background script
  window.addEventListener(
    'message',
    // deepcode ignore PromiseNotCaughtGeneral: This is not a promise, deepcode ignore InsufficientPostmessageValidation: we allow any website
    (event: EventListener) => {
      if (event.origin !== window.origin) return;
      if (event.source !== window && event.data.app === GEM_WALLET) return;
      if (!event.data.source || event.data.source !== Message.MsgRequest) return;
      const messagedId = event.data.messageId;

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
          () => {
            const messageListener = (
              message: ReceiveNetworkContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === Message.ReceiveNetwork) {
                  window.postMessage(
                    {
                      source: Message.MsgResponse,
                      messagedId,
                      network: payload.network
                    } as NetworkResponse,
                    window.location.origin
                  );
                }
              }
              chrome.runtime.onMessage.removeListener(messageListener);
            };
            chrome.runtime.onMessage.addListener(messageListener);
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
              // We make sure that the message comes from GemWallet
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
              // We make sure that the message comes from GemWallet
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
              // We make sure that the message comes from GemWallet
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
      } else if (type === Message.RequestAddTrustline) {
        const {
          data: { payload }
        } = event as AddTrustlineEventListener;
        chrome.runtime.sendMessage<RequestTrustlineMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveTrustlineHashContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === Message.ReceiveTrustlineHash) {
                  const { hash } = payload;
                  window.postMessage(
                    { source: Message.MsgResponse, messagedId, hash } as TrustlineResponse,
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
              // We make sure that the message comes from GemWallet
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
