import {
  SubmitBulkTransactionsResponse,
  GEM_WALLET,
  ResponseType,
  RequestSubmitBulkTransactionsMessage,
  TransactionWithID,
  SubmitBulkTransactionsRequest
} from '@gemwallet/constants';

import { deserializeError } from '../helpers/errors';
import { sendMessageToContentScript } from '../helpers/extensionMessaging';

const MAX_TRANSACTIONS = 50;

export const submitBulkTransactions = async (
  payload: SubmitBulkTransactionsRequest
): Promise<SubmitBulkTransactionsResponse> => {
  let response: SubmitBulkTransactionsResponse = {
    type: ResponseType.Reject,
    result: undefined
  };

  if (payload.transactions.length === 0 || payload.transactions.length > MAX_TRANSACTIONS) {
    throw new Error(`Invalid number of transactions (must be between 1 and ${MAX_TRANSACTIONS})`);
  }

  try {
    const message: RequestSubmitBulkTransactionsMessage = {
      app: GEM_WALLET,
      type: 'REQUEST_SUBMIT_BULK_TRANSACTIONS/V3',
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
