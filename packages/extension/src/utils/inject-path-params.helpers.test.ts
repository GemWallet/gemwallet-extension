import { injectPathParams } from './inject-path-params.helpers';

describe('injectPathParams', () => {
  it('replaces path params with provided values', () => {
    expect(injectPathParams('accounts/:accountId', { accountId: '123456' })).toBe(
      'accounts/123456'
    );
    expect(injectPathParams('thing/:a/:b/something/:c', { a: 'x', b: 'y', c: 'z' })).toBe(
      'thing/x/y/something/z'
    );
  });

  it('works with paths that have no params', () => {
    expect(injectPathParams('test/something', { test: 'a' })).toBe('test/something');
  });

  it('adds query string when provided', () => {
    // search string
    expect(injectPathParams('test/:id', { id: 'abc123' }, 'awesome=yes')).toBe(
      'test/abc123?awesome=yes'
    );
    // search object
    expect(
      injectPathParams('test/:id', { id: 'abc123' }, { awesome: 'yes', cool: 'yes', lame: 'no' })
    ).toBe('test/abc123?awesome=yes&cool=yes&lame=no');
  });
});
