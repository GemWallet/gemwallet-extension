import * as Sentry from '@sentry/react';

import { MessagingError } from '@gemwallet/constants';

import { deserializeError, serializeError, toUIError } from './errors';

jest.mock('@sentry/react');

describe('Error utils', () => {
  const mockError = new Error('Test Error');
  mockError.name = 'TestError';
  mockError.stack = 'stack trace';

  describe('serializeError', () => {
    it('should return a serialized error object', () => {
      const result: MessagingError = serializeError(mockError);
      expect(result).toEqual({
        name: 'TestError',
        message: 'Test Error',
        stack: 'stack trace'
      });
    });
  });

  describe('deserializeError', () => {
    it('should return a deserialized Error instance', () => {
      const serializedError: MessagingError = {
        name: 'TestError',
        message: 'Test Error',
        stack: 'stack trace'
      };

      const result: Error = deserializeError(serializedError);
      expect(result).toBeInstanceOf(Error);
      expect(result.name).toEqual('TestError');
      expect(result.message).toEqual('Test Error');
      expect(result.stack).toEqual('stack trace');
    });
  });

  describe('toUIError', () => {
    it('should map error messages to UI errors', () => {
      let result;

      const tecUNFUNDED_PAYMENTError = new Error('tecUNFUNDED_PAYMENT');
      result = toUIError(tecUNFUNDED_PAYMENTError);
      expect(result.message).toEqual('Insufficient funds');

      const checksumInvalidError = new Error('checksum_invalid');
      result = toUIError(checksumInvalidError);
      expect(result.message).toEqual('The destination address is incorrect');

      const versionInvalidError = new Error('version_invalid');
      result = toUIError(versionInvalidError);
      expect(result.message).toEqual('The destination address is incorrect');

      const nonBase58CharacterError = new Error('Non-base58 character');
      result = toUIError(nonBase58CharacterError);
      expect(result.message).toEqual('The destination address is incorrect');

      const tecNO_DST_INSUF_XRPError = new Error('tecNO_DST_INSUF_XRP');
      result = toUIError(tecNO_DST_INSUF_XRPError);
      expect(result.message).toEqual(
        'The account you are trying to make this transaction to does not exist, and the transaction is not sending enough XRP to create it.'
      );

      const tecPATH_DRYError = new Error('tecPATH_DRY');
      result = toUIError(tecPATH_DRYError);
      expect(result.message).toEqual(
        'The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines.'
      );

      const temREDUNDANTError = new Error('temREDUNDANT');
      result = toUIError(temREDUNDANTError);
      expect(result.message).toEqual(
        'The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer.'
      );
    });

    it('should capture exception in Sentry if no specific UI error is defined', () => {
      const unknownError = new Error('Unknown error');
      toUIError(unknownError);
      expect(Sentry.captureException).toHaveBeenCalledWith(unknownError);
    });
  });
});
