import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { dropsToXrp, isValidAddress } from 'xrpl';
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  Memo,
  ReceiveSetTrustlineBackgroundMessage,
  ReceiveSetTrustlineBackgroundMessageDeprecated,
  ResponseType,
  TrustSetFlags,
  TrustSetFlagsBitmask
} from '@gemwallet/constants';

import {
  API_ERROR_BAD_ISSUER,
  API_ERROR_BAD_REQUEST,
  DEFAULT_RESERVE,
  HOME_PATH
} from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import {
  checkFee,
  currencyToHex,
  fromHexMemos,
  parseLimitAmount,
  parseMemos,
  parseTrustSetFlags,
  toXRPLMemos
} from '../../../utils';
import { serializeError } from '../../../utils/errors';
import { StepForm, StepWarning, StepConfirm } from '../../pages';
import { AsyncTransaction, PageWithSpinner } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

type STEP = 'WARNING' | 'TRANSACTION';

interface Params {
  limitAmount: IssuedCurrencyAmount | null;
  fee: string | null;
  id: number;
  memos: Memo[] | null;
  flags: TrustSetFlags | null;
  inAppCall: boolean;
  showForm: boolean;
}

export const AddNewTrustline: FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const inAppCall = urlParams.get('inAppCall') === 'true' || false;

  const [step, setStep] = useState<STEP>('WARNING');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [params, setParams] = useState<Params>({
    limitAmount: null,
    fee: null,
    id: 0,
    memos: null,
    flags: null,
    inAppCall,
    showForm: false
  });
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<Error | undefined>();
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);

  const { estimateNetworkFees, setTrustline } = useLedger();
  const { client, network } = useNetwork();
  const { getCurrentWallet } = useWallet();
  const { serverInfo } = useServer();
  const navigate = useNavigate();

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get('requestMessage') === 'REQUEST_SET_TRUSTLINE/V3'
      ? 'RECEIVE_SET_TRUSTLINE/V3'
      : 'RECEIVE_TRUSTLINE_HASH';
  }, []);

  const createMessage = useCallback(
    (messagePayload: {
      transactionHash: string | null | undefined;
      error?: Error;
    }): ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated => {
      const { transactionHash, error } = messagePayload;

      if (receivingMessage === 'RECEIVE_SET_TRUSTLINE/V3') {
        return {
          app: GEM_WALLET,
          type: 'RECEIVE_SET_TRUSTLINE/V3',
          payload: {
            id: params.id,
            type: ResponseType.Response,
            result: transactionHash ? { hash: transactionHash } : undefined,
            error: error ? serializeError(error) : undefined
          }
        };
      }

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_TRUSTLINE_HASH',
        payload: {
          id: params.id,
          hash: transactionHash
        }
      };
    },
    [params.id, receivingMessage]
  );

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const limitAmount = parseLimitAmount(
      urlParams.get('limitAmount'),
      urlParams.get('value'),
      urlParams.get('currency'),
      urlParams.get('issuer')
    );
    const fee = checkFee(urlParams.get('fee'));
    const id = Number(urlParams.get('id')) || 0;
    const memos = parseMemos(urlParams.get('memos'));
    const flags = parseTrustSetFlags(urlParams.get('flags'));
    const showForm = urlParams.get('showForm') === 'true' || false;

    if (limitAmount === null) {
      setIsParamsMissing(true);
    }

    if (limitAmount && Number.isNaN(Number(limitAmount.value))) {
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
  }, [createMessage, inAppCall]);

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
            (params.fee ? Number(dropsToXrp(params.fee)) : 0);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e);
        });
    }
  }, [
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp,
    params.fee,
    params.limitAmount,
    createMessage
  ]);

  const isValidIssuer = useMemo(() => {
    if (params.limitAmount && isValidAddress(params.limitAmount?.issuer)) {
      return true;
    }
    return false;
  }, [params.limitAmount]);

  const hasEnoughFunds = useMemo(() => Number(difference) > 0, [difference]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<
        ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
      >(createMessage({ transactionHash: null }));
    }
  }, [createMessage, params.inAppCall]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Value, currency and issuer will be present because if not,
    // we won't be able to go to the confirm transaction state
    if (params.limitAmount === null) {
      setIsParamsMissing(true);
    } else {
      if (params.limitAmount.currency.length > 3 && params.limitAmount.currency.length !== 40) {
        params.limitAmount.currency = currencyToHex(params.limitAmount.currency);
      }
      setTrustline({
        limitAmount: params.limitAmount,
        fee: params.fee || undefined,
        memos: params.memos || undefined,
        flags: params.flags || undefined
      })
        .then((transactionHash) => {
          setTransaction(TransactionStatus.Success);
          if (!params.inAppCall) {
            chrome.runtime.sendMessage<
              ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
            >(createMessage({ transactionHash }));
          }
        })
        .catch((e) => {
          setErrorRequestRejection(e.message);
          setTransaction(TransactionStatus.Rejected);
          if (!params.inAppCall) {
            chrome.runtime.sendMessage<
              ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
            >(
              createMessage({
                transactionHash: undefined,
                error: e
              })
            );
          }
        });
    }
  }, [
    setTrustline,
    createMessage,
    params.limitAmount,
    params.fee,
    params.inAppCall,
    params.flags,
    params.memos
  ]);

  const handleTrustlineSubmit = (
    issuer: string,
    token: string,
    limit: string,
    noRipple: boolean,
    showForm: boolean,
    isParamsMissing: boolean
  ) => {
    const flags = updateFlags(noRipple);
    setParams({
      limitAmount: {
        currency: token,
        issuer: issuer,
        value: limit
      },
      fee: params.fee,
      id: params.id,
      memos: params.memos,
      flags: flags,
      showForm: showForm,
      inAppCall: true
    });

    setIsParamsMissing(isParamsMissing);
  };

  const buildInitialValues = () => {
    if (!params.limitAmount) return undefined;

    const noRipple = params.flags
      ? typeof params.flags === 'object'
        ? params.flags.tfSetNoRipple ?? false
        : !!(params.flags & TrustSetFlagsBitmask.tfSetNoRipple)
      : false;

    return {
      issuer: params.limitAmount.issuer,
      token: params.limitAmount.currency,
      limit: Number(params.limitAmount.value),
      noRipple
    };
  };

  const updateFlags = (noRipple: boolean) => {
    if (!params.flags) {
      return noRipple ? TrustSetFlagsBitmask.tfSetNoRipple : TrustSetFlagsBitmask.tfClearNoRipple;
    }

    // No Ripple
    if (noRipple) {
      if (typeof params.flags === 'object') {
        params.flags.tfSetNoRipple = true;
        params.flags.tfClearNoRipple = false;
      } else {
        params.flags |= TrustSetFlagsBitmask.tfSetNoRipple;
        params.flags &= ~TrustSetFlagsBitmask.tfClearNoRipple;
      }
    } else {
      if (typeof params.flags === 'object') {
        params.flags.tfClearNoRipple = true;
        params.flags.tfSetNoRipple = false;
      } else {
        params.flags |= TrustSetFlagsBitmask.tfClearNoRipple;
        params.flags &= ~TrustSetFlagsBitmask.tfSetNoRipple;
      }
    }

    return params.flags;
  };

  if (params.showForm) {
    return (
      <StepForm onTrustlineSubmit={handleTrustlineSubmit} initialValues={buildInitialValues()} />
    );
  }

  if (isParamsMissing) {
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<
        ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
      >(
        createMessage({
          transactionHash: null,
          error: new Error(API_ERROR_BAD_REQUEST)
        })
      );
    }
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
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<
        ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
      >(
        createMessage({
          transactionHash: null,
          error: new Error(API_ERROR_BAD_ISSUER)
        })
      );
    }
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
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<
        ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
      >(
        createMessage({
          transactionHash: null,
          error: new Error(API_ERROR_BAD_REQUEST)
        })
      );
    }
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
    if (!params.inAppCall) {
      chrome.runtime.sendMessage<
        ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
      >(
        createMessage({
          transactionHash: null,
          error: errorDifference
        })
      );
    }
    if (errorDifference.message === 'Account not found.') {
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
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference.message);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference.message}
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
    return <StepWarning onReject={handleReject} onContinue={() => setStep('TRANSACTION')} />;
  }

  const limitAmount = params.limitAmount as IssuedCurrencyAmount;
  const memos = fromHexMemos(params.memos ?? undefined) ?? [];

  return (
    <StepConfirm
      limitAmount={limitAmount}
      fee={params.fee}
      memos={memos}
      flags={params.flags}
      estimatedFees={estimatedFees}
      errorFees={errorFees}
      hasEnoughFunds={hasEnoughFunds}
      defaultFee={DEFAULT_FEES}
      onReject={handleReject}
      onConfirm={handleConfirm}
    />
  );
};
