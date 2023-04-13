import { act, screen, waitFor } from '@testing-library/react';

import { render } from '../../mocks/render';
import { ServerProvider, useServer } from './ServerContext';

jest.mock('../NetworkContext', () => ({
  useNetwork: () => ({
    client: {
      request: () =>
        new Promise((resolve) => {
          resolve({
            result: 'serverTest'
          });
        })
    }
  })
}));

function TestComponent() {
  const { serverInfo } = useServer();
  return <div>{serverInfo}</div>;
}
describe('ServerProvider', () => {
  test('renders children elements', () => {
    act(() => {
      render(
        <ServerProvider>
          <div>Test</div>
        </ServerProvider>
      );
    });
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('provides the correct context value', async () => {
    act(() => {
      render(
        <ServerProvider>
          <TestComponent />
        </ServerProvider>
      );
    });
    // Use WaitFor as we are waiting for an asynchronous operation
    await waitFor(() => {
      expect(screen.getByText('serverTest')).toBeInTheDocument();
    });
  });
});
