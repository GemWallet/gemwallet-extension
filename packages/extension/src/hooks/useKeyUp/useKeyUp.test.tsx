import { render, fireEvent } from '@testing-library/react';
import { describe, test, vi } from 'vitest';

import { useKeyUp } from './useKeyUp';

const TestComponent = ({ k, callback }: { k: string; callback: () => void }) => {
  useKeyUp(k, callback);
  return <div>Test component</div>;
};

describe('useKeyUp hook', () => {
  test('calls callback function on keyup event with correct key', async () => {
    const key = 'Enter';
    const callback = vi.fn();
    render(<TestComponent k={key} callback={callback} />);
    await fireEvent(window, new KeyboardEvent('keyup', { key }));
    expect(callback).toHaveBeenCalled();
  });

  test('removes event listener on unmount', async () => {
    const key = 'Enter';
    const callback = vi.fn();
    const { unmount } = render(<TestComponent k={key} callback={callback} />);
    unmount();
    await fireEvent(window, new KeyboardEvent('keyup', { key }));
    // Assert that the callback was not called (it should not have been called because the event listener was removed)
    expect(callback).not.toHaveBeenCalled();
  });
});
