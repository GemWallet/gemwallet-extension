import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePassword, CreatePasswordProps } from './CreatePassword';
import { generateWalletContext } from '../../../../mocks';

const mockWalletContext = generateWalletContext();
const mockedSetActiveStep = jest.fn();
const defaultProps: CreatePasswordProps = {
  activeStep: 0,
  handleBack: jest.fn(),
  setActiveStep: mockedSetActiveStep,
  wallet: mockWalletContext.generateWallet()
};

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('CreateWallet - CreatePassword', () => {
  test('Should render the proper elements', async () => {
    render(<CreatePassword {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Create a password' })).toBeVisible();
  });

  test('Should render an error if password is less than 8 characters', async () => {
    const renderedElements = render(<CreatePassword {...defaultProps} />);

    const user = userEvent.setup();
    const nextButton = screen.getByRole('button', { name: 'Next' });

    const passwordInput = renderedElements.container.querySelector('#password');
    const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
    fireEvent.change(passwordInput as Element, { target: { value: '1234567' } });
    fireEvent.change(passwordConfirmInput as Element, { target: { value: '1234567' } });
    await user.click(nextButton);
    expect(screen.getByText('Password must be at least 8 characters long')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
    await user.click(nextButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });

  test('Should render an error if passwords do not match', async () => {
    const renderedElements = render(<CreatePassword {...defaultProps} />);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    const user = userEvent.setup();

    const passwordInput = renderedElements.container.querySelector('#password');
    const passwordConfirmInput = renderedElements.container.querySelector('#confirm-password');
    fireEvent.change(passwordInput as Element, { target: { value: '12345678' } });
    fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345679' } });
    await user.click(nextButton);
    expect(screen.getByText('Passwords must match')).toBeVisible();
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(0);

    fireEvent.change(passwordConfirmInput as Element, { target: { value: '12345678' } });
    await user.click(nextButton);
    expect(mockedSetActiveStep).toHaveBeenCalledTimes(1);
  });
});
