import { renderHook, waitFor } from '@testing-library/react';
import { SubmittableTransaction } from 'xrpl';

import { useFees } from './useFees';
import { vi } from 'vitest';
import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';

const mockDefaultFee = '12';
const mockOwnerCount = 2;
const mockReservePerOwner = RESERVE_PER_OWNER;
const mockReserve = DEFAULT_RESERVE;

// Mock the modules and hooks that `useFees` depends on
vi.mock('@sentry/react', () => ({
  captureException: vi.fn()
}));

let mockGetXrpBalance = () => Promise.resolve(50);
vi.mock('../../contexts', () => {
  return {
    useLedger: () => ({
      estimateNetworkFees: vi.fn().mockResolvedValue(mockDefaultFee),
      getAccountInfo: vi.fn().mockResolvedValue({
        result: { account_data: { OwnerCount: mockOwnerCount } }
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
        info: { validated_ledger: { reserve_base_xrp: mockReserve } }
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

      const balance = 50;
      const reserve = mockReserve + 2 * mockReservePerOwner;
      const fee = 0.000199;
      const difference = balance - reserve - fee;

      await waitFor(() => expect(result.current.difference).toEqual(difference));
    });

    it('should calculate difference correctly when balance is more than reserve + fees', async () => {
      // Set the balance to be more than reserve + fees
      mockGetXrpBalance = () => Promise.resolve(100);

      const { result } = renderHook(() => useFees(transaction, null));

      const balance = 100;
      const reserve = mockReserve + 2 * mockReservePerOwner;
      const fee = 0.000012;
      const difference = balance - reserve - fee;

      await waitFor(() => expect(result.current.difference).toEqual(difference));
    });

    it('should calculate difference correctly when balance is less than reserve + fees', async () => {
      // Set the balance to be less than reserve + fees
      mockGetXrpBalance = () => Promise.resolve(20);

      const { result } = renderHook(() => useFees(transaction, null));

      const balance = 20;
      const reserve = mockReserve + 2 * mockReservePerOwner;
      const fee = 0.000012;
      const difference = balance - reserve - fee;

      await waitFor(() => expect(result.current.difference).toEqual(difference));
    });
  });
});
