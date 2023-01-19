import * as Sentry from '@sentry/react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { DEFAULT_RESERVE } from '../../../constants';
import { TokenListing, TokenListingProps } from './TokenListing';

jest.mock('@sentry/react', () => {
  return {
    captureException: jest.fn()
  };
});

let getBalances = new Promise((resolve) => {
  resolve([{ value: '100', currency: 'XRP', issuer: undefined }]);
});

jest.mock('../../../contexts', () => {
  return {
    useNetwork: () => {
      return {
        client: {
          getBalances
        },
        reconnectToNetwork: jest.fn()
      };
    },
    useServer: () => {
      return {
        serverInfo: {
          info: {
            validated_ledger: {
              reserve_base_xrp: DEFAULT_RESERVE
            }
          }
        }
      };
    }
  };
});

describe('TokenListing', () => {
  let props: TokenListingProps;
  beforeEach(() => {
    props = {
      address: 'r123'
    };
  });

  test('should display a loading state when client is loading', () => {
    render(<TokenListing {...props} />);
    expect(screen.queryByText('Loading...')).toBeInTheDocument();
  });

  test('should display the XRP balance and trust line balances', async () => {
    getBalances = new Promise((resolve) => {
      resolve([
        { value: '100', currency: 'XRP', issuer: undefined },
        { value: '50', currency: 'USD', issuer: 'r123' },
        { value: '20', currency: 'ETH', issuer: 'r456' }
      ]);
    });
    render(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText('100 XRP')).toBeInTheDocument();
      expect(screen.getByText('50 USD')).toBeInTheDocument();
      expect(screen.getByText('20 ETH')).toBeInTheDocument();
    });
  });

  test('should display an error message when there is an error fetching the balances', async () => {
    getBalances = new Promise((resolve, reject) => {
      reject('Throw an error if there is an error fetching the balances');
    });
    render(<TokenListing {...props} />);
    await waitFor(() => {
      expect(screen.getByText('Account not activated')).toBeVisible();
      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  test('should open the explanation dialog when the explain button is clicked', async () => {
    render(<TokenListing {...props} />);
    const explainButton = await screen.findByText('Explain');
    fireEvent.click(explainButton);
    expect(screen.getByText('Explanation')).toBeVisible();
  });
});
