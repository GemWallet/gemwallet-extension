import {
  BackgroundMessage,
  GEM_WALLET,
  Network,
  ReceiveAddressContentMessage,
  ReceiveMessage,
  ReceiveNetworkContentMessage,
  ReceiveNFTContentMessage,
  ReceivePaymentHashContentMessage,
  ReceivePublicKeyContentMessage,
  ReceiveSignMessageContentMessage,
  ReceiveTrustlineHashContentMessage,
  ResponsePayload
} from '@gemwallet/constants';

import {
  PARAMETER_ADDRESS,
  PARAMETER_NETWORK,
  PARAMETER_NFT,
  PARAMETER_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_TRUSTLINE
} from './../constants/parameters';
import { MAIN_FILE } from './../constants/routes';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;
let currentWindowPopup: chrome.windows.Window | undefined = undefined;

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = (): Promise<chrome.windows.Window> =>
  new Promise((resolve) => chrome.windows.getLastFocused(resolve));

const serializeToQueryString = (payload?: Record<string, any>) =>
  payload
    ? '?' +
      Object.entries(payload)
        .map(([key, value]) => [key, value].map(encodeURIComponent).join('='))
        .join('&')
    : '';

const sendMessageToTab = <T>(tabId: number | undefined, message: any) => {
  chrome.tabs.sendMessage<T>(tabId ?? 0, message);
};

// TODO: Pass the <T> down
const focusOrCreatePopupWindow = async <T>({
  message,
  sender,
  parameter,
  receivingMessage,
  errorPayload
}: {
  //TODO: Any needs to be replaced by the proper type
  message: any;
  sender: chrome.runtime.MessageSender;
  parameter: string;
  receivingMessage: ReceiveMessage;
  errorPayload: ResponsePayload;
}) => {
  try {
    const openedWindows = await chrome.windows.getAll();
    // We check if the popup is currently open
    const { currentWindowId } = await chrome.storage.local.get('currentWindowId');

    if (currentWindowId && openedWindows.find((window) => window.id === currentWindowId)) {
      chrome.windows.update(currentWindowId, { focused: true });
    } else {
      const { payload } = message;
      const lastFocusedWindow = await getLastFocusedWindow();
      const top = lastFocusedWindow.top;
      let left = undefined;
      if (lastFocusedWindow.left && lastFocusedWindow.width) {
        left = lastFocusedWindow.left + (lastFocusedWindow.width - NOTIFICATION_WIDTH);
      }

      const currentWindow = await chrome.windows.create({
        url: `../..${MAIN_FILE}${serializeToQueryString({
          ...payload,
          id: sender.tab?.id
        })}&${parameter}`,
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top
      });

      chrome.storage.local.set({ currentWindowId: currentWindow?.id });
    }
  } catch (error) {
    console.error(error);
    chrome.tabs.sendMessage(sender.tab?.id || 0, {
      app: GEM_WALLET,
      type: receivingMessage,
      payload: errorPayload
    });
  }
};

/*
 * Keep only one listener for easier debugging
 */
chrome.runtime.onMessage.addListener(
  (
    message: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    const { app, type } = message;
    // We make sure that the message comes from gem-wallet
    if (app !== GEM_WALLET || sender.id !== chrome.runtime.id) {
      return; // exit early if the message is not from gem-wallet or the sender is not the extension itself
    }

    if (type === 'REQUEST_NETWORK') {
      const payload = {
        id: sender.tab?.id
      };
      chrome.windows.create(
        {
          url: `../..${MAIN_FILE}${serializeToQueryString(payload)}&${PARAMETER_NETWORK}`,
          type: 'popup',
          width: 1,
          height: 1
        },
        (_window) => {
          currentWindowPopup = _window;
        }
      );
      sendResponse(Network.TESTNET);
    } else if (type === 'REQUEST_ADDRESS') {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            currentWindowPopup &&
            openedWindows.find((window) => window.id === currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(currentWindowPopup.id as number, { focused: true });
          } else {
            getLastFocusedWindow()
              .then((lastFocused) => {
                const top = lastFocused.top;
                let left = undefined;
                if (lastFocused.left && lastFocused.width) {
                  left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
                }
                const payload = {
                  ...message.payload,
                  id: sender.tab?.id
                };
                chrome.windows.create(
                  {
                    url: `../..${MAIN_FILE}${serializeToQueryString(payload)}&${PARAMETER_ADDRESS}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveAddressContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: 'RECEIVE_ADDRESS',
                  payload: {
                    publicAddress: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceiveAddressContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: 'RECEIVE_ADDRESS',
            payload: {
              publicAddress: undefined
            }
          });
        });
    } else if (type === 'REQUEST_PUBLIC_KEY') {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            currentWindowPopup &&
            openedWindows.find((window) => window.id === currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(currentWindowPopup.id as number, { focused: true });
          } else {
            getLastFocusedWindow()
              .then((lastFocused) => {
                const top = lastFocused.top;
                let left = undefined;
                if (lastFocused.left && lastFocused.width) {
                  left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
                }
                const payload = {
                  ...message.payload,
                  id: sender.tab?.id
                };
                chrome.windows.create(
                  {
                    url: `../..${MAIN_FILE}${serializeToQueryString(
                      payload
                    )}&${PARAMETER_PUBLIC_KEY}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceivePublicKeyContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: 'RECEIVE_PUBLIC_KEY',
                  payload: {
                    address: undefined,
                    publicKey: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceivePublicKeyContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: 'RECEIVE_PUBLIC_KEY',
            payload: {
              address: undefined,
              publicKey: undefined
            }
          });
        });
    } else if (type === 'REQUEST_NFT') {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            currentWindowPopup &&
            openedWindows.find((window) => window.id === currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(currentWindowPopup.id as number, { focused: true });
          } else {
            getLastFocusedWindow()
              .then((lastFocused) => {
                const top = lastFocused.top;
                let left = undefined;
                if (lastFocused.left && lastFocused.width) {
                  left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
                }
                const payload = {
                  ...message.payload,
                  id: sender.tab?.id
                };
                chrome.windows.create(
                  {
                    url: `../..${MAIN_FILE}${serializeToQueryString(payload)}&${PARAMETER_NFT}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveNFTContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: 'RECEIVE_NFT',
                  payload: {
                    nfts: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceiveNFTContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: 'RECEIVE_NFT',
            payload: {
              nfts: undefined
            }
          });
        });
    } else if (type === 'REQUEST_PAYMENT') {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            currentWindowPopup &&
            openedWindows.find((window) => window.id === currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time :O
            chrome.windows.update(currentWindowPopup.id as number, { focused: true });
          } else {
            const { payload } = message;
            getLastFocusedWindow()
              .then((lastFocused) => {
                const top = lastFocused.top;
                let left = undefined;
                if (lastFocused.left && lastFocused.width) {
                  left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
                }
                chrome.windows.create(
                  {
                    url: `../..${MAIN_FILE}${serializeToQueryString({
                      ...payload,
                      id: sender.tab?.id
                    })}&${PARAMETER_TRANSACTION_PAYMENT}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceivePaymentHashContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: 'RECEIVE_PAYMENT_HASH',
                  payload: {
                    hash: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceivePaymentHashContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: 'RECEIVE_PAYMENT_HASH',
            payload: {
              hash: undefined
            }
          });
        });
    } else if (type === 'REQUEST_ADD_TRUSTLINE') {
      focusOrCreatePopupWindow<ReceiveTrustlineHashContentMessage>({
        message,
        sender,
        parameter: PARAMETER_TRANSACTION_TRUSTLINE,
        receivingMessage: 'RECEIVE_TRUSTLINE_HASH',
        errorPayload: {
          hash: undefined
        }
      });
    } else if (type === 'REQUEST_SIGN_MESSAGE') {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            currentWindowPopup &&
            openedWindows.find((window) => window.id === currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(currentWindowPopup.id as number, { focused: true });
          } else {
            getLastFocusedWindow()
              .then((lastFocused) => {
                const top = lastFocused.top;
                let left = undefined;
                if (lastFocused.left && lastFocused.width) {
                  left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
                }
                const payload = {
                  ...message.payload,
                  id: sender.tab?.id
                };
                chrome.windows.create(
                  {
                    url: `../..${MAIN_FILE}${serializeToQueryString(
                      payload
                    )}&${PARAMETER_SIGN_MESSAGE}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveSignMessageContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: 'RECEIVE_SIGN_MESSAGE',
                  payload: {
                    signedMessage: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceiveSignMessageContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: 'RECEIVE_SIGN_MESSAGE',
            payload: {
              signedMessage: undefined
            }
          });
        });
    } else if (type === 'RECEIVE_PAYMENT_HASH') {
      const { payload } = message;
      sendMessageToTab<ReceivePaymentHashContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_PAYMENT_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_TRUSTLINE_HASH') {
      const { payload } = message;
      sendMessageToTab<ReceiveTrustlineHashContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_ADDRESS') {
      const { payload } = message;
      sendMessageToTab<ReceiveAddressContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_ADDRESS',
        payload: {
          publicAddress: payload.publicAddress
        }
      });
    } else if (type === 'RECEIVE_NETWORK') {
      const { payload } = message;
      sendMessageToTab<ReceiveNetworkContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_NETWORK',
        payload: {
          network: payload.network
        }
      });
    } else if (type === 'RECEIVE_PUBLIC_KEY') {
      const { payload } = message;
      sendMessageToTab<ReceivePublicKeyContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_PUBLIC_KEY',
        payload: {
          address: payload.address,
          publicKey: payload.publicKey
        }
      });
    } else if (type === 'RECEIVE_NFT') {
      const { payload } = message;
      sendMessageToTab<ReceiveNFTContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_NFT',
        payload: {
          nfts: payload.nfts
        }
      });
    } else if (type === 'RECEIVE_SIGN_MESSAGE') {
      const { payload } = message;
      sendMessageToTab<ReceiveSignMessageContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SIGN_MESSAGE',
        payload: {
          signedMessage: payload.signedMessage
        }
      });
    }
  }
);
