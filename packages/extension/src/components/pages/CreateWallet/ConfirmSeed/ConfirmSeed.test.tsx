import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateWalletContext, WALLET_SEED } from '../../../../mocks';
import { ConfirmSeed, ConfirmSeedProps } from './ConfirmSeed';
import { vi } from 'vitest';

const user = userEvent.setup();

const mockedSetActiveStep = vi.fn();
const defaultProps: ConfirmSeedProps = {
  seed: WALLET_SEED,
  activeStep: 2,
  steps: 4,
  handleBack: vi.fn(),
  onConfirm: mockedSetActiveStep
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

describe('CreateWallet - ConfirmSeed', () => {
  test('Should render the proper elements', () => {
    render(<ConfirmSeed {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Confirm Your Secret Seed' })).toBeVisible();
  });

  test('Should render an error if seed is not confirmed', async () => {
    const renderedElements = render(<ConfirmSeed {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);
    expect(screen.getByText('Seed incorrect')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    const seedInput = renderedElements.container.querySelector('#seed');
    await user.type(seedInput as Element, WALLET_SEED);
    await user.click(confirmButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });
});
