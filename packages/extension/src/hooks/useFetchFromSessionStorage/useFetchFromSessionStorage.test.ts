import { renderHook, waitFor } from '@testing-library/react';
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

    const { result } = renderHook(() => useFetchFromSessionStorage(key));

    await waitFor(() => expect(result.current.fetchedData).toEqual({ data: 'test-data' }));
  });
});
