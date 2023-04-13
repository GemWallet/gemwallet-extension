import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '../../../../mocks/render';
import { SecretSeedProps } from './SecretSeed';
import { SecretSeed } from './SecretSeed';

const defaultProps: SecretSeedProps = {
  activeStep: 0,
  steps: 3,
  handleBack: jest.fn(),
  setActiveStep: jest.fn()
};

describe('ImportSeed - SecretSeed Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <SecretSeed {...defaultProps} />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'Please enter your seed in order to load your wallet to GemWallet.'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
