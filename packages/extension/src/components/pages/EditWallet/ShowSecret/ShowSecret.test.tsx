import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateWalletContext } from '../../../../mocks';
import { ShowSecret, ShowSecretProps } from './ShowSecret';
import { vi } from 'vitest';

const passwordTest = 'test-password';

let mockWalletContext = generateWalletContext();

vi.mock('../../../../contexts', () => ({
  useNetwork: () => ({
    hasOfflineBanner: false
  }),
  useWallet: () => mockWalletContext
}));

window.prompt = vi.fn();

const seed = 'test-seed';
const mnemonic = 'test mnemonic';
const incorrectPassword = 'incorrect-password';
const onBackButton = vi.fn();

const renderShowSecret = (props?: Partial<ShowSecretProps>) =>
  render(<ShowSecret seed={seed} mnemonic={mnemonic} onBackButton={onBackButton} {...props} />);

const user = userEvent.setup();

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

  test('renders the seed step correctly', async () => {
    renderShowSecret();
    await user.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, passwordTest);
    await user.click(screen.getByText('Show'));

    expect(screen.getByText(seed)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('renders the mnemonic step correctly', async () => {
    renderShowSecret({ seed: undefined, mnemonic });
    await user.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, passwordTest);
    await user.click(screen.getByText('Show'));

    expect(screen.getByText(mnemonic)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('displays an error message when the password is incorrect', async () => {
    mockWalletContext = generateWalletContext({ isPasswordCorrect: () => false });
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, incorrectPassword);
    await user.click(screen.getByText('Show'));

    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });

  test('calls the onBackButton function when the Cancel button is clicked', async () => {
    renderShowSecret();

    await user.click(screen.getByText('Cancel'));

    expect(onBackButton).toHaveBeenCalled();
  });

  test('renders the password error when the password is incorrect and clears it when correct', async () => {
    renderShowSecret();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    await user.click(screen.getByText('Show'));
    mockWalletContext = generateWalletContext({ isPasswordCorrect: () => false });
    await user.type(screen.getByLabelText('Password'), incorrectPassword);
    await user.click(screen.getByText('Show'));
    expect(screen.queryByText('Incorrect password')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Password'), passwordTest);
    expect(screen.queryByText('Incorrect password')).not.toBeInTheDocument();
  });

  test('copies secret to clipboard and resets after 2 seconds', async () => {
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, passwordTest);
    await user.click(screen.getByText('Show'));

    expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy seed' });
    await user.click(copyButton);

    expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
  });
});
