import { useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { Transaction } from 'xrpl';

import { DEFAULT_RESERVE, RESERVE_PER_OWNER } from '../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../contexts';

const DEFAULT_FEES = 'Loading ...';

export const useFees = (tx: Transaction, fee: string | null) => {
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
      if (!tx.Account || tx.Account === '') tx.Account = currentWallet.publicAddress;
      estimateNetworkFees(tx)
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [client, estimateNetworkFees, getCurrentWallet, tx]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet) {
      client
        ?.getXrpBalance(currentWallet.publicAddress)
        .then((currentBalance) => {
          const diffFee = fee ? Number(fee) : Number(estimatedFees);
          const baseReserve = Number(
            serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE
          );

          getAccountInfo()
            .then((accountInfo) => {
              const reserve =
                accountInfo.result.account_data.OwnerCount * RESERVE_PER_OWNER + baseReserve;
              const difference = Number(currentBalance) - reserve - Number(diffFee);
              setDifference(difference);
            })
            .catch((e) => {
              const difference = Number(currentBalance) - baseReserve - Number(diffFee);
              setDifference(difference);
            });
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    estimatedFees,
    fee,
    getAccountInfo
  ]);

  return {
    estimatedFees,
    errorFees,
    difference,
    errorDifference
  };
};
