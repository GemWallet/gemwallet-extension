import { serializeToQueryString } from './focusOrCreatePopupWindow';

describe('serializeToQueryString', () => {
  test('serializeToQueryString returns the serialized query string', () => {
    const payload = {
      key1: 'value1',
      key2: 'value2'
    };
    const queryString = serializeToQueryString(payload);
    expect(queryString).toEqual('?key1=value1&key2=value2');
  });

  test('serializeToQueryString returns an empty string for undefined payload', () => {
    const queryString = serializeToQueryString(undefined);
    expect(queryString).toEqual('');
  });
});
