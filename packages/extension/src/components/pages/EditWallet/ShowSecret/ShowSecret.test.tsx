import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { generateWalletContext } from '../../../../mocks';
import { ShowSecret, ShowSecretProps } from './ShowSecret';

const password = 'test-password';

let mockWalletContext = generateWalletContext({
  password
});

jest.mock('../../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

const seed = 'test-seed';
const mnemonic = 'test mnemonic';
const incorrectPassword = 'incorrect-password';
const onBackButton = jest.fn();

const renderShowSecret = (props?: Partial<ShowSecretProps>) =>
  render(<ShowSecret seed={seed} mnemonic={mnemonic} onBackButton={onBackButton} {...props} />);

describe('ShowSecret', () => {
  it('renders the seed password step correctly', () => {
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

  it('renders the mnemonic password step correctly', () => {
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

  it('renders the seed step correctly', () => {
    renderShowSecret();
    fireEvent.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText(seed)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders the mnemonic step correctly', () => {
    renderShowSecret({ seed: undefined, mnemonic });
    fireEvent.click(screen.getByText('Show'));

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText(mnemonic)).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays an error message when the password is incorrect', () => {
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: incorrectPassword } });
    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });

  it('calls the onBackButton function when the Cancel button is clicked', () => {
    renderShowSecret();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onBackButton).toHaveBeenCalled();
  });

  it('renders the password error when the password is incorrect and clears it when correct', () => {
    renderShowSecret();
    fireEvent.click(screen.getByText('Show'));
    userEvent.type(screen.getByLabelText('Password'), incorrectPassword);
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
    expect(screen.queryByText('Incorrect password')).toBeNull();
  });

  it('copies secret to clipboard and resets after 2 seconds', async () => {
    renderShowSecret();

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: password } });
    await fireEvent.click(screen.getByText('Show'));

    expect(screen.getByTestId('ContentCopyIcon')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy seed' });
    await fireEvent.click(copyButton);

    expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
  });
});
