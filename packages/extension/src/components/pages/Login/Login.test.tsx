import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { Login } from './Login';

describe('Login Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'GemWallet' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Your gateway to the XRPL'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });

  test('Toggles password visibility when the show password button is clicked', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByLabelText('Show Password'));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(screen.getByLabelText('Hide Password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
