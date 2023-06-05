import { MessagingError } from '@gemwallet/constants';

import { deserializeError } from './errors';

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
