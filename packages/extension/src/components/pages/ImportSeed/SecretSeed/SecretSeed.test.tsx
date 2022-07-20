import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SecretSeed } from './SecretSeed';

describe('ImportSeed - SecretSeed Page', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <SecretSeed activeStep={0} handleBack={jest.fn()} setActiveStep={jest.fn()} />
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
