import { MessagingError } from '@gemwallet/constants';

export const deserializeError = (error: MessagingError): Error => {
  const e = new Error(error.message);
  e.stack = error.stack;
  e.name = error.name;
  return e;
};
