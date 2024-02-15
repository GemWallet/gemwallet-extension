import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateWalletContext } from '../../../../../mocks';
import { ImportSeed, ImportSeedProps } from './ImportSeed';
import { describe, expect, vi } from 'vitest';

const defaultProps: ImportSeedProps = {
  activeStep: 2,
  password: '4',
  handleBack: vi.fn()
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

let mockWalletContext = generateWalletContext();
vi.mock('../../../../../contexts', () => ({
  useNetwork: () => ({
    hasOfflineBanner: false
  }),
  useWallet: () => mockWalletContext
}));

describe('Import New Wallet - ImportSeed', () => {
  test('Should render the proper elements', () => {
    render(<ImportSeed {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Enter Your Secret Seed' })).toBeVisible();
  });

  test('Should render an error if seed is not confirmed', async () => {
    mockWalletContext = {
      ...mockWalletContext,
      importSeed: () => false
    };
    render(<ImportSeed {...defaultProps} />);
    const user = userEvent.setup();

    const addSeedButton = screen.getByRole('button', { name: 'Add Seed' });
    await user.click(addSeedButton);
    expect(screen.getByText('Your seed is invalid')).toBeVisible();
  });
});
