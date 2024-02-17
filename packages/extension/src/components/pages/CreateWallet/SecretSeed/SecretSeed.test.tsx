import { render, screen } from '@testing-library/react';

import { generateWalletContext } from '../../../../mocks';
import { SecretSeed, SecretSeedProps } from './SecretSeed';
import { vi } from 'vitest';

const defaultProps: SecretSeedProps = {
  activeStep: 0,
  steps: 4,
  seed: 'fdjlfkhfhdksj',
  handleBack: vi.fn(),
  setActiveStep: vi.fn()
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

const mockWalletContext = generateWalletContext();
vi.mock('../../../../contexts', () => ({
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
