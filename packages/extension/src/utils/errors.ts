/**
 * Serializes an error to a plain object, since Error objects are not easily serializable.
 * @param error - The error to serialize.
 * @returns A plain object with the error's name, message, and stack.
 */
import * as Sentry from '@sentry/react';

import { MessagingError } from '@gemwallet/constants';

export const serializeError = (error: Error): MessagingError => {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name
  };
};

export const toUIError = (error: Error): Error => {
  if (
    error.message === 'checksum_invalid' ||
    error.message.includes('version_invalid') ||
    error.message === 'Non-base58 character'
  ) {
    return new Error('The destination address is incorrect');
  } else if (error.message === 'tecUNFUNDED_PAYMENT') {
    return new Error('Insufficient funds');
  } else if (error.message === 'tecNO_DST_INSUF_XRP') {
    return new Error(
      'The account you are trying to make this transaction to does not exist, and the transaction is not sending enough XRP to create it.'
    );
  } else if (error.message === 'tecPATH_DRY') {
    return new Error(
      'The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines.'
    );
  } else if (error.message === 'tecTOO_SOON') {
    return new Error('The transaction failed because the account was activated too recently.');
  } else if (error.message.includes('temREDUNDANT')) {
    return new Error(
      'The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer.'
    );
  } else if (error.message.includes('Unsupported Currency representation')) {
    return new Error('The currency is incorrect, you cannot add this trustline.');
  } else {
    Sentry.captureException(error);
    return error;
  }
};
