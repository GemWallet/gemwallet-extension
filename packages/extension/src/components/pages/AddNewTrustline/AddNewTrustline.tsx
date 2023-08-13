import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isValidAddress, TrustSetFlags as TrustSetFlagsBitmask } from 'xrpl';
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  ReceiveSetTrustlineBackgroundMessage,
  ReceiveSetTrustlineBackgroundMessageDeprecated,
  ResponseType,
  TrustSetFlags
} from '@gemwallet/constants';

import { API_ERROR_BAD_ISSUER, API_ERROR_BAD_REQUEST, HOME_PATH } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import {
  handleAmountHexCurrency,
  parseLimitAmount,
  parseTrustSetFlags,
  toXRPLMemos
} from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { StepForm, StepWarning, StepConfirm } from '../../pages';
import { AsyncTransaction } from '../../templates';

type STEP = 'WARNING' | 'TRANSACTION';

const createBadRequestCallback = (
  createMessage: (messagePayload: {
    transactionHash: string | null | undefined;
    error?: Error;
  }) => ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
) => {
  return () => {
    chrome.runtime.sendMessage<
      ReceiveSetTrustlineBackgroundMessage | ReceiveSetTrustlineBackgroundMessageDeprecated
    >(
      createMessage({
        transactionHash: null,
        error: new Error(API_ERROR_BAD_REQUEST)
      })
    );
  };
};

export interface Params extends BaseTransactionParams {
  id: number;
  // SetTrustline fields
  limitAmount: IssuedCurrencyAmount | null;
  flags: TrustSetFlags | null;
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
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // SetTrustline fields
    limitAmount: null,
    flags: null,
    // UI specific fields
    inAppCall,
    showForm: false
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [step, setStep] = useState<STEP>('WARNING');
  const [errorValue, setErrorValue] = useState<string>('');
  const { setTrustline } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'TrustSet',
      Account: '',
      Fee: params.fee || undefined,
      LimitAmount: params.limitAmount || {
        currency: '',
        issuer: '',
        value: '0'
      },
      Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
      Flags: params.flags ?? undefined
    },
    params.fee
  );

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

  const navigate = useNavigate();
  const badRequestCallback = useCallback(
    () => createBadRequestCallback(createMessage),
    [createMessage]
  );
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

    // BaseTransaction fields
    const {
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature
    } = parseBaseParamsFromURLParams(urlParams);

    // SetTrustline fields
    const limitAmount = parseLimitAmount(
      urlParams.get('limitAmount'),
      urlParams.get('value'),
      urlParams.get('currency'),
      urlParams.get('issuer')
    );
    const flags = parseTrustSetFlags(urlParams.get('flags'));

    // UI specific fields
    const showForm = urlParams.get('showForm') === 'true' || false;

    if (limitAmount === null) {
      setIsParamsMissing(true);
    }

    if (limitAmount && Number.isNaN(Number(limitAmount.value))) {
      setErrorValue('The value must be a number, the value provided was not a number.');
    }

    setParams({
      id,
      // BaseTransaction fields
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature,
      // SetTrustline fields
      limitAmount,
      flags,
      // UI specific fields
      inAppCall,
      showForm
    });
  }, [createMessage, inAppCall]);

  const isValidIssuer = useMemo(() => {
    if (params.limitAmount && isValidAddress(params.limitAmount?.issuer)) {
      return true;
    }
    return false;
  }, [params.limitAmount]);

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
      handleAmountHexCurrency(params.limitAmount);
      setTrustline({
        // BaseTransaction fields
        ...getBaseFromParams(params),
        // SetTrustline fields
        limitAmount: params.limitAmount,
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
  }, [params, setTrustline, createMessage]);

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
      id: params.id,
      // BaseTransaction fields
      fee: null,
      sequence: null,
      accountTxnID: null,
      lastLedgerSequence: null,
      memos: null,
      signers: null,
      sourceTag: null,
      signingPubKey: null,
      ticketSequence: null,
      txnSignature: null,
      // SetTrustline fields
      limitAmount: {
        currency: token,
        issuer: issuer,
        value: limit
      },
      flags: flags,
      // UI specific fields
      showForm: showForm,
      inAppCall: true
    });

    setIsParamsMissing(isParamsMissing);
  };

  const formInitialValues = useMemo(() => {
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
  }, [params.limitAmount, params.flags]);

  const updateFlags = useCallback(
    (noRipple: boolean) => {
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
    },
    [params]
  );

  if (params.showForm) {
    return <StepForm onTrustlineSubmit={handleTrustlineSubmit} initialValues={formInitialValues} />;
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
