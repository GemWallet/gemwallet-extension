import { renderHook, waitFor } from '@testing-library/react';
import { SubmittableTransaction } from 'xrpl';

import { useFees } from './useFees';
import { vi } from 'vitest';

// Mock the modules and hooks that `useFees` depends on
vi.mock('@sentry/react', () => ({
  captureException: vi.fn()
}));

let mockGetXrpBalance = () => Promise.resolve(50);
vi.mock('../../contexts', () => {
  return {
    useLedger: () => ({
      estimateNetworkFees: vi.fn().mockResolvedValue('12'),
      getAccountInfo: vi.fn().mockResolvedValue({
        result: { account_data: { OwnerCount: 2 } }
      })
    }),
    useNetwork: () => ({
      client: {
        getXrpBalance: mockGetXrpBalance,
        connection: {
          getUrl: () => 'wss://s.altnet.rippletest.net:51233'
        }
      }
    }),
    useServer: () => ({
      serverInfo: {
        info: { validated_ledger: { reserve_base_xrp: '20' } }
      }
    }),
    useWallet: () => ({ getCurrentWallet: () => ({ publicAddress: 'address' }) })
  };
});

describe('useFees', () => {
  const transaction: SubmittableTransaction = {
    TransactionType: 'Payment',
    Destination: 'fake',
    Amount: '100000',
    Account: 'fake',
    Memos: [
      {
        Memo: {
          MemoData: '54657374206D656D6F',
          MemoType: '4465736372697074696F6E'
        }
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should estimate fees correctly', async () => {
    const { result } = renderHook(() => useFees(transaction, null));

    await waitFor(() => expect(result.current.estimatedFees).toEqual('12'));
  });

  it('useFees with a list of transactions', async () => {
    const transactions: SubmittableTransaction[] = [
      {
        TransactionType: 'Payment',
        Destination: 'fake',
        Amount: '100000',
        Account: 'fake',
        Memos: [
          {
            Memo: {
              MemoData: '54657374206D656D6F',
              MemoType: '4465736372697074696F6E'
            }
          }
        ],
        Fee: '199'
      },
      {
        TransactionType: 'Payment',
        Destination: 'fake',
        Amount: '100000',
        Account: 'fake',
        Memos: [
          {
            Memo: {
              MemoData: '54657374206D656D6F',
              MemoType: '4465736372697074696F6E'
            }
          }
        ]
        // This transaction has no Fee field, so estimateNetworkFees will be called for it
      }
    ];

    const { result } = renderHook(() => useFees(transactions, null));

    // Check the results
    // The first transaction has a Fee of 199 drops, and the second has an estimated fee of 12 drops
    await waitFor(() => expect(result.current.estimatedFees).toEqual('211'));
  });

  describe('difference calculation', () => {
    it('should calculate difference correctly when a fee is provided', async () => {
      const { result } = renderHook(() => useFees(transaction, '199'));

      // Check the results
      // balance = 50, reserve = 20 + 2 * 2 = 24, fee = dropsToXrp(199) = 0.000199
      // So, difference = balance - reserve - fee = 50 - 24 - 0.000199 = 25.999801
      await waitFor(() => expect(result.current.difference).toEqual(25.999801));
    });

    it('should calculate difference correctly when balance is more than reserve + fees', async () => {
      // Set the balance to be more than reserve + fees

      mockGetXrpBalance = () => Promise.resolve(100);

      const { result } = renderHook(() => useFees(transaction, null));

      // balance = 100, reserve = 20 + 2 * 2 = 24, fee = 12 drops
      // So, difference = balance - reserve - fee = 100 - 24 - 0.000012 = 75.999988
      await waitFor(() => expect(result.current.difference).toEqual(75.999988));
    });

    it('should calculate difference correctly when balance is less than reserve + fees', async () => {
      // Set the balance to be less than reserve + fees
      mockGetXrpBalance = () => Promise.resolve(20);

      const { result } = renderHook(() => useFees(transaction, null));

      // balance = 20, reserve = 20 + 2 * 2 = 24, fee = 12 drops
      // So, difference = balance - reserve - fee = 20 - 24 - 0.000012 = -4.000012
      await waitFor(() => expect(result.current.difference).toEqual(-4.000012));
    });
  });
});
