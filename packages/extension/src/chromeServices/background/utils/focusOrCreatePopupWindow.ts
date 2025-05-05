import {
  GEM_WALLET,
  ReceiveMessage,
  RequestMessage,
  RequestPayload,
  ResponsePayload
} from '@gemwallet/constants';

import { MAIN_FILE } from '../../../constants/paths';
import { POPUP_HEIGHT, POPUP_WIDTH, WINDOWS_POPUP_PADDING } from '../../../constants/sizes';
import { STORAGE_CURRENT_WINDOW_ID } from '../../../constants/storage';
import { isBoolean, isString } from '../../../utils';
import { isNumber } from 'xrpl/dist/npm/models/transactions/common';

const isWindows = navigator.userAgent.includes('Win');

/**
 * Return a promise which will resolve the window object
 * from where the extension was called
 */
const getLastFocusedWindow = (): Promise<chrome.windows.Window> =>
  new Promise((resolve) => chrome.windows.getLastFocused(resolve));

/**
 * Its a helper function to encode only compatible values
 * Necessary to avoid types errors from TS
 */
const encodeOnlyCompatibleValueURIComponent = (uriComponent?: unknown) => {
  if (isString(uriComponent) || isNumber(uriComponent) || isBoolean(uriComponent))
    return encodeURIComponent(uriComponent);
};

export const serializeToQueryString = (payload?: Record<string, unknown | undefined>) =>
  payload
    ? '?' +
      Object.entries(payload)
        .map(([key, value]) => [key, value].map(encodeOnlyCompatibleValueURIComponent).join('='))
        .join('&')
    : '';

export type FocusOrCreatePopupWindowParam = {
  payload: RequestPayload;
  sender: chrome.runtime.MessageSender;
  parameter: string;
  //TODO: This parameter is optional till we refactor the messaging system
  requestMessage?: RequestMessage;
  receivingMessage: ReceiveMessage;
  errorPayload: ResponsePayload;
  width?: number;
  height?: number;
};

export const focusOrCreatePopupWindow = async ({
  payload,
  sender,
  parameter,
  requestMessage,
  receivingMessage,
  errorPayload,
  width = isWindows ? POPUP_WIDTH + WINDOWS_POPUP_PADDING : POPUP_WIDTH,
  height = isWindows ? POPUP_HEIGHT + WINDOWS_POPUP_PADDING : POPUP_HEIGHT
}: FocusOrCreatePopupWindowParam): Promise<void> => {
  try {
    const openedWindows = await chrome.windows.getAll();
    const { currentWindowId } = await chrome.storage.local.get(STORAGE_CURRENT_WINDOW_ID);

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
            ? lastFocusedWindow.left + (lastFocusedWindow.width - POPUP_WIDTH)
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
