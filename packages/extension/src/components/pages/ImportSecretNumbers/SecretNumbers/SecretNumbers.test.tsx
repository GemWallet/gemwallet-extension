import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { SecretNumbers, SecretNumbersProps } from './SecretNumbers';
import { vi } from 'vitest';

const defaultProps: SecretNumbersProps = {
  activeStep: 0,
  steps: 4,
  onBack: vi.fn(),
  onNext: vi.fn()
};

describe('SecretNumbers - ImportSecretNumbers Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <SecretNumbers {...defaultProps} />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'Secret numbers' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your secret numbers in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
