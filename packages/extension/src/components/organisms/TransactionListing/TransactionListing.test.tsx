import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TransactionListing } from './TransactionListing';
import { mockTransactions } from './TransactionListing.mock';
import { generateWalletContext } from '../../../mocks';

const user = userEvent.setup();

let mockWalletContext = generateWalletContext();
jest.mock('../../../contexts', () => ({
  useWallet: () => mockWalletContext
}));

describe('TransactionListing', () => {
  beforeEach(() => {
    mockWalletContext = generateWalletContext();
  });

  test('renders the page with spinner when the wallet is not loaded', () => {
    mockWalletContext = generateWalletContext({ getCurrentWallet: () => undefined });
    render(<TransactionListing transactions={[]} />);
    expect(screen.getByTestId('page-with-spinner')).toBeInTheDocument();
  });

  test('renders the information message when there are no transactions', async () => {
    render(<TransactionListing transactions={[]} />);
    expect(screen.getByText('No transactions to show')).toBeInTheDocument();
    const message = screen.getByText('There are no history of transactions with this wallet.');
    expect(message).toBeInTheDocument();
  });

  test('renders the list of transactions', async () => {
    render(<TransactionListing transactions={mockTransactions} />);

    const transactionTextElements = screen.getAllByText(
      /Payment sent - 20 XRP|TrustLine transaction/
    );

    // Assert that both elements are present
    expect(transactionTextElements[0]).toBeInTheDocument();
    expect(transactionTextElements[1]).toBeInTheDocument();

    // Continue with other assertions as needed
    expect(screen.getByText('Feb 12, 2023 - 17:31')).toBeInTheDocument();
    expect(screen.getByText('Feb 12, 2023 - 06:48')).toBeInTheDocument();
  });

  test('renders the transaction details when the transaction is clicked', async () => {
    render(<TransactionListing transactions={mockTransactions} />);
    const transaction = await screen.findByText('Payment sent - 20 XRP');
    expect(transaction).toBeInTheDocument();
    await user.click(transaction);
    expect(screen.getByText('Transaction Hash')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Transaction')).toBeInTheDocument();
    expect(screen.getByText('Fees')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Ledger Index')).toBeInTheDocument();
    const closeButton = await screen.findByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
    expect(transaction).toBeInTheDocument();
  });

  test('dialog renders properly', async () => {
    render(<TransactionListing transactions={mockTransactions} />);
    const transaction = await screen.findByText('Payment sent - 20 XRP');
    expect(transaction).toBeInTheDocument();
    await user.click(transaction);
    const dialog = await screen.findByTestId('dialog');
    expect(dialog).toBeInTheDocument();
    await user.type(dialog, '{esc}');
    expect(transaction).toBeInTheDocument();
  });
});
