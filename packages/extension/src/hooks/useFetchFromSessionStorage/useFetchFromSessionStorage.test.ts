import { renderHook } from '@testing-library/react-hooks';

import { loadFromChromeSessionStorage } from '../../utils';
import { useFetchFromSessionStorage } from './useFetchFromSessionStorage';

// Mock the utilities
jest.mock('../../utils', () => ({
  ...(jest.requireActual('../../utils') as object),
  loadFromChromeSessionStorage: jest.fn()
}));

describe('useFetchFromSessionStorage', () => {
  it('fetches data from session storage', async () => {
    const key = 'test-key';
    const storedData = JSON.stringify({ data: 'test-data' });

    (loadFromChromeSessionStorage as jest.Mock).mockResolvedValue(storedData);

    const { result, waitForNextUpdate } = renderHook(() => useFetchFromSessionStorage(key));

    // Waiting for the async operation to complete
    await waitForNextUpdate();

    expect(result.current.fetchedData).toEqual({ data: 'test-data' });
  });
});
