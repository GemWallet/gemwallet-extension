import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ImportSeed, ImportSeedProps } from './ImportSeed';
import { generateWalletContext } from '../../../../../mocks';

const defaultProps: ImportSeedProps = {
  activeStep: 2,
  password: '4',
  handleBack: jest.fn()
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

let mockWalletContext = generateWalletContext();
jest.mock('../../../../../contexts', () => ({
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
