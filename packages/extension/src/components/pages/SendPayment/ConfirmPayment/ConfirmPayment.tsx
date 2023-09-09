import { FC, useCallback, useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Payment } from 'xrpl';
=======
import { xrpToDrops } from 'xrpl';
>>>>>>> c7eb7571 (use xrpToDrops in ConfirmPayment view)

import { Memo } from '@gemwallet/constants';

import { HOME_PATH } from '../../../../constants';
import { useLedger, useWallet } from '../../../../contexts';
import { TransactionStatus } from '../../../../types';
import { buildAmount, toXRPLMemos } from '../../../../utils';
import { toUIError } from '../../../../utils/errors';
import { TransactionDetails } from '../../../organisms';
import { AsyncTransaction, TransactionPage } from '../../../templates';

const DEFAULT_FEES = 'Loading ...';

export interface ConfirmPaymentProps {
  payment: {
    address: string;
    token: string;
    value: string;
    memos?: Memo[];
    destinationTag?: number;
    transactionFee?: string;
  };
}

interface Params {
  transaction: Payment | null;
}

export interface RenderFeeProps {
  errorFees: string;
  estimatedFees: string;
  transactionFee?: string;
}

const RenderFee: FC<RenderFeeProps> = ({ errorFees, estimatedFees, transactionFee }) => {
  if (errorFees) {
    return (
      <Typography variant="caption" style={{ color: ERROR_RED }}>
        {errorFees}
      </Typography>
    );
  }

  if (transactionFee) {
    return <>{formatAmount(xrpToDrops(transactionFee))}</>;
  }

  if (estimatedFees === DEFAULT_FEES) {
    return <TileLoader secondLineOnly />;
  }

  return <>{formatAmount(estimatedFees)}</>;
};

export const ConfirmPayment: FC<ConfirmPaymentProps> = ({
<<<<<<< HEAD
  payment: { address, token, value, memos, destinationTag }
=======
  payment: { address, token, value, memos, destinationTag, transactionFee },
  onClickBack
>>>>>>> a7d13987 (Added custom transaction fee)
}) => {
  const [params, setParams] = useState<Params>({
    transaction: null
  });
  const { getCurrentWallet } = useWallet();
  const { estimateNetworkFees, sendPayment } = useLedger();
  const navigate = useNavigate();
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState<string>('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>();
  const wallet = getCurrentWallet();

<<<<<<< HEAD
  const buildPaymentFromProps = useCallback(
    (params: {
      value: string;
      currency: string;
      issuer: string;
      address: string;
      memos?: Memo[];
      destinationTag?: number;
    }): Payment => {
      const { value, currency, issuer, address, memos, destinationTag } = params;
      return {
=======
  useEffect(() => {
    if (wallet && !transactionFee) {
      const [currency, issuer] = token.split('-');
      estimateNetworkFees({
>>>>>>> a7d13987 (Added custom transaction fee)
        TransactionType: 'Payment',
        Account: wallet?.publicAddress ?? '',
        Amount: buildAmount(value, currency, issuer),
        Destination: address,
        Memos: toXRPLMemos(memos),
        DestinationTag: destinationTag
      };
    },
    [wallet]
  );

  useEffect(() => {
    if (wallet) {
      const [currency, issuer] = token.split('-');
      const paymentTx = buildPaymentFromProps({
        value,
        currency,
        issuer,
        address,
        memos,
        destinationTag
      });
      estimateNetworkFees(paymentTx)
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });

      setParams({ transaction: paymentTx });
    }
  }, [
    address,
<<<<<<< HEAD
    buildPaymentFromProps,
=======
>>>>>>> a7d13987 (Added custom transaction fee)
    destinationTag,
    estimateNetworkFees,
    getCurrentWallet,
    memos,
    token,
    value,
<<<<<<< HEAD
=======
    transactionFee,
>>>>>>> a7d13987 (Added custom transaction fee)
    wallet
  ]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
  }, []);

  const handleConfirm = useCallback(() => {
    const [currency, issuer] = token.split('-');
    setTransaction(TransactionStatus.Pending);
<<<<<<< HEAD
    sendPayment(buildPaymentFromProps({ value, currency, issuer, address, memos, destinationTag }))
=======
    sendPayment({
      amount: buildAmount(value, currency, issuer),
      destination: address,
      memos: memos,
      destinationTag: destinationTag,
      fee: transactionFee ? xrpToDrops(transactionFee) : undefined
    })
>>>>>>> a7d13987 (Added custom transaction fee)
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(toUIError(e).message);
        setTransaction(TransactionStatus.Rejected);
        Sentry.captureException(e);
      });
<<<<<<< HEAD
  }, [address, buildPaymentFromProps, destinationTag, memos, sendPayment, token, value]);
=======
  }, [address, destinationTag, memos, sendPayment, token, value, transactionFee]);
>>>>>>> bf2d7a87 (minor issue fix)

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
    <TransactionPage
      title="Send Payment"
      description="Please review the transaction below."
      approveButtonText="Submit"
      onClickApprove={handleConfirm}
      onClickReject={handleReject}
    >
<<<<<<< HEAD
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        errorFees={errorFees}
        displayTransactionType={false}
      />
    </TransactionPage>
=======
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
          <RenderFee {...{ errorFees, estimatedFees, transactionFee }} />
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
>>>>>>> a7d13987 (Added custom transaction fee)
  );
};
