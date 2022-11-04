import { render, screen } from '@testing-library/react';
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
      name: 'Internet cryptocurrency payments made easy'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
