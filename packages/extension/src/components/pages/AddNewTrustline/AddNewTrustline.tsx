import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import {
  GEM_WALLET,
  Memo,
  TrustSetFlags,
  ReceiveTrustlineHashBackgroundMessage,
  LimitAmount
} from '@gemwallet/constants';

import { DEFAULT_RESERVE, HOME_PATH } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import {
  checkFee,
  parseLimitAmount,
  parseMemos,
  parseTrustSetFlags,
  toXRPLMemos
} from '../../../utils';
import {
  StepForm,
  StepWarning,
  StepConfirm
} from '../../pages';
import { AsyncTransaction, PageWithSpinner } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

type STEP = 'WARNING' | 'TRANSACTION';

interface Params {
  limitAmount: LimitAmount | null;
  fee: string | null;
  id: number;
  memos: Memo[] | null;
  flags: TrustSetFlags | null;
  inAppCall: boolean;
  showForm: boolean;
}

export const AddNewTrustline: FC = () => {
  const [step, setStep] = useState<STEP>('WARNING');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [params, setParams] = useState<Params>({
    limitAmount: null,
    fee: null,
    id: 0,
    memos: null,
    flags: null,
    inAppCall: false,
    showForm: false
  });
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string>('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);

  const { estimateNetworkFees, setTrustline } = useLedger();
  const { client, network } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const { serverInfo } = useServer();
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const limitAmount = parseLimitAmount(urlParams.get('limitAmount'));
    const fee = checkFee(urlParams.get('fee'));
    const id = Number(urlParams.get('id')) || 0;
    const memos = parseMemos(urlParams.get('memos'));
    const flags = parseTrustSetFlags(urlParams.get('flags'));
    const inAppCall = urlParams.get('inAppCall') === 'true' || false;
    const showForm = urlParams.get('showForm') === 'true' || false;

    if (limitAmount === null) {
      setIsParamsMissing(true);
    }

    if (Number.isNaN(Number(limitAmount?.value))) {
      setErrorValue('The value must be a number, the value provided was not a number.');
    }

    setParams({
      limitAmount,
      fee,
      id,
      memos,
      flags,
      inAppCall,
      showForm
    });
  }, []);

  useEffect(() => {
    const wallet = getCurrentWallet();

    if (wallet && params.limitAmount) {
      estimateNetworkFees({
        TransactionType: 'TrustSet',
        Account: wallet.publicAddress,
        Fee: params.fee || undefined,
        LimitAmount: params.limitAmount,
        Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
        Flags: params.flags ?? undefined
      })
        .then((fees) => {
          setEstimatedFees(fees);
        })
        .catch((e) => {
          Sentry.captureException(e);
          setErrorFees(e.message);
        });
    }
  }, [
    estimateNetworkFees,
    getCurrentWallet,
    params.limitAmount,
    params.fee,
    params.memos,
    params.flags
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.limitAmount) {
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
            Number(params.fee || 0);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    params.fee,
    params.limitAmount
  ]);

  const isValidIssuer = useMemo(() => {
    if (params.limitAmount && isValidAddress(params.limitAmount?.issuer)) {
      return true;
    }
    return false;
  }, [params.limitAmount]);

  const hasEnoughFunds = useMemo(() => Number(difference) > 0, [difference]);

  const createMessage = useCallback(
    (transactionHash: string | null | undefined): ReceiveTrustlineHashBackgroundMessage => {
      return {
        app: GEM_WALLET,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          id: params.id,
          hash: transactionHash
        }
      };
    },
    [params.id]
  );

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage(null);
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
    }
  }, [createMessage, params.inAppCall]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Value, currency and issuer will be present because if not,
    // we won't be able to go to the confirm transaction state
    if (params.limitAmount === null) {
      setIsParamsMissing(true);
    } else {
      setTrustline({
        limitAmount: params.limitAmount,
        fee: params.fee || undefined,
        memos: params.memos ?? undefined,
        flags: params.flags ?? undefined
      })
        .then((transactionHash) => {
          setTransaction(TransactionStatus.Success);
          const message = createMessage(transactionHash);
          if (!params.inAppCall) {
            chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
          }
        })
        .catch((e) => {
          setErrorRequestRejection(e.message);
          setTransaction(TransactionStatus.Rejected);
          const message = createMessage(undefined);
          if (!params.inAppCall) {
            chrome.runtime.sendMessage<ReceiveTrustlineHashBackgroundMessage>(message);
          }
        });
    }
  }, [setTrustline, createMessage, params.limitAmount, params.fee, params.inAppCall, params.flags, params.memos]);

  const handleTrustlineSubmit = (issuer: string, token: string, limit: string, showForm: boolean, isParamsMissing: boolean) => {
    setParams({
      limitAmount: params.limitAmount,
      fee: params.fee,
      id: params.id,
      memos: params.memos,
      flags: params.flags,
      showForm: showForm,
      inAppCall: true,
    });

    setIsParamsMissing(isParamsMissing);
  };

  if (params.showForm) {
    return (
      <StepForm onTrustlineSubmit={handleTrustlineSubmit} />
    )
  }

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />A value, currency and issuer need to be provided to the extension.
          </>
        }
        transaction={TransactionStatus.Rejected}
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
      />
    );
  }

  if (!isValidIssuer) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The issuer of the trustline is invalid.
          </>
        }
        transaction={TransactionStatus.Rejected}
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
      />
    );
  }

  if (errorValue) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            {errorValue}
            <br />
            {'Please try again with a correct transaction'}
          </>
        }
        transaction={TransactionStatus.Rejected}
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
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
          {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
        />
      );
    }
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference}
        transaction={TransactionStatus.Rejected}
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
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
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
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
        {...(params.inAppCall ? { onClick: () => navigate(HOME_PATH) } : {})}
      />
    );
  }

  if (step === 'WARNING') {
    return (
      <StepWarning onReject={handleReject} onContinue={() => setStep('TRANSACTION')} />
    );
  }

  return (
    <StepConfirm
      limitAmount={params.limitAmount}
      fee={params.fee}
      estimatedFees={estimatedFees}
      errorFees={errorFees}
      hasEnoughFunds={hasEnoughFunds}
      defaultFee={DEFAULT_FEES}
      onReject={handleReject}
      onConfirm={handleConfirm}
    />
  );
};
