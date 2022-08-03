import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SecretSeed } from './SecretSeed';
import { mockWallet } from '../../../../mocks';

const defaultProps = {
  activeStep: 0,
  handleBack: jest.fn(),
  setActiveStep: jest.fn(),
  wallet: mockWallet
};

describe('CreateWallet - SecretSeed', () => {
  test('Should render the proper elements', () => {
    render(
      <BrowserRouter>
        <SecretSeed {...defaultProps} />
      </BrowserRouter>
    );
    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
