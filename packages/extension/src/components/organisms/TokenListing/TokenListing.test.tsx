import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Chain, XRPLNetwork } from '@gemwallet/constants';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../../constants';
import { formatToken } from '../../../utils';
import { TokenListing, TokenListingProps } from './TokenListing';
import { vi, Mock, describe, test, expect, beforeEach } from 'vitest';

const user = userEvent.setup();

vi.mock('react-router-dom');
vi.mock('@sentry/react', () => {
  return {
    captureException: vi.fn()
  };
});

const mockGetBalancesPromise = vi.fn();
const mockFundWalletPromise = vi.fn();
const mockRequestPromise = vi.fn();
const mockGetAccountInfo = vi.fn();

const mockChain = Chain.XRPL;
let mockNetwork = XRPLNetwork.TESTNET;
let mockClient: { getBalances: Mock; request: Mock } | null = {
  getBalances: mockGetBalancesPromise,
  request: mockRequestPromise
};

vi.mock('../../../contexts', () => {
  return {
    useNetwork: () => ({
      client: mockClient,
      reconnectToNetwork: vi.fn(),
      networkName: mockNetwork,
      chainName: mockChain
    }),
    useServer: () => ({
      serverInfo: {
        info: {
          validated_ledger: {
            reserve_base_xrp: DEFAULT_RESERVE,
            reserve_inc_xrp: RESERVE_PER_OWNER
          }
        }
      }
    }),
    useLedger: () => ({
      fundWallet: mockFundWalletPromise,
      getAccountInfo: mockGetAccountInfo
    })
  };
});

// Create a wrapper component with QueryClientProvider for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('TokenListing', () => {
  let props: TokenListingProps;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getBalances: mockGetBalancesPromise,
      request: mockRequestPromise
    };
    props = {
      address: 'r123'
    };
    // Default mock responses
    mockRequestPromise.mockResolvedValue({
      result: {
        lines: []
      }
    });
    mockGetAccountInfo.mockResolvedValue({
      result: {
        account_data: {
          OwnerCount: 2
        }
      }
    });
  });

  test('should display an error when client failed to load', () => {
    mockClient = null;
    renderWithQueryClient(<TokenListing {...props} />);
    expect(
      screen.queryByText(
        'There was an error attempting to connect to the network. Please refresh the page and try again.'
      )
    ).toBeVisible();
  });

  test('should display the loading token state when the XRPBalance is not calculated', () => {
    mockGetBalancesPromise.mockReturnValue(new Promise(() => {})); // Never resolves
    renderWithQueryClient(<TokenListing {...props} />);
    expect(screen.getByTestId('token-loader')).toBeInTheDocument();
  });

  test('should display the XRP balance and trust line balances', async () => {
    mockGetBalancesPromise.mockResolvedValue([
      { value: '100', currency: 'XRP', issuer: undefined },
      { value: '50', currency: 'USD', issuer: 'r123' },
      { value: '20', currency: 'ETH', issuer: 'r456' }
    ]);

    const reserve = DEFAULT_RESERVE + RESERVE_PER_OWNER * 2;

    renderWithQueryClient(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText(`${100 - reserve} XRP`)).toBeInTheDocument();
      expect(screen.getByText('50 USD')).toBeInTheDocument();
      expect(screen.getByText('20 ETH')).toBeInTheDocument();
    });
  });

  test('should display an error message when there is an error fetching the balances', async () => {
    mockGetBalancesPromise.mockRejectedValue(
      new Error('Throw an error if there is an error fetching the balances')
    );
    renderWithQueryClient(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText('Account not activated')).toBeVisible();
    });
  });

  test('should open the explanation dialog when the explain button is clicked', async () => {
    mockGetBalancesPromise.mockResolvedValue([
      { value: '100', currency: 'XRP', issuer: undefined }
    ]);
    renderWithQueryClient(<TokenListing {...props} />);
    const explainButton = await screen.findByText('Explain');
    await user.click(explainButton);
    expect(
      screen.getByText(
        `The activation of this account was made through a minimum deposit of ${DEFAULT_RESERVE} XRP.`
      )
    ).toBeVisible();
  });

  test('Should display the fund wallet button when the network is testnet and XRP balance is 0', async () => {
    mockNetwork = XRPLNetwork.TESTNET;
    mockGetBalancesPromise.mockRejectedValue(
      new Error('Throw an error if there is an error fetching the balances')
    );
    renderWithQueryClient(<TokenListing {...props} />);
    await waitFor(() => {
      const button = screen.queryByTestId('fund-wallet-button');
      expect(button).toBeInTheDocument();
    });
  });

  test('Should not display the fund wallet button when the network is Mainnet and XRP balance is 0', async () => {
    mockNetwork = XRPLNetwork.MAINNET;
    mockGetBalancesPromise.mockRejectedValue(
      new Error('Throw an error if there is an error fetching the balances')
    );
    renderWithQueryClient(<TokenListing {...props} />);
    await waitFor(() => {
      const button = screen.queryByTestId('fund-wallet-button');
      expect(button).not.toBeInTheDocument();
    });
  });

  test('Should refetch balances when clicking Fund Wallet Button', async () => {
    const reserve = DEFAULT_RESERVE + RESERVE_PER_OWNER * 2;

    mockNetwork = XRPLNetwork.TESTNET;
    // First call fails (account not activated)
    mockGetBalancesPromise.mockRejectedValueOnce(
      new Error('Throw an error if there is an error fetching the balances')
    );
    // After funding, return balances
    mockGetBalancesPromise.mockResolvedValue([
      { value: '10000', currency: 'XRP', issuer: undefined }
    ]);
    mockFundWalletPromise.mockResolvedValue({ balance: 10000 });

    renderWithQueryClient(<TokenListing {...props} />);

    const button = await screen.findByTestId('fund-wallet-button');
    const format = formatToken(10000 - reserve, 'XRP');

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(format)).toBeInTheDocument();
    });
  });
});
