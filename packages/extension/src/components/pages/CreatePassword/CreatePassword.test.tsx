import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { generateWalletContext } from '../../../mocks';
import { CreatePassword, CreatePasswordProps } from './CreatePassword';

const user = userEvent.setup();
const generatedWallet = generateWalletContext().getCurrentWallet();

const defaultProps: CreatePasswordProps = {
  activeStep: 1,
  steps: 3,
  handleBack: jest.fn(),
  setActiveStep: jest.fn(),
  wallet: {
    name: 'Wallet 1',
    publicAddress: generatedWallet?.publicAddress as string,
    seed: generatedWallet?.seed,
    mnemonic: generatedWallet?.mnemonic
  }
};

const mockWalletContext = generateWalletContext();
jest.mock('../../../contexts', () => ({
  useNetwork: () => ({
    hasOfflineBanner: false
  }),
  useWallet: () => mockWalletContext
}));

describe('CreatePassword Page', () => {
  test('Should render the proper elements', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <CreatePassword {...defaultProps} />
      </BrowserRouter>
    );

    expect(getByRole('heading', { name: 'Create a password' })).toBeVisible();
  });

  test('Should render an error if password is less than 8 characters', async () => {
    const { getByRole, getByText, container } = render(
      <BrowserRouter>
        <CreatePassword {...defaultProps} />
      </BrowserRouter>
    );

    const nextButton = getByRole('button', { name: 'Next' });

    const passwordInput = container.querySelector('#password');
    const passwordConfirmInput = container.querySelector('#confirm-password');
    await user.type(passwordInput as Element, '1234567');
    await user.type(passwordConfirmInput as Element, '1234567');
    await user.click(nextButton);

    expect(getByText('Password must be at least 8 characters long')).toBeVisible();
  });

  test('Should render an error if passwords do not match', async () => {
    const { getByRole, getByText, container } = render(
      <BrowserRouter>
        <CreatePassword {...defaultProps} />
      </BrowserRouter>
    );

    const nextButton = getByRole('button', { name: 'Next' });

    const passwordInput = container.querySelector('#password');
    const passwordConfirmInput = container.querySelector('#confirm-password');
    await user.type(passwordInput as Element, '12345678');
    await user.type(passwordConfirmInput as Element, '12345679');
    await user.click(nextButton);

    expect(getByText('Passwords must match')).toBeVisible();
  });

  test('should show/hide password when the eye icon is clicked', async () => {
    render(
      <BrowserRouter>
        <CreatePassword {...defaultProps} />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    // Initially, password and confirm password should be of type 'password'
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click the eye icon for password to toggle visibility
    await userEvent.click(screen.getByLabelText('Show password'));
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to toggle back to 'password' type
    await userEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the eye icon for confirm password to toggle visibility
    await userEvent.click(screen.getByLabelText('Show confirm password'));
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Click again to toggle back to 'password' type
    await userEvent.click(screen.getByLabelText('Hide confirm password'));
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});
