import { Transaction } from 'xrpl';

import { GEM_WALLET, RequestSignTransactionMessage } from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';

export const signTransaction = async (transaction: Transaction) => {
  /* string: signed message
   * null: user refused to pass the address
   * undefined: something went wrong
   */
  let response: string | null | undefined = undefined;
  try {
    const favicon = getFavicon();
    const messageToContentScript: RequestSignTransactionMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SIGN_TRANSACTION/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        transaction
      }
    };
    const { signedMessage } = await sendMessageToContentScript(messageToContentScript);
    response = signedMessage;
  } catch (e) {
    throw e;
  }

  return response;
};
