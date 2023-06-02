/**
 * Serializes an error to a plain object, since Error objects are not easily serializable.
 * @param error - The error to serialize.
 * @returns A plain object with the error's name, message, and stack.
 */
import { MessagingError } from '@gemwallet/constants';

export const serializeError = (error: Error): MessagingError => {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name
  };
};

export const deserializeError = (error: MessagingError): Error => {
  const e = new Error(error.message);
  e.stack = error.stack;
  e.name = error.name;
  return e;
};
