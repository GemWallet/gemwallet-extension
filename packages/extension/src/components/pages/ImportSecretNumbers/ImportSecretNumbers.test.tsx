import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { render } from '../../../mocks/render';
import { ImportSecretNumbers } from './ImportSecretNumbers';

describe('ImportSecretNumbers Page', () => {
  test('Should go back', async () => {
    const renderedElements = render(
      <BrowserRouter>
        <ImportSecretNumbers />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

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
    secretNumbers.forEach((number, index) => {
      const numberInput = renderedElements.container.querySelector(
        `#numbers${String.fromCharCode(65 + index)}`
      );
      fireEvent.change(numberInput as Element, {
        target: { value: number }
      });
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
