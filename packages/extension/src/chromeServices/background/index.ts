import {
  BackgroundMessage,
  EventLogoutBackgroundMessage,
  GEM_WALLET,
  InternalReceivePasswordContentMessage,
  MSG_INTERNAL_RECEIVE_PASSWORD,
  MSG_INTERNAL_REQUEST_PASSWORD,
  MSG_INTERNAL_RECEIVE_SIGN_OUT,
  ReceiveAcceptNFTOfferContentMessage,
  ReceiveBurnNFTContentMessage,
  ReceiveCancelNFTOfferContentMessage,
  ReceiveCancelOfferContentMessage,
  ReceiveCreateNFTOfferContentMessage,
  ReceiveCreateOfferContentMessage,
  ReceiveGetAddressContentMessage,
  ReceiveGetAddressContentMessageDeprecated,
  ReceiveGetNFTContentMessage,
  ReceiveGetNFTContentMessageDeprecated,
  ReceiveMintNFTContentMessage,
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
  ReceiveSignTransactionContentMessage,
  ReceiveSubmitTransactionContentMessage,
  ResponseType,
  RequestPayload,
  ReceiveMessage
} from '@gemwallet/constants';

import {
  PARAMETER_SHARE_ADDRESS,
  PARAMETER_SHARE_NETWORK,
  PARAMETER_SHARE_NFT,
  PARAMETER_SHARE_PUBLIC_KEY,
  PARAMETER_SIGN_MESSAGE,
  PARAMETER_SIGN_TRANSACTION,
  PARAMETER_SUBMIT_TRANSACTION,
  PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
  PARAMETER_TRANSACTION_BURN_NFT,
  PARAMETER_TRANSACTION_CANCEL_NFT_OFFER,
  PARAMETER_TRANSACTION_CANCEL_OFFER,
  PARAMETER_TRANSACTION_CREATE_NFT_OFFER,
  PARAMETER_TRANSACTION_CREATE_OFFER,
  PARAMETER_TRANSACTION_MINT_NFT,
  PARAMETER_TRANSACTION_PAYMENT,
  PARAMETER_TRANSACTION_TRUSTLINE,
  PARAMETER_TRANSACTION_SET_ACCOUNT,
  PARAMETER_SUBMIT_TRANSACTIONS_BULK
} from '../../constants/parameters';
import { STORAGE_CURRENT_WINDOW_ID, STORAGE_STATE_TRANSACTION } from '../../constants/storage';
import { generateKey } from '../../utils/storage';
import {
  loadFromChromeSessionStorage,
  saveInChromeSessionStorage
} from '../../utils/storageChromeSession';
import {
  FocusOrCreatePopupWindowParam,
  focusOrCreatePopupWindow
} from './utils/focusOrCreatePopupWindow';
import { createOffscreen } from './utils/offscreen';
import { buildRejectMessage } from './utils/rejectOnClose';
import { Session } from './utils/session';

const sendMessageToTab = <T>(tabId: number | undefined, message: any) => {
  chrome.tabs.sendMessage<T>(tabId ?? 0, message);
};

chrome.runtime.onStartup.addListener(createOffscreen);
chrome.runtime.onMessage.addListener((e) => {}); // keepAlive

const session = Session.getInstance();
let currentReceivingMessage: string | undefined = undefined; // For reject message on popup close

// Used to send a message to the view through the chrome.storage.local memory.
// Useful when the data to send is big.
const sendMessageInMemory = ({
  payload,
  parameter,
  receivingMessage,
  sender
}: {
  payload: RequestPayload;
  parameter: string;
  receivingMessage: ReceiveMessage;
  sender: chrome.runtime.MessageSender;
}) => {
  const key = generateKey();
  saveInChromeSessionStorage(key, JSON.stringify(payload)).then((r) =>
    handleTransactionRequest({
      payload: {
        storageKey: key
      },
      sender,
      parameter,
      receivingMessage,
      errorPayload: {
        type: ResponseType.Reject,
        result: undefined
      }
    })
  );
};

const handleTransactionRequest = async (payload: FocusOrCreatePopupWindowParam) => {
  const { currentWindowId } = await chrome.storage.local.get(STORAGE_CURRENT_WINDOW_ID);
  const openedWindows = await chrome.windows.getAll();
  const windowStillOpened =
    currentWindowId && openedWindows.find((window) => window.id === currentWindowId);

  // Do not allow multiple transactions at the same time
  const hasTxInProgress = await loadFromChromeSessionStorage(STORAGE_STATE_TRANSACTION);
  if (Boolean(hasTxInProgress) && windowStillOpened) {
    return Promise.resolve();
  }

  if (windowStillOpened) {
    await chrome.storage.local.remove(STORAGE_CURRENT_WINDOW_ID);
    await chrome.windows.remove(currentWindowId);
  }

  currentReceivingMessage = payload.receivingMessage;
  saveInChromeSessionStorage(STORAGE_STATE_TRANSACTION, true);
  focusOrCreatePopupWindow(payload);
};

const handleTransactionResponse = <T>(id: number, payload: any) => {
  saveInChromeSessionStorage(STORAGE_STATE_TRANSACTION, false);
  sendMessageToTab<T>(id, payload);
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

    /*
     * Internal messages
     */
    if (type === MSG_INTERNAL_RECEIVE_SIGN_OUT) {
      session.endSession();
    } else if (
      type === MSG_INTERNAL_RECEIVE_PASSWORD &&
      (message as InternalReceivePasswordContentMessage).payload.password
    ) {
      session.startSession((message as InternalReceivePasswordContentMessage).payload.password);
    } else if (type === MSG_INTERNAL_REQUEST_PASSWORD) {
      chrome.runtime.sendMessage(chrome.runtime.id, {
        app: GEM_WALLET,
        type: MSG_INTERNAL_RECEIVE_PASSWORD,
        payload: {
          password: session.getPassword()
        }
      } as InternalReceivePasswordContentMessage);
      /*
       * Request messages
       */
    } else if (type === 'REQUEST_GET_NETWORK/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
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
      handleTransactionRequest({
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
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_ADDRESS,
        receivingMessage: 'RECEIVE_ADDRESS',
        errorPayload: {
          publicAddress: undefined
        }
      });
    } else if (type === 'REQUEST_GET_PUBLIC_KEY/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
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
      handleTransactionRequest({
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
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SHARE_NFT,
        receivingMessage: 'RECEIVE_NFT',
        errorPayload: {
          nfts: undefined
        }
      });
    } else if (type === 'REQUEST_SEND_PAYMENT/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_PAYMENT,
        receivingMessage: 'RECEIVE_PAYMENT_HASH',
        errorPayload: {
          hash: undefined
        }
      });
    } else if (type === 'REQUEST_MINT_NFT/V3') {
      const { payload } = message;
      try {
        sendInMemoryMessage({
          payload,
          parameter: PARAMETER_TRANSACTION_MINT_NFT,
          receivingMessage: 'RECEIVE_MINT_NFT/V3',
          sender
        });
      } catch (e) {}
    } else if (type === 'REQUEST_CREATE_NFT_OFFER/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
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
      const { payload } = message;
      try {
        sendInMemoryMessage({
          payload,
          parameter: PARAMETER_TRANSACTION_ACCEPT_NFT_OFFER,
          receivingMessage: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
          sender
        });
      } catch (e) {}
    } else if (type === 'REQUEST_BURN_NFT/V3') {
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_BURN_NFT,
        receivingMessage: 'RECEIVE_BURN_NFT/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_SET_ACCOUNT/V3') {
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_SET_ACCOUNT,
        receivingMessage: 'RECEIVE_SET_ACCOUNT/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_CREATE_OFFER/V3') {
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_CREATE_OFFER,
        receivingMessage: 'RECEIVE_CREATE_OFFER/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_CANCEL_OFFER/V3') {
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_CANCEL_OFFER,
        receivingMessage: 'RECEIVE_CANCEL_OFFER/V3',
        errorPayload: {
          type: ResponseType.Reject,
          result: undefined
        }
      });
    } else if (type === 'REQUEST_SET_TRUSTLINE/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_TRANSACTION_TRUSTLINE,
        receivingMessage: 'RECEIVE_TRUSTLINE_HASH',
        errorPayload: {
          hash: undefined
        }
      });
    } else if (type === 'REQUEST_SIGN_MESSAGE/V3') {
      handleTransactionRequest({
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
      handleTransactionRequest({
        payload: message.payload,
        sender,
        parameter: PARAMETER_SIGN_MESSAGE,
        receivingMessage: 'RECEIVE_SIGN_MESSAGE',
        errorPayload: {
          signedMessage: undefined
        }
      });
    } else if (type === 'REQUEST_SUBMIT_TRANSACTION/V3') {
      const { payload } = message;
      try {
        sendMessageInMemory({
          payload,
          parameter: PARAMETER_SUBMIT_TRANSACTION,
          receivingMessage: 'RECEIVE_SUBMIT_TRANSACTION/V3',
          sender
        });
      } catch (e) {}
    } else if (type === 'REQUEST_SIGN_TRANSACTION/V3') {
      const { payload } = message;
      try {
        sendMessageInMemory({
          payload,
          parameter: PARAMETER_SIGN_TRANSACTION,
          receivingMessage: 'RECEIVE_SIGN_TRANSACTION/V3',
          sender
        });
      } catch (e) {}
    } else if (type === 'REQUEST_SUBMIT_BULK_TRANSACTIONS/V3') {
      const { payload } = message;
      try {
        sendMessageInMemory({
          payload,
          parameter: PARAMETER_SUBMIT_TRANSACTIONS_BULK,
          receivingMessage: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3',
          sender
        });
      } catch (e) {}
      /*
       * Receive messages
       */
    } else if (type === 'RECEIVE_SEND_PAYMENT/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSendPaymentContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveSendPaymentContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_PAYMENT_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_MINT_NFT/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveMintNFTContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveCreateNFTOfferContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveCancelNFTOfferContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveAcceptNFTOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_ACCEPT_NFT_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_BURN_NFT/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveBurnNFTContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_BURN_NFT/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_SET_ACCOUNT/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSetAccountContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SET_ACCOUNT/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_CREATE_OFFER/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveCreateOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_CREATE_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_CANCEL_OFFER/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveCancelOfferContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_CANCEL_OFFER/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_SET_TRUSTLINE/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSetTrustlineContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveSetTrustlineContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          hash: payload.hash
        }
      });
    } else if (type === 'RECEIVE_GET_ADDRESS/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveGetAddressContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveGetAddressContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_ADDRESS',
        payload: {
          publicAddress: payload.publicAddress
        }
      });
    } else if (type === 'RECEIVE_GET_NETWORK/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveGetNetworkContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveGetNetworkContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_NETWORK',
        payload: {
          network: payload.network
        }
      });
    } else if (type === 'RECEIVE_GET_PUBLIC_KEY/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveGetPublicKeyContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveGetPublicKeyContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_PUBLIC_KEY',
        payload: {
          address: payload.address,
          publicKey: payload.publicKey
        }
      });
    } else if (type === 'RECEIVE_GET_NFT/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveGetNFTContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveGetNFTContentMessageDeprecated>(payload.id, {
        app,
        type: 'RECEIVE_NFT',
        payload: {
          nfts: payload.nfts
        }
      });
    } else if (type === 'RECEIVE_SIGN_MESSAGE/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSignMessageContentMessage>(payload.id, {
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
      handleTransactionResponse<ReceiveSignMessageContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SIGN_MESSAGE',
        payload: {
          signedMessage: payload.signedMessage
        }
      });
    } else if (type === 'RECEIVE_SUBMIT_TRANSACTION/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSubmitTransactionContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SUBMIT_TRANSACTION/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_SIGN_TRANSACTION/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSignTransactionContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SIGN_TRANSACTION/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
    } else if (type === 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3') {
      const { payload } = message;
      handleTransactionResponse<ReceiveSubmitTransactionContentMessage>(payload.id, {
        app,
        type: 'RECEIVE_SUBMIT_BULK_TRANSACTIONS/V3',
        payload: {
          type: ResponseType.Response,
          result: payload.result,
          error: payload.error
        }
      });
      /*
       * Events
       */
    } else if (type === 'EVENT_NETWORK_CHANGED') {
      const { payload } = message;
      sendToActiveTabs({
        app,
        type: 'EVENT_NETWORK_CHANGED',
        source: 'GEM_WALLET_MSG_REQUEST',
        payload: {
          result: payload.result
        }
      });
    } else if (type === 'EVENT_WALLET_CHANGED') {
      const { payload } = message;
      sendToActiveTabs({
        app,
        type: 'EVENT_WALLET_CHANGED',
        source: 'GEM_WALLET_MSG_REQUEST',
        payload: {
          result: payload.result
        }
      });
    } else if (type === 'EVENT_LOGIN') {
      const { payload } = message;
      sendToActiveTabs({
        app,
        type: 'EVENT_LOGIN',
        source: 'GEM_WALLET_MSG_REQUEST',
        payload: {
          result: payload.result
        }
      });
    }
  }
);

/*
 * Rejection messages management (when the popup is closed)
 */
chrome.windows.onRemoved.addListener(function (windowId) {
  // Check if the closed window is your extension's popup
  isPopupWindow(windowId).then((isPopup) => {
    if (isPopup && currentReceivingMessage) {
      const response = buildRejectMessage(currentReceivingMessage);
      sendToActiveTabs(response);
    }
  });
});

// Read the windowId from storage and check if it matches the closed window's id
const isPopupWindow = async (windowId: number): Promise<boolean> => {
  const { currentWindowId } = await chrome.storage.local.get(STORAGE_CURRENT_WINDOW_ID);
  return windowId === currentWindowId;
};

// Called by the session manager
export const handleLogoutEvent = (message: EventLogoutBackgroundMessage) => {
  const { payload } = message;
  sendToActiveTabs({
    app: message.app,
    type: 'EVENT_LOGOUT',
    source: 'GEM_WALLET_MSG_REQUEST',
    payload: {
      result: payload.result
    }
  });
};

/*
 * Tabs management
 */
const activeTabs = new Set<number>();

chrome.runtime.onMessage.addListener((request, sender) => {
  if (sender.tab?.id !== undefined) {
    if (request.type === 'CONTENT_SCRIPT_LOADED') {
      activeTabs.add(sender.tab.id);
    } else if (request.type === 'CONTENT_SCRIPT_UNLOADED') {
      try {
        activeTabs.delete(sender.tab.id);
      } catch {}
    }
  }
});

const sendToActiveTabs = (payload: any): void => {
  activeTabs.forEach((tabId) => {
    chrome.tabs.get(tabId, () => {
      if (!chrome.runtime.lastError) {
        chrome.tabs.sendMessage(tabId, payload);
      }
    });
  });
};
