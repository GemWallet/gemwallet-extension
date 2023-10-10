import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isValidAddress, TrustSet, TrustSetFlags as TrustSetFlagsBitmask } from 'xrpl';

import {
  API_ERROR_BAD_REQUEST,
  GEM_WALLET,
  ReceiveSetTrustlineBackgroundMessage,
  ReceiveSetTrustlineBackgroundMessageDeprecated,
  ResponseType
} from '@gemwallet/constants';

import { API_ERROR_BAD_ISSUER, HOME_PATH } from '../../../constants';
import {
  buildTrustSet,
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress,
  useWallet
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { parseLimitAmount, parseTrustSetFlags } from '../../../utils';
import { parseBaseParamsFromURLParamsNew } from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { AsyncTransaction } from '../../templates';
import { StepConfirm } from './StepConfirm';
import { StepForm } from './StepForm';
import { StepWarning } from './StepWarning';

type STEP = 'WARNING' | 'TRANSACTION';

export interface Params {
  id: number;
  transaction: TrustSet | null;
  // UI specific fields
  inAppCall: boolean;
  showForm: boolean;
}

export const AddNewTrustline: FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const inAppCall = urlParams.get('inAppCall') === 'true' || false;

  const [params, setParams] = useState<Params>({
    id: 0,
    transaction: null,
    // UI specific fields
    inAppCall,
    showForm: false
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [step, setStep] = useState<STEP>('WARNING');
  const [errorValue, setErrorValue] = useState<string>('');
  const { setTrustline } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'TrustSet',
      Account: '',
      LimitAmount: params.transaction?.LimitAmount || {
        currency: '',
        issuer: '',
        value: '0'
      },
      ...(params.transaction?.Memos && { Memos: params.transaction?.Memos }),
      ...(params.transaction?.Flags && { Flags: params.transaction.Flags })
    },
    params.transaction?.Fee
  );

  const receivingMessage = useMemo(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get('requestMessage') === 'REQUEST_SET_TRUSTLINE/V3'
      ? 'RECEIVE_SET_TRUSTLINE/V3'
      : 'RECEIVE_TRUSTLINE_HASH';
  }, []);

  const sendMessageToBackground = useCallback(
    (
      message: ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
    ) => {
      chrome.runtime.sendMessage(message);
      setTransactionProgress(TransactionProgressStatus.IDLE);
    },
    [setTransactionProgress]
  );

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

  const navigate = useNavigate();
  const badRequestCallback = useCallback(() => {
    sendMessageToBackground(
      createMessage({
        transactionHash: null,
        error: new Error(API_ERROR_BAD_REQUEST)
      })
    );
  }, [createMessage, sendMessageToBackground]);

  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    errorValue,
    badRequestCallback: !params.inAppCall ? badRequestCallback : undefined,
    onClick: params.inAppCall ? () => navigate(HOME_PATH) : undefined
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // SetTrustline fields
    const limitAmount = parseLimitAmount(
      urlParams.get('limitAmount'),
      urlParams.get('value'),
      urlParams.get('currency'),
      urlParams.get('issuer')
    );
    const flags = parseTrustSetFlags(urlParams.get('flags'));
    const wallet = getCurrentWallet();

    // UI specific fields
    const showForm = urlParams.get('showForm') === 'true' || false;

    if (limitAmount === null) {
      setIsParamsMissing(true);
    }

    if (limitAmount && Number.isNaN(Number(limitAmount.value))) {
      setErrorValue('The value must be a number, the value provided was not a number.');
    }

    if (!wallet) {
      setIsParamsMissing(true);
      return;
    }

    const transaction = limitAmount
      ? buildTrustSet(
          {
            ...parseBaseParamsFromURLParamsNew(urlParams),
            ...(flags && { flags }),
            limitAmount: limitAmount
          },
          wallet
        )
      : null;

    setParams({
      id,
      transaction,
      // UI specific fields
      inAppCall,
      showForm
    });
  }, [createMessage, getCurrentWallet, inAppCall]);

  const isValidIssuer = useMemo(() => {
    if (params.transaction?.LimitAmount && isValidAddress(params.transaction.LimitAmount?.issuer)) {
      return true;
    }
    return false;
  }, [params.transaction?.LimitAmount]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    if (!params.inAppCall) {
      sendMessageToBackground(createMessage({ transactionHash: null }));
    }
  }, [createMessage, params.inAppCall, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Value, currency and issuer will be present because if not,
    // we won't be able to go to the confirm transaction state
    if (params.transaction?.LimitAmount === null || params.transaction?.LimitAmount === undefined) {
      setIsParamsMissing(true);
    } else {
      setTrustline(params.transaction)
        .then((transactionHash) => {
          setTransaction(TransactionStatus.Success);
          if (!params.inAppCall) {
            sendMessageToBackground(createMessage({ transactionHash }));
          }
        })
        .catch((e) => {
          setErrorRequestRejection(e);
          setTransaction(TransactionStatus.Rejected);
          if (!params.inAppCall) {
            sendMessageToBackground(
              createMessage({
                transactionHash: undefined,
                error: e
              })
            );
          }
        });
    }
  }, [params, setTrustline, sendMessageToBackground, createMessage]);

  const handleTrustlineSubmit = (
    issuer: string,
    token: string,
    limit: string,
    noRipple: boolean,
    showForm: boolean,
    isParamsMissing: boolean
  ) => {
    const flags = updateFlags(noRipple);
    const wallet = getCurrentWallet();
    if (wallet) {
      setParams({
        id: params.id,
        // BaseTransaction fields
        transaction: buildTrustSet(
          {
            ...params.transaction,
            ...(flags && { flags }),
            limitAmount: {
              currency: token,
              issuer: issuer,
              value: limit
            }
          },
          wallet
        ),
        // UI specific fields
        showForm: showForm,
        inAppCall: true
      });
    }

    setIsParamsMissing(isParamsMissing);
  };

  const formInitialValues = useMemo(() => {
    if (!params.transaction?.LimitAmount) return undefined;

    const noRipple = params.transaction?.Flags
      ? typeof params.transaction?.Flags === 'object'
        ? params.transaction.Flags.tfSetNoRipple ?? false
        : !!(params.transaction.Flags & TrustSetFlagsBitmask.tfSetNoRipple)
      : false;

    return {
      issuer: params.transaction?.LimitAmount.issuer,
      token: params.transaction?.LimitAmount.currency,
      limit: Number(params.transaction.LimitAmount.value),
      noRipple
    };
  }, [params.transaction?.Flags, params.transaction?.LimitAmount]);

  const updateFlags = useCallback(
    (noRipple: boolean) => {
      if (!params.transaction?.Flags) {
        return noRipple ? TrustSetFlagsBitmask.tfSetNoRipple : TrustSetFlagsBitmask.tfClearNoRipple;
      }

      // No Ripple
      if (noRipple) {
        if (typeof params.transaction?.Flags === 'object') {
          params.transaction.Flags.tfSetNoRipple = true;
          params.transaction.Flags.tfClearNoRipple = false;
        } else {
          params.transaction.Flags |= TrustSetFlagsBitmask.tfSetNoRipple;
          params.transaction.Flags &= ~TrustSetFlagsBitmask.tfClearNoRipple;
        }
      } else {
        if (typeof params.transaction.Flags === 'object') {
          params.transaction.Flags.tfClearNoRipple = true;
          params.transaction.Flags.tfSetNoRipple = false;
        } else {
          params.transaction.Flags |= TrustSetFlagsBitmask.tfClearNoRipple;
          params.transaction.Flags &= ~TrustSetFlagsBitmask.tfSetNoRipple;
        }
      }

      return params.transaction.Flags;
    },
    [params]
  );

  if (params.showForm) {
    return <StepForm onTrustlineSubmit={handleTrustlineSubmit} initialValues={formInitialValues} />;
  }

  if (!isValidIssuer) {
    if (!params.inAppCall) {
      sendMessageToBackground(
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

  if (step === 'WARNING') {
    return (
      <>
        {transactionStatusComponent ? (
          transactionStatusComponent
        ) : (
          <StepWarning onReject={handleReject} onContinue={() => setStep('TRANSACTION')} />
        )}
      </>
    );
  }

  return (
    <>
      {transactionStatusComponent ? (
        transactionStatusComponent
      ) : (
        <StepConfirm
          params={params}
          estimatedFees={estimatedFees}
          errorFees={errorFees}
          hasEnoughFunds={hasEnoughFunds}
          onReject={handleReject}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};
