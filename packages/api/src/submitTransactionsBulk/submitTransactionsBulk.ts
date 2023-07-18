import {
  SubmitTransactionsBulkRequest,
  SubmitTransactionsBulkResponse,
  GEM_WALLET,
  RequestSubmitTransactionsBulkMessage,
  ResponseType
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

export const submitTransactionsBulk = async (
  payload: SubmitTransactionsBulkRequest
): Promise<SubmitTransactionsBulkResponse> => {
  let response: SubmitTransactionsBulkResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  try {
    const message: RequestSubmitTransactionsBulkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SUBMIT_TRANSACTIONS_BULK/V3',
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
