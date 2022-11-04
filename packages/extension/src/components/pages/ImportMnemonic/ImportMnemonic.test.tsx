import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { WALLET_MNEMONIC } from '../../../mocks';
import { ImportMnemonic } from './ImportMnemonic';

describe('ImportMnemonic Page', () => {
  test('Should go back', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <ImportMnemonic />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    // Going to Screen 1
    const mnemonicInput = renderedElements.container.querySelector('#mnemonic');
    fireEvent.change(mnemonicInput as Element, {
      target: { value: WALLET_MNEMONIC }
    });
    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Mnemonic' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your mnemonic in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
