import { renderHook } from '@testing-library/react';

import { useBeforeUnload } from './useBeforeUnload';
import { vi, describe, it } from 'vitest';

describe('useBeforeUnload', () => {
  it('should call the provided callback function before unloading', () => {
    const mockCallback = vi.fn();
    const { unmount } = renderHook(() => useBeforeUnload(mockCallback));

    // Trigger the beforeunload event
    window.dispatchEvent(new Event('beforeunload'));

    expect(mockCallback).toHaveBeenCalled();

    unmount();
  });
});
