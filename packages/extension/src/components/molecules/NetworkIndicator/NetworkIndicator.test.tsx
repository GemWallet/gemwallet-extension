import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NetworkIndicator } from './NetworkIndicator';

const mockUseNetwork = jest.fn();

jest.mock('../../../contexts', () => {
  return {
    useNetwork: () => mockUseNetwork()
  };
});

describe('NetworkIndicator', () => {
  test('renders the correct network name chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      networkName: 'testnet',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByText('testnet')).toBeInTheDocument();
  });

  test('renders the switch network name chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      networkName: 'Loading...',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders the correct green color chip', () => {
    mockUseNetwork.mockReturnValue({
      client: jest.fn(),
      networkName: 'testnet',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByTestId('FiberManualRecordIcon')).toHaveStyle('color: green;');
  });

  test('renders the correct red color chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      networkName: 'testnet',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByTestId('FiberManualRecordIcon')).toHaveStyle('color: red;');
  });

  test('opens the dialog on chip click', async () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      networkName: 'testnet',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Change Network')).toBeInTheDocument();
  });

  test('closes the dialog on close button click', async () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      networkName: 'testnet',
      switchNetwork: jest.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    // Wait for the dialog animation to complete
    await waitFor(() => {
      expect(screen.queryByText('Change Network')).not.toBeInTheDocument();
    });
  });
});
