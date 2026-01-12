import {
  DestroyMPTokenIssuanceRequest,
  DestroyMPTokenIssuanceResponse,
  GEM_WALLET,
  RequestDestroyMPTokenIssuanceMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const destroyMPTokenIssuance = async (
  payload: DestroyMPTokenIssuanceRequest
): Promise<DestroyMPTokenIssuanceResponse> => {
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
  let response: DestroyMPTokenIssuanceResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestDestroyMPTokenIssuanceMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_DESTROY_MPTOKEN_ISSUANCE/V3',
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
