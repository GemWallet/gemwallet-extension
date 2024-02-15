import { render } from '@testing-library/react';

import { generateWalletContext } from '../../../mocks';
import { PrivateRoute } from './PrivateRoute';
import { vi } from 'vitest';

let mockWalletContext = generateWalletContext();
vi.mock('../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

vi.mock('react-router-dom', () => ({
  Navigate: () => <div>Navigation</div>,
  useLocation: () => {
    return {
      search: ''
    };
  }
}));

describe('PrivateRoute Atom', () => {
  beforeEach(() => {
    mockWalletContext = generateWalletContext();
  });

  test('Should redirect if there is at least one wallet found', () => {
    const CHILD_TEXT = 'Hello world!';
    const { getByText } = render(
      <PrivateRoute>
        <div>{CHILD_TEXT}</div>
      </PrivateRoute>
    );

    expect(getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  test('Should redirect to welcome page with the proper arguments if there are no wallets found', () => {
    mockWalletContext = generateWalletContext({ wallets: [] });
    const { getByText, queryByText } = render(
      <PrivateRoute>
        <div>Private</div>
      </PrivateRoute>
    );

    expect(getByText('Navigation')).toBeInTheDocument();
    expect(queryByText('Private')).not.toBeInTheDocument();
  });
});
