import { FC, useCallback, useState } from 'react';

import { Button, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { HOME_PATH } from '../../../constants';
import { useLedger, useNetwork, useWallet } from '../../../contexts';
import { useFees } from '../../../hooks';
import { useTransactionStatus } from '../../../hooks/useTransactionStatus/useTransactionStatus';
import { TransactionStatus } from '../../../types';
import { PageWithReturn } from '../../templates';

interface DeleteAccountConfirmProps {
  destinationAddress: string;
  onCancel: () => void;
}

export const DeleteAccountConfirm: FC<DeleteAccountConfirmProps> = ({
  destinationAddress,
  onCancel
}) => {
  const { deleteAccount } = useLedger();
  const { networkName } = useNetwork();
  const { getCurrentWallet } = useWallet();

  const navigate = useNavigate();
  const wallet = getCurrentWallet();

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');

  const { errorFees, difference } = useFees(
    {
      TransactionType: 'AccountDelete',
      Account: '',
      Destination: destinationAddress
    },
    null
  );

  const { transactionStatusComponent } = useTransactionStatus({
    isParamsMissing: false,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    onClick: () => navigate(HOME_PATH)
  });

  const onConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    deleteAccount(destinationAddress)
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        Sentry.captureException(e);
      });
  }, [deleteAccount, destinationAddress]);

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithReturn title="Confirm Account Deletion" onBackClick={onCancel}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '1rem',
              marginBottom: '3rem'
            }}
          >
            <Typography variant="h5" align="center" style={{ marginTop: '1rem', color: 'red' }}>
              Final Step: Confirm Account Deletion
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
              You are about to permanently delete the following account from the XRPL:
            </Typography>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '4px',
                padding: '0.2rem 0.5rem',
                marginTop: '1rem',
                display: 'inline-block'
              }}
            >
              <Typography
                variant="body2"
                align="center"
                style={{
                  fontFamily: 'Courier New, Courier, monospace',
                  color: 'black'
                }}
              >
                {wallet?.publicAddress}
              </Typography>
            </div>
            <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
              and transfer your XRP funds to:
            </Typography>
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '4px',
                padding: '0.2rem 0.5rem',
                marginTop: '1rem',
                display: 'inline-block'
              }}
            >
              <Typography
                variant="body2"
                align="center"
                style={{
                  fontFamily: 'Courier New, Courier, monospace',
                  color: 'black'
                }}
              >
                {destinationAddress}
              </Typography>
            </div>
            <Typography variant="body1" align="center" style={{ marginTop: '2rem' }}>
              This action cannot be undone. Please confirm only if you are absolutely sure.
            </Typography>
          </div>
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              margin: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button variant="contained" size="large" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outlined" size="large" onClick={onConfirm} color="error">
              Confirm Deletion
            </Button>
          </div>
        </PageWithReturn>
      )}
    </>
  );
};
