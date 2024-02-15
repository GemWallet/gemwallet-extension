import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { ImportSecretNumbers } from './ImportSecretNumbers';

const user = userEvent.setup();

describe('ImportSecretNumbers Page', () => {
  test('Should go back', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <ImportSecretNumbers />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });

    // Going to Screen 1
    const secretNumbers = [
      '518567',
      '524023',
      '229722',
      '454042',
      '312660',
      '026022',
      '001170',
      '073666'
    ];
    secretNumbers.forEach(async (number, index) => {
      const numberInput = renderedElements.container.querySelector(
        `#numbers${String.fromCharCode(65 + index)}`
      ) as HTMLInputElement;
      await user.type(numberInput, number);
    });

    await user.click(nextButton);

    // Go back to Screen 0
    const backButton = screen.getByRole('button', { name: 'Back' });
    await user.click(backButton);

    const titleElement = screen.getByRole('heading', { name: 'Secret numbers' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your secret numbers in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
