import {
  BackgroundMessage,
  GEM_WALLET,
  Message,
  Network,
  ReceiveAddressContentMessage,
  ReceiveNetworkContentMessage,
  ReceiveNFTContentMessage,
  ReceivePaymentHashContentMessage,
  ReceivePublicKeyContentMessage,
  ReceiveSignMessageContentMessage,
  ReceiveTrustlineHashContentMessage
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
let _currentWindowPopup: chrome.windows.Window | undefined = undefined;

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = (): Promise<chrome.windows.Window> => {
  return new Promise((resolve) => {
    chrome.windows.getLastFocused((windowObject) => {
      return resolve(windowObject);
    });
  });
};

const serializeToQueryString = (payload?: { [key: string]: any }) => {
  if (!payload) {
    return '';
  }
  const str = [];
  for (let property in payload)
    if (payload.hasOwnProperty(property)) {
      str.push(`${encodeURIComponent(property)}=${encodeURIComponent(payload[property])}`);
    }
  return `?${str.join('&')}`;
};

/*
 * Keep only one listener for easier debugging
 */
chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
  const { app, type } = message;
  // We make sure that the message comes from gem-wallet
  if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
    if (type === Message.RequestNetwork) {
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
          _currentWindowPopup = _window;
        }
      );
      sendResponse(Network.TESTNET);
    } else if (type === Message.RequestAddress) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveAddressContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceiveAddress,
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
            type: Message.ReceiveAddress,
            payload: {
              publicAddress: undefined
            }
          });
        });
    } else if (type === Message.RequestPublicKey) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceivePublicKeyContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceivePublicKey,
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
            type: Message.ReceivePublicKey,
            payload: {
              address: undefined,
              publicKey: undefined
            }
          });
        });
    } else if (type === Message.RequestNFT) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveNFTContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceiveNFT,
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
            type: Message.ReceiveNFT,
            payload: {
              nfts: undefined
            }
          });
        });
    } else if (type === Message.SendPayment) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time :O
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceivePaymentHashContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceivePaymentHash,
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
            type: Message.ReceivePaymentHash,
            payload: {
              hash: undefined
            }
          });
        });
    } else if (type === Message.RequestAddTrustline) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time :O
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    })}&${PARAMETER_TRANSACTION_TRUSTLINE}`,
                    type: 'popup',
                    width: NOTIFICATION_WIDTH,
                    height: NOTIFICATION_HEIGHT,
                    left,
                    top
                  },
                  (_window) => {
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveTrustlineHashContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceiveTrustlineHash,
                  payload: {
                    hash: undefined
                  }
                });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          chrome.tabs.sendMessage<ReceiveTrustlineHashContentMessage>(sender.tab?.id || 0, {
            app: GEM_WALLET,
            type: Message.ReceiveTrustlineHash,
            payload: {
              hash: undefined
            }
          });
        });
    } else if (type === Message.RequestSignMessage) {
      chrome.windows
        .getAll()
        .then((openedWindows) => {
          // We check if the popup is currently open
          if (
            _currentWindowPopup &&
            openedWindows.find((window) => window.id === _currentWindowPopup?.id)
          ) {
            // TODO: Why popup are created more than one time? - Maybe to be removed?
            chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
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
                    _currentWindowPopup = _window;
                  }
                );
              })
              .catch((error) => {
                console.error(error);
                chrome.tabs.sendMessage<ReceiveSignMessageContentMessage>(sender.tab?.id || 0, {
                  app: GEM_WALLET,
                  type: Message.ReceiveSignMessage,
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
            type: Message.ReceiveSignMessage,
            payload: {
              signedMessage: undefined
            }
          });
        });
    } else if (type === Message.ReceivePaymentHash) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceivePaymentHashContentMessage>(payload.id, {
        app,
        type: Message.ReceivePaymentHash,
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === Message.ReceiveTrustlineHash) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceiveTrustlineHashContentMessage>(payload.id, {
        app,
        type: Message.ReceiveTrustlineHash,
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === Message.ReceiveAddress) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceiveAddressContentMessage>(payload.id, {
        app,
        type: Message.ReceiveAddress,
        payload: {
          publicAddress: payload.publicAddress
        }
      });
    } else if (type === Message.ReceiveNetwork) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceiveNetworkContentMessage>(payload.id, {
        app,
        type: Message.ReceiveNetwork,
        payload: {
          network: payload.network
        }
      });
    } else if (type === Message.ReceivePublicKey) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceivePublicKeyContentMessage>(payload.id, {
        app,
        type: Message.ReceivePublicKey,
        payload: {
          address: payload.address,
          publicKey: payload.publicKey
        }
      });
    } else if (type === Message.ReceiveNFT) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceiveNFTContentMessage>(payload.id, {
        app,
        type: Message.ReceiveNFT,
        payload: {
          nfts: payload.nfts
        }
      });
    } else if (type === Message.ReceiveSignMessage) {
      const { payload } = message;
      chrome.tabs.sendMessage<ReceiveSignMessageContentMessage>(payload.id, {
        app,
        type: Message.ReceiveSignMessage,
        payload: {
          signedMessage: payload.signedMessage
        }
      });
    }
  }
});
