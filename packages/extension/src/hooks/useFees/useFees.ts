import { useEffect, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';
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

  const reserveBase = useMemo(() => {
    return serverInfo?.info.validated_ledger?.reserve_base_xrp;
  }, [serverInfo?.info.validated_ledger?.reserve_base_xrp]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      const transactions = Array.isArray(tx) ? tx : [tx];

      // We don't want to calculate fees if the reserve has not yet been fetched since it will force a new calculation
      // when the reserve will be fetched
      // This way, we calculate fees the least amount of time possible
      if (transactions.length && reserveBase !== undefined) {
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
            const baseReserve = Number(reserveBase || DEFAULT_RESERVE);
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
    // Since switching network from the Transaction view updates multiple objects in a non-atomic way -client, estimateNetworkFees, etc- we want to optimize the number of calls
    // in order to avoid fees calculation errors due multiple estimation of fees at the same time and race conditions
    // getAccountInfo and estimateNetworkFees depend on the client, so we do not put them in the deps array
    // getCurrentWallet will not change so will never trigger a recalculation
    // Also, we consider that the client is updated when the url changes, otherwise we consider that the newtork is the same and the fees won't change
    // Finally, if the transaction object and the provided fee are updated, we need to recalculate the fees
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.connection.getUrl(), reserveBase, tx, fee, getCurrentWallet]);

  return {
    estimatedFees,
    errorFees: error,
    difference
  };
};
