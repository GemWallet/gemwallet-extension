import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { ImportSecretNumbers, ImportSecretNumbersProps } from './ImportSecretNumbers';
import { vi } from 'vitest';

const defaultProps: ImportSecretNumbersProps = {
  activeStep: 0,
  password: '',
  handleBack: vi.fn()
};

describe('Import New Wallet - Import Secret Numbers', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <ImportSecretNumbers {...defaultProps} />
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
