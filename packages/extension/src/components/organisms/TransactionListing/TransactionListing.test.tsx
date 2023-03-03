import { fireEvent, render } from '@testing-library/react';

import { generateWalletContext } from '../../../mocks';
import { TransactionListing } from './TransactionListing';
import { mockTransactions } from './TransactionListing.mock';

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
    const screen = render(<TransactionListing transactions={[]} />);
    expect(screen.getByTestId('page-with-spinner')).toBeInTheDocument();
  });

  test('renders the information message when there are no transactions', async () => {
    const screen = render(<TransactionListing transactions={[]} />);
    expect(screen.getByText('No transactions to show')).toBeInTheDocument();
    const message = screen.getByText('There are no history of transactions with this wallet.');
    expect(message).toBeInTheDocument();
  });

  test('renders the list of transactions', async () => {
    const screen = render(<TransactionListing transactions={mockTransactions} />);
    expect(screen.getByText('Payment sent - 20 XRP')).toBeInTheDocument();
    expect(screen.getByText('12 February 2023 - 17:31')).toBeInTheDocument();
    expect(screen.getByText('TrustLine transaction')).toBeInTheDocument();
    expect(screen.getByText('12 February 2023 - 06:48')).toBeInTheDocument();
  });

  test('renders the transaction details when the transaction is clicked', async () => {
    const screen = render(<TransactionListing transactions={mockTransactions} />);
    const transaction = await screen.findByText('Payment sent - 20 XRP');
    expect(transaction).toBeInTheDocument();
    await fireEvent.click(transaction);
    expect(screen.getByText('Transaction Hash')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Transaction')).toBeInTheDocument();
    expect(screen.getByText('Fees')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Ledger Index')).toBeInTheDocument();
    const closeButton = await screen.findByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    await fireEvent.click(closeButton);
    expect(transaction).toBeInTheDocument();
  });

  test('dialog renders properly', async () => {
    const screen = render(<TransactionListing transactions={mockTransactions} />);
    const transaction = await screen.findByText('Payment sent - 20 XRP');
    expect(transaction).toBeInTheDocument();
    await fireEvent.click(transaction);
    const dialog = await screen.findByTestId('dialog');
    expect(dialog).toBeInTheDocument();
    await fireEvent.keyDown(dialog);
    expect(transaction).toBeInTheDocument();
  });
});
