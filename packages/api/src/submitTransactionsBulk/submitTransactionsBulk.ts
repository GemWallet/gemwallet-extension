import {
  SubmitTransactionsBulkResponse,
  GEM_WALLET,
  ResponseType,
  RequestSubmitTransactionsBulkMessage,
  TransactionWithID,
  SubmitTransactionsBulkRequest
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

const MAX_TRANSACTIONS = 50;

export const submitTransactionsBulk = async (
  payload: SubmitTransactionsBulkRequest
): Promise<SubmitTransactionsBulkResponse> => {
  let response: SubmitTransactionsBulkResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  if (payload.transactions.length === 0 || payload.transactions.length > MAX_TRANSACTIONS) {
    throw new Error('Invalid number of transactions');
  }

  try {
    const message: RequestSubmitTransactionsBulkMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SUBMIT_TRANSACTIONS_BULK/V3',
      payload: {
        ...payload,
        // Add an index to each transaction so that we can process them in order
        transactions: payload.transactions.reduce((acc, transaction, index) => {
          acc[index] = transaction;
          return acc;
        }, {} as Record<number, TransactionWithID>)
      }
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
