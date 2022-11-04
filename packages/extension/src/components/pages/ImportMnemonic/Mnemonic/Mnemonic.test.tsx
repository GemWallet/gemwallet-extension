import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Mnemonic, MnemonicProps } from './Mnemonic';

const defaultProps: MnemonicProps = {
  activeStep: 0,
  steps: 4,
  handleBack: jest.fn(),
  setActiveStep: jest.fn()
};

describe('Import Mnemonic - Mnemonic Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <Mnemonic {...defaultProps} />
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
