import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { dropsToXrp, Transaction } from 'xrpl';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../contexts';

const DEFAULT_FEES = 'Loading ...';

export const useFees = (tx: Transaction | Transaction[], fee: string | null) => {
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string | undefined>();

  const { estimateNetworkFees, getAccountInfo } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client } = useNetwork();
  const { serverInfo } = useServer();

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client) {
      const transactions = Array.isArray(tx) ? tx : [tx];

      Promise.all(
        transactions.map((transaction) => {
          if (!transaction.Account || transaction.Account === '') {
            transaction.Account = currentWallet.publicAddress;
          }

          return transaction.Fee
            ? Promise.resolve(transaction.Fee)
            : estimateNetworkFees(transaction);
        })
      )
        // fees are in drops
        .then((fees) => {
          const totalFees = Number(fees.reduce((acc, fee) => acc + Number(fee), 0).toFixed(2));
          setEstimatedFees(totalFees.toString());

          client
            ?.getXrpBalance(currentWallet.publicAddress)
            .then((currentBalance) => {
              const diffFee = fee ? Number(fee) : totalFees;
              const baseReserve = Number(
                serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE
              );

              getAccountInfo()
                .then((accountInfo) => {
                  const reserve =
                    accountInfo.result.account_data.OwnerCount * RESERVE_PER_OWNER + baseReserve;
                  const difference = Number(currentBalance) - reserve - Number(dropsToXrp(diffFee));
                  setDifference(difference);
                })
                .catch((e) => {
                  const difference =
                    Number(currentBalance) - baseReserve - Number(dropsToXrp(diffFee));
                  setDifference(difference);
                  Sentry.captureException(e);
                });
            })
            .catch((e) => {
              setErrorDifference(e.message);
            });
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
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
    errorFees,
    difference,
    errorDifference
  };
};
