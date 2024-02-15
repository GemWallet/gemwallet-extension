import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import App from '../../../App';
import { CREATE_NEW_WALLET_PATH, IMPORT_WALLET_PATH, WELCOME_PATH } from '../../../constants';
import { generateWalletContext } from '../../../mocks';
import { Welcome } from './Welcome';
import { vi, describe, test, beforeEach } from 'vitest';

const mockedUsedNavigate = vi.fn();
const mockNetworkContext = {
  client: null
};
const mockBrowserContext = vi.fn();
const mockWalletContext = generateWalletContext();
const mockTransactionProgressContext = {
  setTransactionProgress: vi.fn()
};

vi.mock('../../../contexts', () => ({
  useNetwork: () => mockNetworkContext,
  useBrowser: () => mockBrowserContext,
  useWallet: () => mockWalletContext,
  useTransactionProgress: () => mockTransactionProgressContext,
  TransactionProgressStatus: {
    IN_PROGRESS: 'mock'
  }
}));

vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: vi.fn(() => mockedUsedNavigate)
  };
});

describe('Welcome Page', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'GemWallet' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Your gateway to the XRPL'
    });
    const newWalletButtonElement = screen.getByRole('button', { name: 'Create a new wallet' });
    const importWalletButtonElement = screen.getByRole('button', { name: 'Import a wallet' });

    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
    expect(newWalletButtonElement).toBeVisible();
    expect(importWalletButtonElement).toBeVisible();
  });

  test('Should go to new wallet page', async () => {
    const search = `?amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;

    render(
      <MemoryRouter initialEntries={[`${WELCOME_PATH}${search}`]}>
        <App />
      </MemoryRouter>
    );
    const newWalletButtonElement = screen.getByRole('button', { name: 'Create a new wallet' });

    const user = userEvent.setup();
    await user.click(newWalletButtonElement);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${CREATE_NEW_WALLET_PATH}${search}`);
  });

  test('Should go to import wallet page', async () => {
    const search = `?amount=50&destination=rNhjf7Re4B9LvWiJwpGg1A1B1fWy4xh2Le`;

    render(
      <MemoryRouter initialEntries={[`${WELCOME_PATH}${search}`]}>
        <App />
      </MemoryRouter>
    );
    const importWalletButtonElement = screen.getByRole('button', { name: 'Import a wallet' });

    const user = userEvent.setup();
    await user.click(importWalletButtonElement);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${IMPORT_WALLET_PATH}${search}`);
  });
});
