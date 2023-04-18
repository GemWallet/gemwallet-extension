import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { xrpToDrops } from 'xrpl';

import { TxMemo, buildMemos } from "@gemwallet/constants";

import { ERROR_RED, HOME_PATH } from '../../../../constants';
import { useLedger, useWallet } from '../../../../contexts';
import { TransactionStatus } from '../../../../types';
import { convertCurrencyString, formatToken } from '../../../../utils';
import { TileLoader } from '../../../atoms';
import { AsyncTransaction, PageWithReturn } from '../../../templates';

const DEFAULT_FEES = 'Loading ...';

export interface ConfirmPaymentProps {
  payment: {
    address: string;
    token: string;
    amount: string;
    memo?: TxMemo;
  };
  onClickBack: () => void;
}

export const ConfirmPayment: FC<ConfirmPaymentProps> = ({
  payment: { address, token, amount, memo },
  onClickBack
}) => {
  const { getCurrentWallet } = useWallet();
  const { estimateNetworkFees, sendPayment } = useLedger();
  const navigate = useNavigate();
  const [fees, setFees] = useState<string>('');
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
        Amount:
          currency && issuer
            ? {
                currency,
                issuer,
                value: amount
              }
            : xrpToDrops(amount),
        Destination: address,
        Memos: buildMemos(memo)
      })
        .then((fees) => {
          setFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [address, amount, estimateNetworkFees, getCurrentWallet, memo, token, wallet]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
  }, []);

  const handleConfirmPayment = useCallback(() => {
    const [currency, issuer] = token.split('-');
    setTransaction(TransactionStatus.Pending);
    sendPayment({
      amount: amount,
      destination: address,
      currency: currency ?? undefined,
      issuer: issuer ?? undefined,
      memo: memo ?? undefined
    })
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        Sentry.captureException(e);
      });
  }, [address, amount, memo, sendPayment, token]);

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
      <Paper elevation={24} style={{ padding: '10px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h6" component="h1" gutterBottom align="right">
          {formatToken(Number(amount), convertCurrencyString(token.split('-')[0]) || 'XRP')}
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
          ) : fees === DEFAULT_FEES ? (
            <TileLoader secondLineOnly />
          ) : (
            formatToken(Number(fees), 'XRP')
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
