import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';

import { Memo } from '@gemwallet/constants';

import { ERROR_RED, HOME_PATH } from '../../../../constants';
import { useLedger, useWallet } from '../../../../contexts';
import { TransactionStatus } from '../../../../types';
import { buildAmount, formatAmount, toXRPLMemos } from '../../../../utils';
import { toUIError } from '../../../../utils/errors';
import { fromHexMemos } from '../../../../utils/payment';
import { TileLoader } from '../../../atoms';
import { AsyncTransaction, PageWithReturn } from '../../../templates';

const DEFAULT_FEES = 'Loading ...';

export interface ConfirmPaymentProps {
  payment: {
    address: string;
    token: string;
    value: string;
    memos?: Memo[];
    destinationTag?: number;
  };
  onClickBack: () => void;
}

export const ConfirmPayment: FC<ConfirmPaymentProps> = ({
  payment: { address, token, value, memos, destinationTag },
  onClickBack
}) => {
  const { getCurrentWallet } = useWallet();
  const { estimateNetworkFees, sendPayment } = useLedger();
  const navigate = useNavigate();
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState<string>('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const wallet = getCurrentWallet();

  useEffect(() => {
    if (wallet) {
      const [currency, issuer] = token.split('-');
      estimateNetworkFees({
        TransactionType: 'Payment',
        Account: wallet.publicAddress,
        Amount: buildAmount(value, currency, issuer),
        Destination: address,
        Memos: toXRPLMemos(memos),
        DestinationTag: destinationTag
      })
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [address, destinationTag, estimateNetworkFees, getCurrentWallet, memos, token, value, wallet]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
  }, []);

  const handleConfirmPayment = useCallback(() => {
    const [currency, issuer] = token.split('-');
    setTransaction(TransactionStatus.Pending);
    sendPayment({
      amount: buildAmount(value, currency, issuer),
      destination: address,
      memos: memos,
      destinationTag: destinationTag
    })
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        const UIError = toUIError(e);
        setErrorRequestRejection(UIError.message);
        setTransaction(TransactionStatus.Rejected);
        Sentry.captureException(e);
      });
  }, [address, destinationTag, memos, sendPayment, token, value]);

  const handleTransactionClick = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

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
        onClick={handleTransactionClick}
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
            {errorRequestRejection ? errorRequestRejection : ''}
          </>
        }
        transaction={TransactionStatus.Rejected}
        onClick={handleTransactionClick}
      />
    );
  }

  const decodedMemos = fromHexMemos(memos);
  const [currency, issuer] = token.split('-');

  return (
    <PageWithReturn
      title="Confirm Payment"
      onBackClick={onClickBack}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">From:</Typography>
        <Typography variant="body2">{wallet?.name}</Typography>
        <Typography variant="body2">{wallet?.publicAddress}</Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{address}</Typography>
      </Paper>
      {decodedMemos && decodedMemos.length > 0 ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Memos:</Typography>
          {decodedMemos.map((memo, index) => (
            <div
              key={index}
              style={{
                marginBottom: index === decodedMemos.length - 1 ? 0 : '8px'
              }}
            >
              <Typography
                variant="body2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {memo.memo.memoData}
              </Typography>
            </div>
          ))}
        </Paper>
      ) : null}
      {destinationTag ? (
        <Paper elevation={24} style={{ padding: '10px' }}>
          <Typography variant="body1">Destination Tag:</Typography>
          <Typography variant="body2">{destinationTag}</Typography>
        </Paper>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h6" component="h1" align="right">
          {formatAmount(buildAmount(value, currency, issuer))}
        </Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="These are the fees to make the transaction over the network">
            <IconButton size="small">
              <ErrorIcon />
            </IconButton>
          </Tooltip>
          Network fees:
        </Typography>
        <Typography variant="body2" gutterBottom align="right">
          {errorFees ? (
            <Typography variant="caption" style={{ color: ERROR_RED }}>
              {errorFees}
            </Typography>
          ) : estimatedFees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : (
            formatAmount(estimatedFees)
          )}
        </Typography>
      </Paper>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirmPayment}>
          Confirm
        </Button>
      </Container>
    </PageWithReturn>
  );
};
