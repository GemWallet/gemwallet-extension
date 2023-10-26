import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmSeed, ConfirmSeedProps } from './ConfirmSeed';
import { generateWalletContext, WALLET_SEED } from '../../../../mocks';

const user = userEvent.setup();

const mockedSetActiveStep = jest.fn();
const defaultProps: ConfirmSeedProps = {
  seed: WALLET_SEED,
  activeStep: 2,
  steps: 4,
  handleBack: jest.fn(),
  onConfirm: mockedSetActiveStep
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

describe('CreateWallet - ConfirmSeed', () => {
  test('Should render the proper elements', () => {
    render(<ConfirmSeed {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Confirm Your Secret Seed' })).toBeVisible();
  });

  test('Should render an error if seed is not confirmed', async () => {
    render(<ConfirmSeed {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);
    expect(screen.getByText('Seed incorrect')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    const seedInput = screen.getByLabelText('Seed');
    await user.type(seedInput, WALLET_SEED);
    await user.click(confirmButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });
});
