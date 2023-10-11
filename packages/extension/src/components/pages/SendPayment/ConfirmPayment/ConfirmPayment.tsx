import { FC, useCallback, useEffect, useState } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { Payment } from 'xrpl';

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
  };
}

interface Params {
  transaction: Payment | null;
}

export const ConfirmPayment: FC<ConfirmPaymentProps> = ({
  payment: { address, token, value, memos, destinationTag }
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
    buildPaymentFromProps,
    destinationTag,
    estimateNetworkFees,
    getCurrentWallet,
    memos,
    token,
    value,
    wallet
  ]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
  }, []);

  const handleConfirm = useCallback(() => {
    const [currency, issuer] = token.split('-');
    setTransaction(TransactionStatus.Pending);
    sendPayment(buildPaymentFromProps({ value, currency, issuer, address, memos, destinationTag }))
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(toUIError(e).message);
        setTransaction(TransactionStatus.Rejected);
        Sentry.captureException(e);
      });
  }, [address, buildPaymentFromProps, destinationTag, memos, sendPayment, token, value]);

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
      <TransactionDetails
        txParam={params.transaction}
        estimatedFees={estimatedFees}
        errorFees={errorFees}
        displayTransactionType={false}
      />
    </TransactionPage>
  );
};
