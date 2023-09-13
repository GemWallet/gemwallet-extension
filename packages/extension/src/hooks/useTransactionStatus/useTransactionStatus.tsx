import { useMemo } from 'react';

import { Button, Container, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';

import { Network } from '@gemwallet/constants';

import { InformationMessage } from '../../components/molecules';
import { AsyncTransaction, PageWithSpinner } from '../../components/templates';
import { useNetwork } from '../../contexts';
import { TransactionStatus } from '../../types';
import { toUIError } from '../../utils/errors';

interface TransactionStatusProps {
  isParamsMissing: boolean;
  network: Network | string | undefined;
  difference: number | undefined;
  transaction: TransactionStatus;
  errorRequestRejection?: Error;
  isBulk?: boolean;
  errorValue?: string;
  errorFees: string | undefined;
  progressPercentage?: number;
  badRequestCallback?: () => void;
  onClick?: () => void;
}

export const useTransactionStatus = ({
  isParamsMissing,
  network,
  difference,
  transaction,
  errorRequestRejection,
  isBulk,
  errorValue,
  errorFees,
  progressPercentage,
  badRequestCallback,
  onClick
}: TransactionStatusProps) => {
  const { client, hasOfflineBanner, reconnectToNetwork } = useNetwork();

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  const transactionStatusComponent = useMemo(() => {
    if (isParamsMissing) {
      if (badRequestCallback) {
        badRequestCallback();
      }
      return (
        <AsyncTransaction
          title={`Transaction${isBulk ? 's' : ''} rejected`}
          subtitle={
            <>
              Your transaction failed, please try again.
              <br />
              Some mandatory fields have not been provided.
            </>
          }
          transaction={TransactionStatus.Rejected}
          {...(onClick && { onClick })}
        />
      );
    }

    if (client === null && hasOfflineBanner) {
      return (
        <Container
          component="main"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <InformationMessage
            title="Failed to connect to the network"
            style={{
              padding: '15px'
            }}
          >
            <Typography style={{ marginBottom: '5px' }}>
              There was an error attempting to connect to the network. Please refresh the page and
              try again.
            </Typography>
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <Button
                variant="contained"
                onClick={reconnectToNetwork}
                style={{ marginBottom: '10px' }}
              >
                Refresh
              </Button>
            </div>
          </InformationMessage>
        </Container>
      );
    }

    if (errorFees) {
      if (errorFees === 'Account not found.') {
        return (
          <AsyncTransaction
            title="Account not activated"
            subtitle={
              <>
                {`Your account is not activated on the ${network} network.`}
                <br />
                Switch network or activate your account.
              </>
            }
            transaction={TransactionStatus.Rejected}
            {...(onClick && { onClick })}
          />
        );
      }
      Sentry.captureException('Transaction failed - errorFees: ' + errorFees);
      return (
        <AsyncTransaction
          title="Error"
          subtitle={errorFees}
          transaction={TransactionStatus.Rejected}
          {...(onClick && { onClick })}
        />
      );
    }

    if (!difference) {
      return <PageWithSpinner />;
    }

    if (errorValue) {
      if (badRequestCallback) {
        badRequestCallback();
      }
      return (
        <AsyncTransaction
          title={`Incorrect transaction${isBulk ? 's' : ''}`}
          subtitle={
            <>
              {errorValue}
              <br />
              {`Please try again with ${isBulk ? 'correct transactions' : 'a correct transaction'}`}
            </>
          }
          transaction={TransactionStatus.Rejected}
          {...(onClick && { onClick })}
        />
      );
    }

    if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Pending) {
      return (
        <AsyncTransaction
          title={
            transaction === TransactionStatus.Success
              ? `Transaction${isBulk ? 's' : ''} accepted`
              : `Transaction${isBulk ? 's' : ''} in progress`
          }
          subtitle={
            transaction === TransactionStatus.Success ? (
              `Transaction${isBulk ? 's' : ''} Successful`
            ) : (
              <>
                {`We are processing your transaction${isBulk ? 's' : ''}`}
                <br />
                Please wait
              </>
            )
          }
          transaction={transaction}
          {...(progressPercentage && { progressPercentage })}
          {...(onClick && { onClick })}
          {...(isBulk && { isBulk })}
        />
      );
    }

    if (transaction === TransactionStatus.Rejected) {
      return (
        <AsyncTransaction
          title={`Transaction${isBulk ? 's' : ''} rejected`}
          subtitle={
            <>
              {`Your transaction${isBulk ? 's' : ''} failed, please try again.`}
              <br />
              {errorRequestRejection
                ? toUIError(errorRequestRejection).message
                : 'Something went wrong'}
            </>
          }
          transaction={TransactionStatus.Rejected}
          {...(onClick && { onClick })}
        />
      );
    }
  }, [
    isParamsMissing,
    hasOfflineBanner,
    client,
    errorFees,
    difference,
    errorValue,
    transaction,
    badRequestCallback,
    isBulk,
    onClick,
    reconnectToNetwork,
    network,
    progressPercentage,
    errorRequestRejection
  ]);

  return { hasEnoughFunds, transactionStatusComponent };
};

export default useTransactionStatus;
