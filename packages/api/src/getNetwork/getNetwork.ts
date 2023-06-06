import {
  GEM_WALLET,
  GetNetworkResponse,
  RequestGetNetworkMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const getNetwork = async (): Promise<GetNetworkResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - network: network name
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
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
