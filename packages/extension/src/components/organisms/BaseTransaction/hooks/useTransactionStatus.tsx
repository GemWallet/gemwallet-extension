import { useMemo } from 'react';

import * as Sentry from '@sentry/react';

import { Network } from '@gemwallet/constants';

import { TransactionStatus } from '../../../../types';
import { AsyncTransaction, PageWithSpinner } from '../../../templates';

interface TransactionStatusProps {
  isParamsMissing: boolean;
  errorDifference: string | undefined;
  network: Network | undefined;
  difference: number | undefined;
  transaction: TransactionStatus;
  errorRequestRejection: string;
}

export const useTransactionStatus = ({
  isParamsMissing,
  errorDifference,
  network,
  difference,
  transaction,
  errorRequestRejection
}: TransactionStatusProps) => {
  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  const transactionStatusComponent = useMemo(() => {
    if (isParamsMissing) {
      return (
        <AsyncTransaction
          title="Transaction rejected"
          subtitle={
            <>
              Your transaction failed, please try again.
              <br />
              Some mandatory fields have not been provided.
            </>
          }
          transaction={TransactionStatus.Rejected}
        />
      );
    }

    if (errorDifference) {
      if (errorDifference === 'Account not found.') {
        return (
          <AsyncTransaction
            title="Account not activated"
            subtitle={
              <>
                {`Your account is not activated on the ${network} network.`}
                <br />
                {'Switch network or activate your account.'}
              </>
            }
            transaction={TransactionStatus.Rejected}
          />
        );
      }
      Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference);
      return (
        <AsyncTransaction
          title="Error"
          subtitle={errorDifference}
          transaction={TransactionStatus.Rejected}
        />
      );
    }

    if (!difference) {
      return <PageWithSpinner />;
    }

    if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Pending) {
      return (
        <AsyncTransaction
          title={
            transaction === TransactionStatus.Success
              ? 'Transaction accepted'
              : 'Transaction in progress'
          }
          subtitle={
            transaction === TransactionStatus.Success ? (
              'Transaction Successful'
            ) : (
              <>
                We are processing your transaction
                <br />
                Please wait
              </>
            )
          }
          transaction={transaction}
        />
      );
    }

    if (transaction === TransactionStatus.Rejected) {
      return (
        <AsyncTransaction
          title="Transaction rejected"
          subtitle={
            <>
              Your transaction failed, please try again.
              <br />
              {errorRequestRejection ? errorRequestRejection : 'Something went wrong'}
            </>
          }
          transaction={TransactionStatus.Rejected}
        />
      );
    }
  }, [isParamsMissing, errorDifference, network, difference, transaction, errorRequestRejection]);

  return { hasEnoughFunds, transactionStatusComponent };
};

export default useTransactionStatus;
