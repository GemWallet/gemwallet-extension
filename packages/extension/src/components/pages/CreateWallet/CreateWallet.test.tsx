import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { generateWalletContext } from '../../../mocks';
import { CreateWallet } from './CreateWallet';
import { vi } from 'vitest';

const mockWalletContext = generateWalletContext();
vi.mock('../../../contexts', () => ({
  useNetwork: () => ({
    hasOfflineBanner: false
  }),
  useWallet: () => mockWalletContext
}));

describe('CreateWallet Page', () => {
  test('Should go back', async () => {
    render(
      <BrowserRouter>
        <CreateWallet />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    // Going to Screen 1
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Create a password' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'You will use this password to unlock your wallet'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
