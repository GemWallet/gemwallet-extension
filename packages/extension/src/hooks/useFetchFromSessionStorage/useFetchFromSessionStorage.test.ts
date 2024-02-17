import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { loadFromChromeSessionStorage } from '../../utils';
import { useFetchFromSessionStorage } from './useFetchFromSessionStorage';

// Mock the utilities
vi.mock('../../utils', () => ({
  loadFromChromeSessionStorage: vi.fn()
}));

describe('useFetchFromSessionStorage', () => {
  it('fetches data from session storage', async () => {
    const storedData = JSON.stringify({ data: 'test-data' });
    vi.mocked(loadFromChromeSessionStorage).mockResolvedValue(storedData);
    const key = 'test-key';

    const { result } = renderHook(() => useFetchFromSessionStorage(key));

    await waitFor(() => expect(result.current.fetchedData).toEqual({ data: 'test-data' }));
  });
});
