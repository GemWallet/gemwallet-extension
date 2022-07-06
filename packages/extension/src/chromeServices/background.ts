import {
  GEM_WALLET,
  REQUEST_NETWORK,
  REQUEST_TRANSACTION,
  REQUEST_TRANSACTION_STATUS
} from '@gemwallet/api/src/constants/message';
import { MessageListenerEvent } from '@gemwallet/api/src/constants/message.types';
import { CurrentWindow } from './background.types';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;
let _currentWindowPopup: CurrentWindow = undefined;

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = (): Promise<chrome.windows.Window> => {
  return new Promise((resolve, reject) => {
    // TODO: Makes sure to handle properly the reject
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
chrome.runtime.onMessage.addListener((message: MessageListenerEvent, sender, sendResponse) => {
  const { app, type } = message;
  // We make sure that the message comes from gem-wallet
  if (app === GEM_WALLET && sender.id === chrome.runtime.id) {
    if (type === REQUEST_NETWORK) {
      sendResponse('TEST');
    } else if (type === REQUEST_TRANSACTION) {
      chrome.windows.getAll().then((openedWindows) => {
        // We check if the popup is currently open
        if (
          _currentWindowPopup &&
          openedWindows.find((window) => window.id === _currentWindowPopup?.id)
        ) {
          // TODO: Why popup are created more than one time :O
          chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
        } else {
          const { payload } = message;
          getLastFocusedWindow().then((lastFocused: any) => {
            const top = lastFocused.top;
            const left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
            payload!.id = sender.tab!.id!;
            chrome.windows.create(
              {
                url: `../../index.html${serializeToQueryString(payload)}`,
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
          });
        }
      });
    } else if (type === REQUEST_TRANSACTION_STATUS) {
      const { payload } = message;
      chrome.tabs.sendMessage(payload!.id, {
        app,
        type: REQUEST_TRANSACTION_STATUS,
        payload: {
          hash: payload!.hash,
          error: payload!.error
        }
      });
    }
  }
});
