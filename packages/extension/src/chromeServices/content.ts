import {
  AddressEventListener,
  EventListener,
  GEM_WALLET,
  GetNFTEventListener,
  GetNFTEventListenerDeprecated,
  NetworkResponse,
  NFTResponse,
  PaymentEventListener,
  PaymentEventListenerDeprecated,
  PublicAddressResponse,
  PublicKeyEventListener,
  PublicKeyResponse,
  ReceiveAddressContentMessage,
  ReceiveGetNFTContentMessage,
  ReceiveGetNFTContentMessageDeprecated,
  ReceiveNetworkContentMessage,
  ReceivePublicKeyContentMessage,
  ReceiveSendPaymentContentMessage,
  ReceiveSendPaymentContentMessageDeprecated,
  ReceiveSetTrustlineContentMessage,
  ReceiveSetTrustlineContentMessageDeprecated,
  ReceiveSignMessageContentMessage,
  RequestGetAddressMessage,
  RequestGetAddressMessageDeprecated,
  RequestGetNFTMessage,
  RequestGetNFTMessageDeprecated,
  RequestNetworkMessage,
  RequestNetworkMessageDeprecated,
  RequestSendPaymentMessage,
  RequestSendPaymentMessageDeprecated,
  RequestPublicKeyMessage,
  RequestSignMessageMessage,
  RequestSetTrustlineMessage,
  RequestSetTrustlineMessageDeprecated,
  SendPaymentMessagingResponse,
  SendPaymentMessagingResponseDeprecated,
  SetTrustlineEventListener,
  SetTrustlineEventListenerDeprecated,
  SetTrustlineMessagingResponse,
  SetTrustlineMessagingResponseDeprecated,
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
    // deepcode ignore PromiseNotCaughtGeneral: This is not a promise, deepcode ignore InsufficientPostmessageValidation: we allow any website
    (event: EventListener) => {
      if (event.origin !== window.origin) return;
      if (event.source !== window && event.data.app === GEM_WALLET) return;
      if (!event.data.source || event.data.source !== 'GEM_WALLET_MSG_REQUEST') return;
      const messagedId = event.data.messageId;

      const {
        data: { app, type }
      } = event;
      // Check if it's an allowed event type to be forwarded
      if (type === 'REQUEST_GET_NETWORK/V3') {
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
                if (type === 'RECEIVE_NETWORK') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      network: payload.network
                    } as NetworkResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_NETWORK') {
        chrome.runtime.sendMessage<RequestNetworkMessageDeprecated>(
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
                if (type === 'RECEIVE_NETWORK') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      network: payload.network
                    } as NetworkResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_GET_ADDRESS/V3') {
        const {
          data: { payload }
        } = event as AddressEventListener;
        chrome.runtime.sendMessage<RequestGetAddressMessage>(
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
                if (type === 'RECEIVE_ADDRESS') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      publicAddress: payload.publicAddress
                    } as PublicAddressResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_ADDRESS') {
        const {
          data: { payload }
        } = event as AddressEventListener;
        chrome.runtime.sendMessage<RequestGetAddressMessageDeprecated>(
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
                if (type === 'RECEIVE_ADDRESS') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      publicAddress: payload.publicAddress
                    } as PublicAddressResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_PUBLIC_KEY') {
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
                if (type === 'RECEIVE_PUBLIC_KEY') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      address: payload.address,
                      publicKey: payload.publicKey
                    } as PublicKeyResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_GET_NFT/V3') {
        const {
          data: { payload }
        } = event as GetNFTEventListener;
        chrome.runtime.sendMessage<RequestGetNFTMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveGetNFTContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_GET_NFT/V3') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      nfts: payload.nfts
                    } as NFTResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_NFT') {
        // REQUEST_NFT is deprecated since v3
        const {
          data: { payload }
        } = event as GetNFTEventListenerDeprecated;
        chrome.runtime.sendMessage<RequestGetNFTMessageDeprecated>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveGetNFTContentMessageDeprecated,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_NFT') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      nfts: payload.nfts
                    } as NFTResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_SEND_PAYMENT/V3') {
        const {
          data: { payload }
        } = event as PaymentEventListener;
        chrome.runtime.sendMessage<RequestSendPaymentMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveSendPaymentContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SEND_PAYMENT/V3') {
                  const { result } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result
                    } as SendPaymentMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'SEND_PAYMENT') {
        // SEND_PAYMENT is deprecated since v3
        const {
          data: { payload }
        } = event as PaymentEventListenerDeprecated;
        chrome.runtime.sendMessage<RequestSendPaymentMessageDeprecated>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveSendPaymentContentMessageDeprecated,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_PAYMENT_HASH') {
                  const { hash } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      hash
                    } as SendPaymentMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_SET_TRUSTLINE/V3') {
        const {
          data: { payload }
        } = event as SetTrustlineEventListener;
        chrome.runtime.sendMessage<RequestSetTrustlineMessage>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveSetTrustlineContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SET_TRUSTLINE/V3') {
                  const { result } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result
                    } as SetTrustlineMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_ADD_TRUSTLINE') {
        // REQUEST_ADD_TRUSTLINE is deprecated since v3
        const {
          data: { payload }
        } = event as SetTrustlineEventListenerDeprecated;
        chrome.runtime.sendMessage<RequestSetTrustlineMessageDeprecated>(
          {
            app,
            type,
            payload
          },
          () => {
            const messageListener = (
              message: ReceiveSetTrustlineContentMessageDeprecated,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_TRUSTLINE_HASH') {
                  const { hash } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      hash
                    } as SetTrustlineMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_SIGN_MESSAGE') {
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
                if (type === 'RECEIVE_SIGN_MESSAGE') {
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      signedMessage: payload.signedMessage
                    } as SignedMessageResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          }
        );
      } else if (type === 'REQUEST_CONNECTION') {
        window.postMessage(
          { source: 'GEM_WALLET_MSG_RESPONSE', messagedId, isConnected: true },
          window.location.origin
        );
      }
    },
    false
  );
}, 0);
