import { render, screen } from '@testing-library/react';

import { SecretSeed, SecretSeedProps } from './SecretSeed';
import { generateWalletContext } from '../../../../mocks';

const defaultProps: SecretSeedProps = {
  activeStep: 0,
  steps: 4,
  seed: 'fdjlfkhfhdksj',
  handleBack: jest.fn(),
  setActiveStep: jest.fn()
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

const mockWalletContext = generateWalletContext();
jest.mock('../../../../contexts', () => ({
  useNetwork: () => ({
    hasOfflineBanner: false
  }),
  useWallet: () => mockWalletContext
}));

describe('CreateWallet - SecretSeed', () => {
  test('Should render the proper elements', () => {
    render(<SecretSeed {...defaultProps} />);
    const titleElement = screen.getByRole('heading', { name: 'Secret Seed' });
    const subTitleElement = screen.getByRole('heading', {
      name: 'This is the only way you will be able to recover your account. Please store it somewhere safe!'
    });
    expect(titleElement).toBeVisible();
    expect(subTitleElement).toBeVisible();
  });
});
