import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { PrivateRoute } from './PrivateRoute';
import App from '../../../App';
import { PARAMETER_TRANSACTION_PAYMENT, TRANSACTION_PATH } from '../../../constants';
import { generateWalletContext } from '../../../mocks';

let mockWalletContext = generateWalletContext();
jest.mock('../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

describe('PrivateRoute Atom', () => {
  beforeEach(() => {
    mockWalletContext = generateWalletContext();
  });

  test('Should redirect if there is at least one wallet found', () => {
    const CHILD_TEXT = 'Hello world!';
    const { getByText } = render(
      <BrowserRouter>
        <PrivateRoute>
          <div>{CHILD_TEXT}</div>
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  test('Should redirect to welcome page with the proper arguments if there are no wallets found', () => {
    mockWalletContext = generateWalletContext({ wallets: [] });
    const { getByRole } = render(
      <MemoryRouter
        initialEntries={[
          `${TRANSACTION_PATH}?${PARAMETER_TRANSACTION_PAYMENT}&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`
        ]}
      >
        <App />
      </MemoryRouter>
    );

    expect(getByRole('button', { name: 'Create a new wallet' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Import a wallet' })).toBeInTheDocument();
  });
});
