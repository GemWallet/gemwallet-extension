import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { dropsToXrp, Transaction } from 'xrpl';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../contexts';

const DEFAULT_FEES = 'Loading ...';

const calculateTotalFees = (fees: string[]) =>
  Number(fees.reduce((acc, fee) => acc + Number(fee), 0).toFixed(2));

export const useFees = (tx: Transaction | Transaction[], fee: string | null) => {
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [error, setError] = useState<string | undefined>();
  const [difference, setDifference] = useState<number | undefined>();

  const { estimateNetworkFees, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client } = useNetwork();
  const { serverInfo } = useServer();

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      const transactions = Array.isArray(tx) ? tx : [tx];

      const transactionPromises = transactions.map(async (transaction) => {
        if (!transaction.Account || transaction.Account === '') {
          transaction.Account = currentWallet.publicAddress;
        }
        return transaction.Fee ? transaction.Fee : await estimateNetworkFees(transaction);
      });

      const processTransactions = async () => {
        try {
          const fees = await Promise.all(transactionPromises);
          const totalFees = calculateTotalFees(fees);
          setEstimatedFees(totalFees.toString());

          const currentBalance = await client?.getXrpBalance(currentWallet.publicAddress);
          const diffFee = fee ? Number(fee) : totalFees;
          const baseReserve = Number(
            serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE
          );

          const accountInfo = await getAccountInfo();
          const reserve =
            accountInfo.result.account_data.OwnerCount * RESERVE_PER_OWNER + baseReserve;
          const difference = Number(currentBalance) - reserve - Number(dropsToXrp(diffFee));
          setDifference(difference);
        } catch (e: any) {
          setError(e.message);
          Sentry.captureException(e);
        }
      };

      processTransactions();
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
