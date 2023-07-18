import {
  APIMessages,
  GetAddressMessagingResponse,
  GetNetworkMessagingResponse,
  IsInstalledMessagingResponse
} from '@gemwallet/constants';

declare global {
  interface Window {
    gemWallet?: boolean;
    GemWalletApi?: Record<string, any>;
  }
}

/**
 * Sends a message from the current window to the content script.
 *
 * @param msg The message to send.
 * @returns A Promise that resolves with the response from the content script.
 * @throws An error if GemWallet is not connected and the message type is not a connection request.
 */
export const sendMessageToContentScript = (msg: APIMessages): Promise<any> => {
  /* 
    In the case of multiple calls coming in sequentially, we use this MESSAGE_ID to make sure we're responding to
    the appropriate message sender. Otherwise, we can run into race conditions where we simply resolve all 
    sent messages with the first thing that comes back.
  */
  const messageId = Date.now() + Math.random();

  window.postMessage(
    {
      source: 'GEM_WALLET_MSG_REQUEST',
      messageId,
      ...serializeMessage(msg)
    },
    window.location.origin
  );

  return new Promise((resolve, reject) => {
    if (!window.gemWallet && msg.type !== 'REQUEST_IS_INSTALLED/V3') {
      reject(
        new Error(
          'Please check if GemWallet is installed - GemWallet needs to be installed: https://gemwallet.app'
        )
      );
    }

    const messageListener = (event: {
      source: any;
      data:
        | GetNetworkMessagingResponse
        | GetAddressMessagingResponse
        | IsInstalledMessagingResponse;
    }) => {
      // We only accept messages from ourselves
      if (event.source !== window) return;
      // Only respond to messages tagged as being from our content script
      if (event?.data?.source !== 'GEM_WALLET_MSG_RESPONSE') return;
      // Only respond to messages that this instance of sendMessageToContentScript sent
      if (event?.data?.messagedId !== messageId) return;

      resolve(event.data);
      window.removeEventListener('message', messageListener);
    };
    window.addEventListener('message', messageListener, false);
  });
};

/**
 * Serializes the message to be sent to the content script.
 * Fields that are objects are stringified:
 * - memos
 * - amount
 * - limitAmount
 * - flags
 * ...
 *
 * @param msg
 * @returns The message with each object field stringified.
 */
const serializeMessage = (msg: APIMessages): any => {
  const modifiedMsg: any = { ...msg };
  if (modifiedMsg.payload?.memos) {
    modifiedMsg.payload.memos = JSON.stringify(modifiedMsg.payload.memos);
  }

  if (modifiedMsg.payload?.signers) {
    modifiedMsg.payload.signers = JSON.stringify(modifiedMsg.payload.signers);
  }

  if (typeof modifiedMsg.payload?.amount === 'object') {
    modifiedMsg.payload.amount = JSON.stringify(modifiedMsg.payload.amount);
  }

  if (typeof modifiedMsg.payload?.limitAmount === 'object') {
    modifiedMsg.payload.limitAmount = JSON.stringify(modifiedMsg.payload.limitAmount);
  }

  if (typeof modifiedMsg.payload?.takerGets === 'object') {
    modifiedMsg.payload.takerGets = JSON.stringify(modifiedMsg.payload.takerGets);
  }

  if (typeof modifiedMsg.payload?.takerPays === 'object') {
    modifiedMsg.payload.takerPays = JSON.stringify(modifiedMsg.payload.takerPays);
  }

  if (typeof modifiedMsg.payload?.NFTokenBrokerFee === 'object') {
    modifiedMsg.payload.NFTokenBrokerFee = JSON.stringify(modifiedMsg.payload.NFTokenBrokerFee);
  }

  if (typeof modifiedMsg.payload?.flags === 'object') {
    modifiedMsg.payload.flags = JSON.stringify(modifiedMsg.payload.flags);
  }

  if (typeof modifiedMsg.payload?.transaction === 'object') {
    modifiedMsg.payload.transaction = JSON.stringify(modifiedMsg.payload.transaction);
  }

  if (typeof modifiedMsg.payload?.transactions === 'object') {
    modifiedMsg.payload.transactions = JSON.stringify(modifiedMsg.payload.transactions);
  }

  if (modifiedMsg.payload?.NFTokenOffers) {
    modifiedMsg.payload.NFTokenOffers = JSON.stringify(modifiedMsg.payload.NFTokenOffers);
  }

  return modifiedMsg;
};
