import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmSeed, ConfirmSeedProps } from './ConfirmSeed';
import { generateWalletContext, WALLET_SEED } from '../../../../mocks';

const mockedSetActiveStep = jest.fn();
const defaultProps: ConfirmSeedProps = {
  activeStep: 2,
  steps: 4,
  handleBack: jest.fn(),
  setActiveStep: mockedSetActiveStep
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

const mockWalletContext = generateWalletContext();
jest.mock('../../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

describe('CreateWallet - ConfirmSeed', () => {
  test('Should render the proper elements', () => {
    render(<ConfirmSeed {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Confirm Your Secret Seed' })).toBeVisible();
  });

  test('Should render an error if seed is not confirmed', async () => {
    const renderedElements = render(<ConfirmSeed {...defaultProps} />);
    const user = userEvent.setup();

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmButton);
    expect(screen.getByText('Seed incorrect')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    const seedInput = renderedElements.container.querySelector('#seed');
    fireEvent.change(seedInput as Element, { target: { value: WALLET_SEED } });
    await user.click(confirmButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });
});
