import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { CreateWallet } from './CreateWallet';
import { LedgerContext } from '../../../contexts';
import { valueLedgerContext } from '../../../mocks';

describe('CreateWallet Page', () => {
  test('Should go back', async () => {
    render(
      <BrowserRouter>
        <LedgerContext.Provider value={valueLedgerContext}>
          <CreateWallet />
        </LedgerContext.Provider>
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    // Going to Screen 1
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
