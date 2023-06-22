import {
  GEM_WALLET,
  SignTransactionResponse,
  RequestSignTransactionMessage,
  ResponseType,
  SignTransactionRequest
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const signTransaction = async (
  payload: SignTransactionRequest
): Promise<SignTransactionResponse> => {
  /* response:
   * if the transaction succeeds:
   * - type: 'response'
   * - result:
   *    - signedTransaction: signed transaction
   *
   * if the user rejects the transaction:
   * - type: 'reject'
   * - result: undefined
   *
   * if the transaction fails:
   * - throw an error
   */
  let response: SignTransactionResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSignTransactionMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SIGN_TRANSACTION/V3',
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
