import { Message, CurrentWindow } from './background.types';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;
let _currentWindowPopup: CurrentWindow = undefined;

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = () => {
  return new Promise((resolve, reject) => {
    // TODO: Makes sure to handle properly the reject
    chrome.windows.getLastFocused((windowObject) => {
      return resolve(windowObject);
    });
  });
};

chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
  const { app, type } = message;
  // We make sure that the message comes from gem-wallet
  if (app === 'gem-wallet' && sender.id === chrome.runtime.id) {
    if (type === 'transaction-emit') {
      const openedWindows = await chrome.windows.getAll();
      // We check if the popup is currently open
      if (
        _currentWindowPopup &&
        openedWindows.find((window) => window.id === _currentWindowPopup?.id)
      ) {
        // TODO: Why popup are created more than one time :O
        chrome.windows.update(_currentWindowPopup.id as number, { focused: true });
      } else {
        const { parameters } = message;
        const lastFocused: any = await getLastFocusedWindow();
        const top = lastFocused.top;
        const left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
        chrome.windows.create(
          {
            url: `../../index.html${parameters}`,
            type: 'popup',
            width: NOTIFICATION_WIDTH,
            height: NOTIFICATION_HEIGHT,
            left,
            top
          },
          (window) => {
            _currentWindowPopup = window;
          }
        );
      }
    }
  }
});
