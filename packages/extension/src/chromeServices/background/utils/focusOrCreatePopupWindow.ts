import {
  GEM_WALLET,
  ReceiveMessage,
  RequestMessage,
  RequestPayload,
  ResponsePayload
} from '@gemwallet/constants';

import { MAIN_FILE } from '../../../constants/routes';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = (): Promise<chrome.windows.Window> =>
  new Promise((resolve) => chrome.windows.getLastFocused(resolve));

export const serializeToQueryString = (payload?: Record<string, any>) =>
  payload
    ? '?' +
      Object.entries(payload)
        .map(([key, value]) => [key, value].map(encodeURIComponent).join('='))
        .join('&')
    : '';

export const focusOrCreatePopupWindow = async ({
  payload,
  sender,
  parameter,
  requestMessage,
  receivingMessage,
  errorPayload,
  width = NOTIFICATION_WIDTH,
  height = NOTIFICATION_HEIGHT
}: {
  payload: RequestPayload;
  sender: chrome.runtime.MessageSender;
  parameter: string;
  //TODO: This parameter is optional till we refactor the messaging system
  requestMessage?: RequestMessage;
  receivingMessage: ReceiveMessage;
  errorPayload: ResponsePayload;
  width?: number;
  height?: number;
}): Promise<void> => {
  try {
    const openedWindows = await chrome.windows.getAll();
    const { currentWindowId } = await chrome.storage.local.get('currentWindowId');

    if (currentWindowId && openedWindows.find((window) => window.id === currentWindowId)) {
      chrome.windows.update(currentWindowId, { focused: true });
    } else {
      const lastFocusedWindow = await getLastFocusedWindow();

      const currentWindow = await chrome.windows.create({
        url: `../..${MAIN_FILE}${serializeToQueryString({
          ...payload,
          id: sender.tab?.id,
          requestMessage: requestMessage
        })}&${parameter}`,
        type: 'popup',
        width,
        height,
        left:
          lastFocusedWindow?.left && lastFocusedWindow?.width
            ? lastFocusedWindow.left + (lastFocusedWindow.width - NOTIFICATION_WIDTH)
            : undefined,
        top: lastFocusedWindow?.top
      });

      chrome.storage.local.set({ currentWindowId: currentWindow.id });
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
