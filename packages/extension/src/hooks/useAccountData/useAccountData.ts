import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AccountLinesTrustline } from 'xrpl';

import { useNetwork, useLedger, useServer } from '../../contexts';
import { Chain } from '@gemwallet/constants';
import { DEFAULT_RESERVE, RESERVE_PER_OWNER, XAHAU_RESERVE_PER_OWNER } from '../../constants';

interface TrustLineBalance {
  value: string;
  currency: string;
  issuer: string;
  trustlineDetails?: {
    limit: number;
    noRipple: boolean;
  };
}

interface AccountBalanceData {
  mainTokenBalance: string;
  trustLineBalances: TrustLineBalance[];
  reserve: number;
  ownerReserve: number;
  baseReserve: number;
}

// Query keys for cache management
export const accountQueryKeys = {
  all: ['account'] as const,
  balances: (address: string, networkName: string) =>
    [...accountQueryKeys.all, 'balances', address, networkName] as const,
  accountInfo: (address: string, networkName: string) =>
    [...accountQueryKeys.all, 'info', address, networkName] as const
};

/**
 * Hook to fetch and cache account balances with TanStack Query.
 * Data is cached for 30 seconds and won't refetch on page navigation.
 */
export const useAccountBalances = (address: string) => {
  const { client, networkName, chainName } = useNetwork();
  const { serverInfo } = useServer();
  const { getAccountInfo } = useLedger();

  const baseReserve = serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE;
  const ownerReserveBase =
    chainName === Chain.XAHAU
      ? serverInfo?.info.validated_ledger?.reserve_inc_xrp || XAHAU_RESERVE_PER_OWNER
      : serverInfo?.info.validated_ledger?.reserve_inc_xrp || RESERVE_PER_OWNER;

  return useQuery<AccountBalanceData, Error>({
    queryKey: accountQueryKeys.balances(address, networkName),
    queryFn: async (): Promise<AccountBalanceData> => {
      if (!client) {
        throw new Error('Client not connected');
      }

      // Fetch balances
      const balances = await client.getBalances(address);
      const mainTokenBalance = balances?.find((balance) => balance.issuer === undefined);
      let trustLineBalances = balances?.filter(
        (balance) => balance.issuer !== undefined
      ) as TrustLineBalance[];

      // Fetch account lines for trustline details
      const accountLines = await client.request({
        command: 'account_lines',
        account: address
      });

      if (accountLines?.result?.lines) {
        trustLineBalances = trustLineBalances
          .map((trustlineBalance) => {
            const trustlineDetails = accountLines.result.lines.find(
              (line: AccountLinesTrustline) =>
                line.currency === trustlineBalance.currency &&
                line.account === trustlineBalance.issuer
            );

            return {
              ...trustlineBalance,
              trustlineDetails:
                trustlineDetails && Number(trustlineDetails.limit)
                  ? {
                      limit: Number(trustlineDetails.limit),
                      noRipple: trustlineDetails.no_ripple === true
                    }
                  : undefined
            };
          })
          .filter(
            (trustlineBalance) =>
              trustlineBalance.trustlineDetails || trustlineBalance.value !== '0'
          );
      }

      // Fetch account info for reserve calculation
      const accountInfo = await getAccountInfo();
      const calculatedOwnerReserve = accountInfo.result.account_data.OwnerCount * ownerReserveBase;
      const reserve = calculatedOwnerReserve + baseReserve;

      return {
        mainTokenBalance: mainTokenBalance?.value || '0',
        trustLineBalances: trustLineBalances || [],
        reserve,
        ownerReserve: calculatedOwnerReserve,
        baseReserve
      };
    },
    enabled: !!client && !!address,
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnMount: false, // Don't refetch when component mounts if data is fresh
    refetchOnWindowFocus: false
    // retry is inherited from QueryClient defaults (false in tests, 1 in production)
  });
};

/**
 * Hook to invalidate account balance cache.
 * Call this after transactions that change balances.
 */
export const useInvalidateAccountBalances = () => {
  const queryClient = useQueryClient();

  return (address?: string, networkName?: string) => {
    if (address && networkName) {
      queryClient.invalidateQueries({
        queryKey: accountQueryKeys.balances(address, networkName)
      });
    } else {
      // Invalidate all account balance queries
      queryClient.invalidateQueries({
        queryKey: [...accountQueryKeys.all, 'balances']
      });
    }
  };
};
