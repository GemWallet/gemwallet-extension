import { useEffect, useState } from 'react';

import { render, waitFor } from '@testing-library/react';

import { useTimeout } from './useTimeout';
import { test } from 'vitest';

const TestComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const setTimeout = useTimeout(2000);

  useEffect(() => {
    setTimeout(() => setIsVisible(true));
  }, [setTimeout]);

  return <div data-testid="test-element">{isVisible ? 'Visible' : 'Hidden'}</div>;
};

test('useTimeout hook should set isVisible to true after 2 seconds', async () => {
  const { getByTestId } = render(<TestComponent />);
  const testElement = getByTestId('test-element');

  // Assert that the element is initially hidden
  expect(testElement).toHaveTextContent('Hidden');

  // Wait for 2 seconds
  await waitFor(() => expect(testElement).toHaveTextContent('Visible'), {
    timeout: 2100 // Slightly longer to ensure the timeout has fully elapsed
  });
});
