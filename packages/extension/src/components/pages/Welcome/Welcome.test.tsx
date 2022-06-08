import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Welcome } from '.';
import App from '../../../App';
import { WELCOME_PATH } from '../../../constants/routes';

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
    render(
      <MemoryRouter initialEntries={[WELCOME_PATH]}>
        <App />
      </MemoryRouter>
    );
    const newWalletButtonElement = screen.getByRole('button', { name: 'Create a new wallet' });

    const user = userEvent.setup();
    await user.click(newWalletButtonElement);

    expect(
      screen.getByRole('heading', {
        name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
      })
    ).toBeVisible();
  });

  test('Should go to import wallet page', async () => {
    render(
      <MemoryRouter initialEntries={[WELCOME_PATH]}>
        <App />
      </MemoryRouter>
    );
    const importWalletButtonElement = screen.getByRole('button', { name: 'Import a seed phrase' });

    const user = userEvent.setup();
    await user.click(importWalletButtonElement);

    expect(
      screen.getByRole('heading', {
        name: 'Please enter your seed in order to load your wallet to GemWallet.'
      })
    ).toBeVisible();
  });
});
