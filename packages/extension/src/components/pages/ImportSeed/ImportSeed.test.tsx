import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { WALLET_SEED } from '../../../mocks';
import { ImportSeed } from './ImportSeed';

const user = userEvent.setup();

describe('ImportSeed Page', () => {
  test('Should go back', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <ImportSeed />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    // Going to Screen 1
    const seedInput = renderedElements.container.querySelector('#seed') as HTMLInputElement;
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
