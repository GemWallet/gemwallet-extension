import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chain } from '@gemwallet/constants';

import { NetworkIndicator } from './NetworkIndicator';
import { vi } from 'vitest';

const mockUseNetwork = vi.fn();

vi.mock('../../../contexts', () => {
  return {
    useNetwork: () => mockUseNetwork()
  };
});

describe('NetworkIndicator', () => {
  test('renders the correct network name chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      chainName: Chain.XRPL,
      networkName: 'testnet',
      switchNetwork: vi.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByText('testnet')).toBeInTheDocument();
  });

  test('renders the switch network name chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      chainName: Chain.XRPL,
      networkName: 'Loading...',
      switchNetwork: vi.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders the correct green color chip', () => {
    mockUseNetwork.mockReturnValue({
      client: vi.fn(),
      chainName: Chain.XRPL,
      networkName: 'testnet',
      switchNetwork: vi.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByTestId('FiberManualRecordIcon')).toHaveStyle('color: green;');
  });

  test('renders the correct red color chip', () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      chainName: Chain.XRPL,
      networkName: 'testnet',
      switchNetwork: vi.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    expect(screen.getByTestId('FiberManualRecordIcon')).toHaveStyle('color: red;');
  });

  test('opens the dialog on chip click', async () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      chainName: Chain.XRPL,
      networkName: 'testnet',
      switchNetwork: vi.fn(),
      hasOfflineBanner: false
    });

    render(<NetworkIndicator />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Change Network')).toBeInTheDocument();
  });

  test('closes the dialog on close button click', async () => {
    mockUseNetwork.mockReturnValue({
      client: undefined,
      chainName: Chain.XRPL,
      networkName: 'testnet',
      switchNetwork: vi.fn(),
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
