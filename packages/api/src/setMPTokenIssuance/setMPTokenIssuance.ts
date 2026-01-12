import {
  GEM_WALLET,
  RequestSetMPTokenIssuanceMessage,
  ResponseType,
  SetMPTokenIssuanceRequest,
  SetMPTokenIssuanceResponse
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const setMPTokenIssuance = async (
  payload: SetMPTokenIssuanceRequest
): Promise<SetMPTokenIssuanceResponse> => {
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
  let response: SetMPTokenIssuanceResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSetMPTokenIssuanceMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SET_MPTOKEN_ISSUANCE/V3',
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
