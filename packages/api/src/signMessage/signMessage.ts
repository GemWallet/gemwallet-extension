import {
  GEM_WALLET,
  RequestSignMessageMessage,
  ResponseType,
  SignMessageResponse
} from '@gemwallet/constants';

import { sendMessageToContentScript } from '../helpers/extensionMessaging';
import { getFavicon } from '../helpers/getFavicon';
import { deserializeError } from '../utils/errors';

export const signMessage = async (message: string): Promise<SignMessageResponse> => {
  /* string: signed message
   * null: user refused to pass the address
   * undefined: something went wrong
   */
  let response: SignMessageResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const favicon = getFavicon();
    const messageToContentScript: RequestSignMessageMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SIGN_MESSAGE/V3',
      payload: {
        url: window.location.origin,
        title: document.title,
        favicon,
        message
      }
    };
    const { result, error } = await sendMessageToContentScript(messageToContentScript);
    const parsedError = error ? deserializeError(error) : undefined;
    if (parsedError) {
      throw parsedError;
    }

    if (result) {
      response.type = ResponseType.Response;
      response.result = result;
    }
  } catch (e) {
    throw e;
  }

  return response;
};
