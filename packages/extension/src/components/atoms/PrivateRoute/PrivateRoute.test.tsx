import { render, screen } from '@testing-library/react';

import { PrivateRoute } from './PrivateRoute';
import { generateWalletContext } from '../../../mocks';

let mockWalletContext = generateWalletContext();
jest.mock('../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

jest.mock('react-router-dom', () => ({
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
    render(
      <PrivateRoute>
        <div>{CHILD_TEXT}</div>
      </PrivateRoute>
    );

    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  test('Should redirect to welcome page with the proper arguments if there are no wallets found', () => {
    mockWalletContext = generateWalletContext({ wallets: [] });
    render(
      <PrivateRoute>
        <div>Private</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });
});
