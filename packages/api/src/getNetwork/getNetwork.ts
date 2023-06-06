import {
  GEM_WALLET,
  GetNetworkResponse,
  RequestGetNetworkMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async (): Promise<GetNetworkResponse> => {
  /* string: network
   * undefined: something went wrong
   */
  let response: GetNetworkResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestGetNetworkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_GET_NETWORK/V3'
    };
    const { result, error } = await sendMessageToContentScript(message);
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
