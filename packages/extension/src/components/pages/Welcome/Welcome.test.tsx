import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Welcome } from './Welcome';
import App from '../../../App';
import { CREATE_NEW_WALLET_PATH, IMPORT_SEED_PATH, WELCOME_PATH } from '../../../constants';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: () => mockedUsedNavigate
}));

describe('Welcome Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'GemWallet' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Internet cryptocurrency payments made easy'
    });
    const newWalletButtonElement = screen.getByRole('button', { name: 'Create a new wallet' });
    const importWalletButtonElement = screen.getByRole('button', { name: 'Import a seed phrase' });

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
    const importWalletButtonElement = screen.getByRole('button', { name: 'Import a seed phrase' });

    const user = userEvent.setup();
    await user.click(importWalletButtonElement);

    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`${IMPORT_SEED_PATH}${search}`);
  });
});
