import {
  AddressEventListener,
  AcceptNFTOfferEventListener,
  AcceptNFTOfferMessagingResponse,
  BurnNFTEventListener,
  BurnNFTMessagingResponse,
  CancelNFTOfferEventListener,
  CancelNFTOfferMessagingResponse,
  CancelOfferEventListener,
  CancelOfferMessagingResponse,
  CreateNFTOfferEventListener,
  CreateNFTOfferMessagingResponse,
  CreateOfferMessagingResponse,
  CreateOfferEventListener,
  EventContentMessage,
  EventListener,
  GEM_WALLET,
  GetAddressMessagingResponse,
  GetAddressMessagingResponseDeprecated,
  GetNetworkMessagingResponse,
  GetNetworkMessagingResponseDeprecated,
  GetNFTEventListener,
  GetNFTEventListenerDeprecated,
  GetNFTMessagingResponse,
  GetNFTMessagingResponseDeprecated,
  GetPublicKeyMessagingResponse,
  GetPublicKeyMessagingResponseDeprecated,
  MintNFTEventListener,
  MintNFTMessagingResponse,
  PaymentEventListener,
  PaymentEventListenerDeprecated,
  PublicKeyEventListener,
  ReceiveAcceptNFTOfferContentMessage,
  ReceiveBurnNFTContentMessage,
  ReceiveCancelNFTOfferContentMessage,
  ReceiveCancelOfferContentMessage,
  ReceiveCreateNFTOfferContentMessage,
  ReceiveCreateOfferContentMessage,
  ReceiveMintNFTContentMessage,
  ReceiveGetAddressContentMessage,
  ReceiveGetAddressContentMessageDeprecated,
  ReceiveGetNFTContentMessage,
  ReceiveGetNFTContentMessageDeprecated,
  ReceiveGetNetworkContentMessage,
  ReceiveGetNetworkContentMessageDeprecated,
  ReceiveGetPublicKeyContentMessage,
  ReceiveGetPublicKeyContentMessageDeprecated,
  ReceiveSendPaymentContentMessage,
  ReceiveSendPaymentContentMessageDeprecated,
  ReceiveSetAccountContentMessage,
  ReceiveSetTrustlineContentMessage,
  ReceiveSetTrustlineContentMessageDeprecated,
  ReceiveSignMessageContentMessage,
  ReceiveSignMessageContentMessageDeprecated,
  ReceiveSubmitTransactionContentMessage,
  ReceiveSignTransactionContentMessage,
  RequestAcceptNFTOfferMessage,
  RequestBurnNFTMessage,
  RequestCancelNFTOfferMessage,
  RequestCancelOfferMessage,
  RequestCreateNFTOfferMessage,
  RequestCreateOfferMessage,
  RequestMintNFTMessage,
  RequestGetAddressMessage,
  RequestGetAddressMessageDeprecated,
  RequestGetNetworkMessage,
  RequestGetNetworkMessageDeprecated,
  RequestGetNFTMessage,
  RequestGetNFTMessageDeprecated,
  RequestGetPublicKeyMessage,
  RequestGetPublicKeyMessageDeprecated,
  RequestSendPaymentMessage,
  RequestSendPaymentMessageDeprecated,
  RequestSetAccountMessage,
  RequestSetTrustlineMessage,
  RequestSetTrustlineMessageDeprecated,
  RequestSignMessageMessage,
  RequestSignMessageMessageDeprecated,
  RequestSignTransactionMessage,
  RequestSubmitTransactionMessage,
  SendPaymentMessagingResponse,
  SendPaymentMessagingResponseDeprecated,
  SetTrustlineEventListener,
  SetTrustlineEventListenerDeprecated,
  SetTrustlineMessagingResponse,
  SetTrustlineMessagingResponseDeprecated,
  SignMessageListener,
  SignMessageMessagingResponse,
  SignMessageMessagingResponseDeprecated,
  SignTransactionEventListener,
  SignTransactionMessagingResponse,
  SetAccountMessagingResponse,
  SetAccountEventListener,
  SubmitTransactionEventListener,
  SubmitTransactionMessagingResponse,
  SubmitTransactionsBulkEventListener,
  RequestSubmitTransactionsBulkMessage,
  ReceiveSubmitTransactionsBulkContentMessage,
  SubmitTransactionsBulkMessagingResponse
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

      // Requests
      const {
        data: { app, type }
      } = event;
      // Check if it's an allowed event type to be forwarded
      if (type === 'REQUEST_GET_NETWORK/V3') {
        chrome.runtime
          .sendMessage<RequestGetNetworkMessage>({
            app,
            type
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetNetworkContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_GET_NETWORK/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as GetNetworkMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_NETWORK') {
        // REQUEST_NETWORK is deprecated since v3
        chrome.runtime
          .sendMessage<RequestGetNetworkMessageDeprecated>({
            app,
            type
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetNetworkContentMessageDeprecated,
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
                    } as GetNetworkMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_GET_ADDRESS/V3') {
        const {
          data: { payload }
        } = event as AddressEventListener;
        chrome.runtime
          .sendMessage<RequestGetAddressMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetAddressContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_GET_ADDRESS/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as GetAddressMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_ADDRESS') {
        // REQUEST_ADDRESS is deprecated since v3
        const {
          data: { payload }
        } = event as AddressEventListener;
        chrome.runtime
          .sendMessage<RequestGetAddressMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetAddressContentMessageDeprecated,
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
                    } as GetAddressMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_GET_PUBLIC_KEY/V3') {
        const {
          data: { payload }
        } = event as PublicKeyEventListener;
        chrome.runtime
          .sendMessage<RequestGetPublicKeyMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetPublicKeyContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_GET_PUBLIC_KEY/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as GetPublicKeyMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_PUBLIC_KEY') {
        // REQUEST_PUBLIC_KEY is deprecated since v3
        const {
          data: { payload }
        } = event as PublicKeyEventListener;
        chrome.runtime
          .sendMessage<RequestGetPublicKeyMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetPublicKeyContentMessageDeprecated,
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
                    } as GetPublicKeyMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_GET_NFT/V3') {
        const {
          data: { payload }
        } = event as GetNFTEventListener;
        chrome.runtime
          .sendMessage<RequestGetNFTMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveGetNFTContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_GET_NFT/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as GetNFTMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_NFT') {
        // REQUEST_NFT is deprecated since v3
        const {
          data: { payload }
        } = event as GetNFTEventListenerDeprecated;
        chrome.runtime
          .sendMessage<RequestGetNFTMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
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
                    } as GetNFTMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SEND_PAYMENT/V3') {
        const {
          data: { payload }
        } = event as PaymentEventListener;
        chrome.runtime
          .sendMessage<RequestSendPaymentMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSendPaymentContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SEND_PAYMENT/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SendPaymentMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'SEND_PAYMENT') {
        // SEND_PAYMENT is deprecated since v3
        const {
          data: { payload }
        } = event as PaymentEventListenerDeprecated;
        chrome.runtime
          .sendMessage<RequestSendPaymentMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
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
          });
      } else if (type === 'REQUEST_SET_TRUSTLINE/V3') {
        const {
          data: { payload }
        } = event as SetTrustlineEventListener;
        chrome.runtime
          .sendMessage<RequestSetTrustlineMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSetTrustlineContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SET_TRUSTLINE/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SetTrustlineMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_MINT_NFT/V3') {
        const {
          data: { payload }
        } = event as MintNFTEventListener;
        chrome.runtime
          .sendMessage<RequestMintNFTMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveMintNFTContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_MINT_NFT/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as MintNFTMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_CREATE_NFT_OFFER/V3') {
        const {
          data: { payload }
        } = event as CreateNFTOfferEventListener;
        chrome.runtime
          .sendMessage<RequestCreateNFTOfferMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveCreateNFTOfferContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_CREATE_NFT_OFFER/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as CreateNFTOfferMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_CANCEL_NFT_OFFER/V3') {
        const {
          data: { payload }
        } = event as CancelNFTOfferEventListener;
        chrome.runtime
          .sendMessage<RequestCancelNFTOfferMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveCancelNFTOfferContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_CANCEL_NFT_OFFER/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as CancelNFTOfferMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_ACCEPT_NFT_OFFER/V3') {
        const {
          data: { payload }
        } = event as AcceptNFTOfferEventListener;
        chrome.runtime
          .sendMessage<RequestAcceptNFTOfferMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveAcceptNFTOfferContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_ACCEPT_NFT_OFFER/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as AcceptNFTOfferMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_BURN_NFT/V3') {
        const {
          data: { payload }
        } = event as BurnNFTEventListener;
        chrome.runtime
          .sendMessage<RequestBurnNFTMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveBurnNFTContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_BURN_NFT/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as BurnNFTMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_ADD_TRUSTLINE') {
        // REQUEST_ADD_TRUSTLINE is deprecated since v3
        const {
          data: { payload }
        } = event as SetTrustlineEventListenerDeprecated;
        chrome.runtime
          .sendMessage<RequestSetTrustlineMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
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
          });
      } else if (type === 'REQUEST_SIGN_MESSAGE/V3') {
        const {
          data: { payload }
        } = event as SignMessageListener;
        chrome.runtime
          .sendMessage<RequestSignMessageMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSignMessageContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SIGN_MESSAGE/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SignMessageMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SIGN_MESSAGE') {
        // REQUEST_SIGN_MESSAGE is deprecated since v3
        const {
          data: { payload }
        } = event as SignMessageListener;
        chrome.runtime
          .sendMessage<RequestSignMessageMessageDeprecated>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSignMessageContentMessageDeprecated,
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
                    } as SignMessageMessagingResponseDeprecated,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SET_ACCOUNT/V3') {
        const {
          data: { payload }
        } = event as SetAccountEventListener;
        chrome.runtime
          .sendMessage<RequestSetAccountMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSetAccountContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SET_ACCOUNT/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SetAccountMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_CREATE_OFFER/V3') {
        const {
          data: { payload }
        } = event as CreateOfferEventListener;
        chrome.runtime
          .sendMessage<RequestCreateOfferMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveCreateOfferContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_CREATE_OFFER/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as CreateOfferMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_CANCEL_OFFER/V3') {
        const {
          data: { payload }
        } = event as CancelOfferEventListener;
        chrome.runtime
          .sendMessage<RequestCancelOfferMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveCancelOfferContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_CANCEL_OFFER/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as CancelOfferMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SUBMIT_TRANSACTION/V3') {
        const {
          data: { payload }
        } = event as SubmitTransactionEventListener;
        chrome.runtime
          .sendMessage<RequestSubmitTransactionMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSubmitTransactionContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SUBMIT_TRANSACTION/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SubmitTransactionMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SUBMIT_TRANSACTIONS_BULK/V3') {
        const {
          data: { payload }
        } = event as SubmitTransactionsBulkEventListener;
        chrome.runtime
          .sendMessage<RequestSubmitTransactionsBulkMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSubmitTransactionsBulkContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SUBMIT_TRANSACTIONS_BULK/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SubmitTransactionsBulkMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_SIGN_TRANSACTION/V3') {
        const {
          data: { payload }
        } = event as SignTransactionEventListener;
        chrome.runtime
          .sendMessage<RequestSignTransactionMessage>({
            app,
            type,
            payload
          })
          .then(() => {
            const messageListener = (
              message: ReceiveSignTransactionContentMessage,
              sender: chrome.runtime.MessageSender
            ) => {
              const { app, type, payload } = message;
              // We make sure that the message comes from GemWallet
              if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
                if (type === 'RECEIVE_SIGN_TRANSACTION/V3') {
                  const { result, error } = payload;
                  window.postMessage(
                    {
                      source: 'GEM_WALLET_MSG_RESPONSE',
                      messagedId,
                      result,
                      error
                    } as SignTransactionMessagingResponse,
                    window.location.origin
                  );
                  chrome.runtime.onMessage.removeListener(messageListener);
                }
              }
            };
            chrome.runtime.onMessage.addListener(messageListener);
          });
      } else if (type === 'REQUEST_CONNECTION') {
        window.postMessage(
          { source: 'GEM_WALLET_MSG_RESPONSE', messagedId, isConnected: true },
          window.location.origin
        );
      } else if (type === 'REQUEST_IS_INSTALLED/V3') {
        window.postMessage(
          { source: 'GEM_WALLET_MSG_RESPONSE', messagedId, isInstalled: true },
          window.location.origin
        );
      }
    },
    false
  );

  // Events
  chrome.runtime.onMessage.addListener((message: EventContentMessage) => {
    // We only accept messages from ourselves
    if (message.app !== GEM_WALLET) return;
    if (!message.source || message.source !== 'GEM_WALLET_MSG_REQUEST') return;

    if (message.type === 'EVENT_NETWORK_CHANGED') {
      window.postMessage(
        {
          type: 'networkChanged',
          source: message.source,
          payload: message.payload
        },
        window.location.origin
      );
    } else if (message.type === 'EVENT_WALLET_CHANGED') {
      window.postMessage(
        {
          type: 'walletChanged',
          source: message.source,
          payload: message.payload
        },
        window.location.origin
      );
    } else if (message.type === 'EVENT_LOGIN') {
      window.postMessage(
        {
          type: 'login',
          source: message.source,
          payload: message.payload
        },
        window.location.origin
      );
    } else if (message.type === 'EVENT_LOGOUT') {
      window.postMessage(
        {
          type: 'logout',
          source: message.source,
          payload: message.payload
        },
        window.location.origin
      );
    }
  });
});

/*
 * Tabs management
 */
// When the content script is loaded, we send a message to the background script to add the tab to the list of tabs
chrome.runtime.sendMessage({
  type: 'CONTENT_SCRIPT_LOADED'
});

// When the content script is unloaded, we send a message to the background script to remove the tab from the list of tabs
window.onbeforeunload = () => {
  chrome.runtime.sendMessage({
    type: 'CONTENT_SCRIPT_UNLOADED'
  });
};
