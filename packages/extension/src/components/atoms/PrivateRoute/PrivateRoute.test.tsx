import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { PrivateRoute } from './PrivateRoute';
import { LedgerContext } from '../../../contexts';
import App from '../../../App';
import { TRANSACTION_PATH } from '../../../constants';
import { valueLedgerContext } from '../../../mocks';

describe('PrivateRoute Atom', () => {
  test('Should redirect there is at least one wallet found', () => {
    render(
      <BrowserRouter>
        <LedgerContext.Provider value={valueLedgerContext}>
          <PrivateRoute>
            <div>Hello world!</div>
          </PrivateRoute>
        </LedgerContext.Provider>
      </BrowserRouter>
    );
    const childElement = screen.getByText('Hello world!');
    expect(childElement).toBeInTheDocument();
  });

  test('Should redirect to welcome page with the proper arguments if there are no wallets found', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `${TRANSACTION_PATH}?transaction=payment&amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`
        ]}
      >
        <LedgerContext.Provider value={{ ...valueLedgerContext, wallets: [] }}>
          <App />
        </LedgerContext.Provider>
      </MemoryRouter>
    );
    const createNewWalletButton = screen.getByRole('button', { name: 'Create a new wallet' });
    const importSeedPhraseButton = screen.getByRole('button', { name: 'Import a seed phrase' });
    expect(createNewWalletButton).toBeInTheDocument();
    expect(importSeedPhraseButton).toBeInTheDocument();
  });
});
