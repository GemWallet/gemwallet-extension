import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { ImportSeed } from './ImportSeed';
import { WALLET_SEED } from '../../../mocks';

const user = userEvent.setup();

describe('ImportSeed Page', () => {
  test('Should go back', async () => {
    render(
      <BrowserRouter>
        <ImportSeed />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    // Going to Screen 1
    const seedInput = screen.getByLabelText('Seed');
    await user.type(seedInput, WALLET_SEED);
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your seed in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
