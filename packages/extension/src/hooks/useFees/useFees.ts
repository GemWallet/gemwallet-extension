import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { useWhatChanged } from '@simbathesailor/use-what-changed';
import { dropsToXrp, Transaction } from 'xrpl';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../contexts';

const DEFAULT_FEES = 'Loading ...';

const calculateTotalFees = (fees: string[]) =>
  Number(fees.reduce((acc, fee) => acc + Number(fee), 0).toFixed(2));

export const useFees = (tx: Transaction | Transaction[], fee?: string | null) => {
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [error, setError] = useState<string | undefined>();
  const [difference, setDifference] = useState<number>(1); // by default, we want to correctly display the view and not being stuck on the loading state

  const { estimateNetworkFees, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client } = useNetwork();
  const { serverInfo } = useServer();

  let deps = [
    client,
    estimateNetworkFees,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    fee,
    getAccountInfo,
    tx
  ];

  useWhatChanged(
    deps,
    'client, estimateNetworkFees, getCurrentWallet, serverInfo?.info.validated_ledger?.reserve_base_xrp, fee, getAccountInfo, tx'
  );

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      const transactions = Array.isArray(tx) ? tx : [tx];

      // We don't want to calculate fees if the reserve has not yet been fetched since it will force a new calculation
      // when the reserve will be fetched
      // This way, we calculate fees the least amount of time possible
      if (
        transactions.length &&
        serverInfo?.info.validated_ledger?.reserve_base_xrp !== undefined
      ) {
        const processTransactions = async () => {
          try {
            const fees = [];
            for (let i = 0; i < transactions.length; i++) {
              const transaction = transactions[i];
              if (!transaction.Account || transaction.Account === '') {
                transaction.Account = currentWallet.publicAddress;
              }

              const fee = transaction.Fee
                ? transaction.Fee
                : await estimateNetworkFees(transaction);
              fees.push(fee);
            }
            const totalFees = calculateTotalFees(fees);
            setEstimatedFees(totalFees.toString());

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
              setError(undefined);
            } catch (e) {
              const difference = Number(currentBalance) - baseReserve - Number(dropsToXrp(diffFee));
              setDifference(difference);
              Sentry.captureException(e);
            }
          } catch (e: any) {
            setError(`Error while calculating fees: ${e.message}`);
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
    errorFees: error,
    difference
  };
};
