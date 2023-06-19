import {
  BackgroundMessage,
  GEM_WALLET,
  ReceiveAcceptNFTOfferContentMessage,
  ReceiveCancelNFTOfferContentMessage,
  ReceiveCreateNFTOfferContentMessage,
  ReceiveGetAddressContentMessage,
  ReceiveGetAddressContentMessageDeprecated,
  ReceiveGetNFTContentMessage,
  ReceiveGetNFTContentMessageDeprecated,
  ReceiveMessage,
  ReceiveMintNFTContentMessage,
  ReceiveGetNetworkContentMessage,
  ReceiveGetNetworkContentMessageDeprecated,
  ReceiveGetPublicKeyContentMessage,
  ReceiveGetPublicKeyContentMessageDeprecated,
  ReceiveSendPaymentContentMessage,
  ReceiveSendPaymentContentMessageDeprecated,
  ReceiveSetTrustlineContentMessage,
  ReceiveSetTrustlineContentMessageDeprecated,
  ReceiveSignMessageContentMessage,
  RequestMessage,
  RequestPayload,
  ResponsePayload,
  ResponseType
} from '@gemwallet/constants';

import {
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SHARE_NETWORK,
  PARAMETER_SHARE_NFT,
  PARAMETER_SHARE_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_TRUSTLINE
} from './../constants/parameters';
import { MAIN_FILE } from './../constants/routes';

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;

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

const focusOrCreatePopupWindow = async ({
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

/*
 * Keep only one listener for easier debugging
 */
chrome.runtime.onMessage.addListener(
  (message: BackgroundMessage, sender: chrome.runtime.MessageSender) => {
    const { app, type } = message;
    // We make sure that the message comes from gem-wallet
    if (app !== GEM_WALLET || sender.id !== chrome.runtime.id) {
      return; // exit early if the message is not from gem-wallet or the sender is not the extension itself
    }

    if (type === 'REQUEST_GET_NETWORK/V3') {
      focusOrCreatePopupWindow({
        payload: {
          id: sender.tab?.id
        },
        sender,
        parameter: PARAMETER_SHARE_NETWORK,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_GET_NETWORK/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        },
        width: 1,
        height: 1
      });
    } else if (type === 'REQUEST_NETWORK') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: {
          id: sender.tab?.id
        },
        sender,
        parameter: PARAMETER_SHARE_NETWORK,
        receivingMessage: 'RECEIVE_NETWORK',
        errorPayload: {
          network: undefined
        },
        width: 1,
        height: 1
      });
    } else if (type === 'REQUEST_GET_ADDRESS/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_ADDRESS,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_GET_ADDRESS/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_ADDRESS') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_ADDRESS,
        receivingMessage: 'RECEIVE_ADDRESS',
        errorPayload: {
          publicAddress: undefined
        }
      });
    } else if (type === 'REQUEST_GET_PUBLIC_KEY/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_PUBLIC_KEY,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_GET_PUBLIC_KEY/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_PUBLIC_KEY') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_PUBLIC_KEY,
        receivingMessage: 'RECEIVE_PUBLIC_KEY',
        errorPayload: {
          address: undefined,
          publicKey: undefined
        }
      });
    } else if (type === 'REQUEST_GET_NFT/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_NFT,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_GET_NFT/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_NFT') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_NFT,
        receivingMessage: 'RECEIVE_NFT',
        errorPayload: {
          nfts: undefined
        }
      });
    } else if (type === 'REQUEST_SEND_PAYMENT/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_PAYMENT,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_SEND_PAYMENT/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'SEND_PAYMENT') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_PAYMENT,
        receivingMessage: 'RECEIVE_PAYMENT_HASH',
        errorPayload: {
          hash: undefined
        }
      });
    } else if (type === 'REQUEST_MINT_NFT/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_MINT_NFT,
        receivingMessage: 'RECEIVE_MINT_NFT/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_CREATE_NFT_OFFER/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
        receivingMessage: 'RECEIVE_CREATE_NFT_OFFER/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_CANCEL_NFT_OFFER/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
        receivingMessage: 'RECEIVE_CANCEL_NFT_OFFER/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_ACCEPT_NFT_OFFER/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
        receivingMessage: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_SET_TRUSTLINE/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_TRUSTLINE,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_SET_TRUSTLINE/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_ADD_TRUSTLINE') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_TRUSTLINE,
        receivingMessage: 'RECEIVE_TRUSTLINE_HASH',
        errorPayload: {
          hash: undefined
        }
      });
    } else if (type === 'REQUEST_SIGN_MESSAGE/V3') {
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SIGN_MESSAGE,
        requestMessage: message.type,
        receivingMessage: 'RECEIVE_SIGN_MESSAGE/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_SIGN_MESSAGE') {
      // Deprecated
      focusOrCreatePopupWindow({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SIGN_MESSAGE,
        receivingMessage: 'RECEIVE_SIGN_MESSAGE',
        errorPayload: {
          signedMessage: undefined
        }
      });
    } else if (type === 'RECEIVE_SEND_PAYMENT/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveSendPaymentContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SEND_PAYMENT/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_PAYMENT_HASH') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveSendPaymentContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_PAYMENT_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_MINT_NFT/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveMintNFTContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_MINT_NFT/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_CREATE_NFT_OFFER/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveCreateNFTOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_CREATE_NFT_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_CANCEL_NFT_OFFER/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveCancelNFTOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_CANCEL_NFT_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_ACCEPT_NFT_OFFER/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveAcceptNFTOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_SET_TRUSTLINE/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveSetTrustlineContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SET_TRUSTLINE/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_TRUSTLINE_HASH') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveSetTrustlineContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_GET_ADDRESS/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveGetAddressContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_GET_ADDRESS/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_ADDRESS') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveGetAddressContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_ADDRESS',
        payload: {
          publicAddress: payload.publicAddress
        }
      });
    } else if (type === 'RECEIVE_GET_NETWORK/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveGetNetworkContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_GET_NETWORK/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_NETWORK') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveGetNetworkContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_NETWORK',
        payload: {
          network: payload.network
        }
      });
    } else if (type === 'RECEIVE_GET_PUBLIC_KEY/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveGetPublicKeyContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_GET_PUBLIC_KEY/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_PUBLIC_KEY') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveGetPublicKeyContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_PUBLIC_KEY',
        payload: {
          address: payload.address,
          publicKey: payload.publicKey
        }
      });
    } else if (type === 'RECEIVE_GET_NFT/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveGetNFTContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_GET_NFT/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_NFT') {
      // Deprecated
      const { payload } = message;
      sendMessageToTab<ReceiveGetNFTContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_NFT',
        payload: {
          nfts: payload.nfts
        }
      });
    } else if (type === 'RECEIVE_SIGN_MESSAGE/V3') {
      const { payload } = message;
      sendMessageToTab<ReceiveSignMessageContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SIGN_MESSAGE/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
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
