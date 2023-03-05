import { renderHook } from '@testing-library/react-hooks';

import { useBeforeUnload } from './useBeforeUnload';

describe('useBeforeUnload', () => {
  it('should call the provided callback function before unloading', () => {
    const mockCallback = jest.fn();
    const { unmount } = renderHook(() => useBeforeUnload(mockCallback));

    // Trigger the beforeunload event
    window.dispatchEvent(new Event('beforeunload'));

    expect(mockCallback).toHaveBeenCalled();

    unmount();
  });
});
