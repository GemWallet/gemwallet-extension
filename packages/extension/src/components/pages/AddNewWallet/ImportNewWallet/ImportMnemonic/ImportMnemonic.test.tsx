import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { ImportMnemonic, ImportMnemonicProps } from './ImportMnemonic';
import { vi } from 'vitest';

const defaultProps: ImportMnemonicProps = {
  activeStep: 0,
  password: '',
  handleBack: vi.fn()
};

describe('Import New Wallet - Import Mnemonic', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <ImportMnemonic {...defaultProps} />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'Mnemonic' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your mnemonic in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
