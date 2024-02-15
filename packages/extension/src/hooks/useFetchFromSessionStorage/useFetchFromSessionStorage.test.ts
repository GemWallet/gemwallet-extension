import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loadFromChromeSessionStorage } from '../../utils';
import { useFetchFromSessionStorage } from './useFetchFromSessionStorage';

// Mock the utilities
vi.mock('../../utils', () => ({
  loadFromChromeSessionStorage: vi.fn()
}));

describe('useFetchFromSessionStorage', () => {
  let storedData;

  beforeEach(() => {
    storedData = JSON.stringify({ data: 'test-data' });
    vi.mocked(loadFromChromeSessionStorage).mockResolvedValue(storedData);
  });

  it('fetches data from session storage', async () => {
    const key = 'test-key';

    const { result, waitForNextUpdate } = renderHook(() => useFetchFromSessionStorage(key));

    // Waiting for the async operation to complete
    await waitForNextUpdate();

    expect(result.current.fetchedData).toEqual({ data: 'test-data' });
  });
});
