import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateWalletContext } from '../../../../mocks';
import { ShowSecret, ShowSecretProps } from './ShowSecret';

const passwordTest = 'test-password';

let mockWalletContext = generateWalletContext();

jest.mock('../../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

window.prompt = jest.fn();

const seed = 'test-seed';
const mnemonic = 'test mnemonic';
const incorrectPassword = 'incorrect-password';
const onBackButton = jest.fn();

const renderShowSecret = (props?: Partial<ShowSecretProps>) =>
  render(<ShowSecret seed={seed} mnemonic={mnemonic} onBackButton={onBackButton} {...props} />);

describe('ShowSecret', () => {
  beforeEach(() => {
    mockWalletContext = generateWalletContext();
  });

  test('renders the seed password step correctly', () => {
    renderShowSecret();
    expect(screen.getByText(/^Do not share your seed!/m)).toBeInTheDocument();
    expect(
      screen.getByText('Please confirm your password before we show you your seed')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('Show seed')).toBeInTheDocument();
  });

  test('renders the mnemonic password step correctly', () => {
    renderShowSecret({ seed: undefined, mnemonic });
    expect(screen.getByText(/^Do not share your mnemonic!/m)).toBeInTheDocument();
    expect(
      screen.getByText('Please confirm your password before we show you your mnemonic')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText('Show mnemonic')).toBeInTheDocument();
  });

  test('renders the seed step correctly', () => {
    renderShowSecret();
    fireEvent.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: passwordTest } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText(seed)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('renders the mnemonic step correctly', () => {
    renderShowSecret({ seed: undefined, mnemonic });
    fireEvent.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: passwordTest } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText(mnemonic)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('displays an error message when the password is incorrect', () => {
    mockWalletContext = generateWalletContext({ isPasswordCorrect: () => false });
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: incorrectPassword } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });

  test('calls the onBackButton function when the Cancel button is clicked', () => {
    renderShowSecret();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onBackButton).toHaveBeenCalled();
  });

  test('renders the password error when the password is incorrect and clears it when correct', () => {
    renderShowSecret();
    fireEvent.click(screen.getByText('Show'));
    userEvent.type(screen.getByLabelText('Password'), incorrectPassword);
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByText('Incorrect password')).toBeInTheDocument();
    mockWalletContext = generateWalletContext({ isPasswordCorrect: () => false });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: passwordTest } });
    expect(screen.queryByText('Incorrect password')).not.toBeInTheDocument();
  });

  test('copies secret to clipboard and resets after 2 seconds', () => {
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: passwordTest } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy seed' });
    fireEvent.click(copyButton);

    expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
  });
});
