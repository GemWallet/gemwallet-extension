import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { dropsToXrp, Transaction } from 'xrpl';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../contexts';

const DEFAULT_FEES = 'Loading ...';

const calculateTotalFees = (fees: string[]) =>
  Number(fees.reduce((acc, fee) => acc + Number(fee), 0).toFixed(2));

export const useFees = (tx: Transaction | Transaction[], fee?: string | null) => {
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [minimumFees, setMinimumFees] = useState<string>(DEFAULT_FEES);
  const [error, setError] = useState<string | undefined>();
  const [difference, setDifference] = useState<number>(1); // by default, we want to correctly display the view and not being stuck on the loading state

  const { estimateNetworkFees, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client } = useNetwork();
  const { serverInfo } = useServer();

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      const transactions = Array.isArray(tx) ? tx : [tx];

      if (transactions.length) {
        const processTransactions = async () => {
          try {
            const fees = [];
            const minimumFees = [];
            for (let i = 0; i < transactions.length; i++) {
              const transaction = transactions[i];
              if (!transaction.Account || transaction.Account === '') {
                transaction.Account = currentWallet.publicAddress;
              }

              const estimatedNetworkFee = await estimateNetworkFees(transaction);
              const fee = transaction.Fee ? transaction.Fee : estimatedNetworkFee;
              fees.push(fee);
              minimumFees.push(estimatedNetworkFee);
            }
            const totalFees = calculateTotalFees(fees);
            setEstimatedFees(totalFees.toString());
            setMinimumFees(calculateTotalFees(minimumFees).toString());

            const currentBalance = await client?.getXrpBalance(currentWallet.publicAddress);
            const baseReserve = Number(
              serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE
            );
            const diffFee = fee ? Number(fee) : totalFees;
            try {
              const accountInfo = await getAccountInfo();
              const reserve =
                accountInfo.result.account_data.OwnerCount * RESERVE_PER_OWNER + baseReserve;
              const difference = Number(currentBalance) - reserve - Number(dropsToXrp(diffFee));
              setDifference(difference);
            } catch (e) {
              const difference = Number(currentBalance) - baseReserve - Number(dropsToXrp(diffFee));
              setDifference(difference);
              Sentry.captureException(e);
            }
          } catch (e: any) {
            setError(e.message);
            Sentry.captureException(e);
          }
        };

        processTransactions();
      }
    }
  }, [
    client,
    estimateNetworkFees,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    fee,
    getAccountInfo,
    tx
  ]);

  return {
    estimatedFees,
    minimumFees,
    errorFees: error,
    difference
  };
};
