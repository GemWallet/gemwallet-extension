import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '.';
import { generateWalletContext } from '../../../mocks';
import { WalletLedger } from '../../../types';

jest.mock('../../atoms', () => ({ WalletIcon: () => 'Mocked Wallet Icon' }));
window.prompt = jest.fn();

const mockWalletContext = generateWalletContext();
const mockWalletLedger = mockWalletContext.getCurrentWallet() as WalletLedger;

describe('Header Organism', () => {
  test('Should change the copy icons after clicking the copy button', async () => {
    render(<Header wallet={mockWalletLedger} />);
    const user = userEvent.setup();

    const contentCopyIcon = screen.getByTestId('ContentCopyIcon');
    expect(contentCopyIcon).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    await user.click(copyButton);

    const doneIcon = screen.getByTestId('DoneIcon');
    expect(doneIcon).toBeInTheDocument();
  });
});
