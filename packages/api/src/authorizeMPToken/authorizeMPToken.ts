import {
  AuthorizeMPTokenRequest,
  AuthorizeMPTokenResponse,
  GEM_WALLET,
  RequestAuthorizeMPTokenMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const authorizeMPToken = async (
  payload: AuthorizeMPTokenRequest
): Promise<AuthorizeMPTokenResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - hash: hash of the transaction
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: AuthorizeMPTokenResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestAuthorizeMPTokenMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_AUTHORIZE_MPTOKEN/V3',
      payload
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
