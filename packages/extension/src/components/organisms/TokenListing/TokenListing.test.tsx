import * as Sentry from '@sentry/react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { Network } from '@gemwallet/constants';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../../constants';
import { formatToken } from '../../../utils';
import { TokenListing, TokenListingProps } from './TokenListing';

jest.mock('react-router-dom');
jest.mock('@sentry/react', () => {
  return {
    captureException: jest.fn()
  };
});

let mockGetBalancesPromise = jest.fn();
let mockFundWalletPromise = jest.fn();
let mockRequestPromise = jest.fn();
let mockGetAccountInfoPromise = jest.fn();

let mockNetwork = Network.TESTNET;
let mockClient: { getBalances: jest.Mock; request: jest.Mock } | null = {
  getBalances: mockGetBalancesPromise,
  request: mockRequestPromise
};

mockGetBalancesPromise.mockResolvedValueOnce([
  { value: '100', currency: 'XRP', issuer: undefined }
]);

mockRequestPromise.mockResolvedValueOnce({
  result: {
    lines: []
  }
});

jest.mock('../../../contexts', () => {
  return {
    useNetwork: () => ({
      client: mockClient,
      reconnectToNetwork: jest.fn(),
      network: mockNetwork
    }),
    useServer: () => ({
      serverInfo: {
        info: {
          validated_ledger: {
            reserve_base_xrp: 10
          }
        }
      }
    }),
    useLedger: () => ({
      fundWallet: mockFundWalletPromise,
      getAccountInfo: mockGetAccountInfoPromise
    })
  };
});

describe('TokenListing', () => {
  let props: TokenListingProps;
  beforeEach(() => {
    mockClient = {
      getBalances: mockGetBalancesPromise,
      request: mockRequestPromise
    };
    props = {
      address: 'r123'
    };
  });

  test('should display an error when client failed to load', () => {
    mockClient = null;
    render(<TokenListing {...props} />);
    expect(
      screen.queryByText(
        'There was an error attempting to retrieve your assets. Please refresh and try again.'
      )
    ).toBeVisible();
  });

  test('should display the loading token state when the XRPBalance is not calculated', () => {
    render(<TokenListing {...props} />);
    expect(screen.getByTestId('token-loader')).toBeInTheDocument();
  });

  test('should display the XRP balance and trust line balances', async () => {
    mockGetBalancesPromise.mockResolvedValueOnce([
      { value: '100', currency: 'XRP', issuer: undefined },
      { value: '50', currency: 'USD', issuer: 'r123' },
      { value: '20', currency: 'ETH', issuer: 'r456' }
    ]);
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    const reserve = DEFAULT_RESERVE + RESERVE_PER_OWNER * 2;

    render(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText(`${100 - reserve} XRP`)).toBeInTheDocument();
      expect(screen.getByText('50 USD')).toBeInTheDocument();
      expect(screen.getByText('20 ETH')).toBeInTheDocument();
    });
  });

  test('should display an error message when there is an error fetching the balances', async () => {
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    mockGetBalancesPromise.mockRejectedValueOnce(
      new Error('Throw an error if there is an error fetching the balances')
    );
    render(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText('Account not activated')).toBeVisible();
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  test('should open the explanation dialog when the explain button is clicked', async () => {
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    mockGetBalancesPromise.mockResolvedValueOnce([
      { value: '100', currency: 'XRP', issuer: undefined }
    ]);
    render(<TokenListing {...props} />);
    const explainButton = await screen.findByText('Explain');
    await fireEvent.click(explainButton);
    expect(
      screen.getByText(
        'The activation of this XRP ledger account was made through a minimum deposit of 10 XRP.'
      )
    ).toBeVisible();
  });

  test('Should display the fund wallet button when the network is testnet and XRP balance is 0', async () => {
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    mockNetwork = Network.TESTNET;
    mockGetBalancesPromise.mockRejectedValueOnce(
      new Error('Throw an error if there is an error fetching the balances')
    );
    render(<TokenListing {...props} />);
    await waitFor(() => {
      const button = screen.queryByTestId('fund-wallet-button');
      expect(button).toBeInTheDocument();
    });
  });

  test('Should not display the fund wallet button when the network is Mainnet and XRP balance is 0', async () => {
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    mockNetwork = Network.MAINNET;
    mockGetBalancesPromise.mockRejectedValueOnce(
      new Error('Throw an error if there is an error fetching the balances')
    );
    render(<TokenListing {...props} />);
    await waitFor(() => {
      const button = screen.queryByTestId('fund-wallet-button');
      expect(button).not.toBeInTheDocument();
    });
  });

  test('Should display the amount of XRP when click on Fund Wallet Button', async () => {
    mockGetAccountInfoPromise = jest.fn().mockImplementation(() =>
      Promise.resolve({
        result: {
          account_data: {
            OwnerCount: 2
          }
        }
      })
    );

    const reserve = DEFAULT_RESERVE + RESERVE_PER_OWNER * 2;

    mockNetwork = Network.TESTNET;
    mockFundWalletPromise.mockResolvedValueOnce({ balance: 10000 });
    mockGetBalancesPromise.mockRejectedValueOnce(
      new Error('Throw an error if there is an error fetching the balances')
    );
    render(<TokenListing {...props} />);

    const button = await screen.findByTestId('fund-wallet-button');
    const format = formatToken(10000 - reserve, 'XRP');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(format)).toBeInTheDocument();
    });
  });
});
