import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import * as Sentry from '@sentry/react';
import { dropsToXrp, isValidAddress } from 'xrpl';
import { Amount } from 'xrpl/dist/npm/models/common';

import {
  GEM_WALLET,
  Memo,
  PaymentFlags,
  ReceivePaymentHashBackgroundMessage
} from '@gemwallet/constants';

import { DEFAULT_RESERVE, ERROR_RED } from '../../../constants';
import { useLedger, useNetwork, useServer, useWallet } from '../../../contexts';
import { TransactionStatus } from '../../../types';
import { formatAmount, formatToken, fromHexMemos, toXRPLMemos } from '../../../utils';
import { TileLoader } from '../../atoms';
import { AsyncTransaction, PageWithSpinner, PageWithTitle } from '../../templates';

const DEFAULT_FEES = 'Loading ...';

interface Params {
  amount: Amount | null;
  destination: string | null;
  id: number;
  memos: Memo[] | null;
  destinationTag: number | null;
  fee: string | null;
  flags: PaymentFlags | null;
}

export const Transaction: FC = () => {
  const [params, setParams] = useState<Params>({
    amount: null,
    destination: null,
    id: 0,
    memos: null,
    destinationTag: null,
    fee: null,
    flags: null
  });
  const [estimatedFees, setEstimatedFees] = useState<string>(DEFAULT_FEES);
  const [errorFees, setErrorFees] = useState('');
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [difference, setDifference] = useState<number | undefined>();
  const [errorDifference, setErrorDifference] = useState<string | undefined>();
  const [isParamsMissing, setIsParamsMissing] = useState(false);

  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { estimateNetworkFees, sendPayment } = useLedger();
  const { getCurrentWallet } = useWallet();
  const { client, network } = useNetwork();
  const { serverInfo } = useServer();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amount = parseAmountFromString(urlParams.get('amount'));
    const destination = urlParams.get('destination');
    const id = Number(urlParams.get('id')) || 0;
    const memosString = urlParams.get('memos');
    const memos = memosString ? (JSON.parse(memosString) as Memo[]) : null;
    const destinationTag = urlParams.get('destinationTag')
      ? Number(urlParams.get('destinationTag'))
      : null;
    const fee = checkFee(urlParams.get('fee'));
    const flags = parseFlagsFromString(urlParams.get('flags'));

    if (amount === null || destination === null) {
      setIsParamsMissing(true);
    }

    setParams({
      amount,
      destination,
      id,
      memos,
      destinationTag,
      fee,
      flags
    });
  }, []);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && client && params.amount && params.destination) {
      estimateNetworkFees({
        TransactionType: 'Payment',
        Account: currentWallet.publicAddress,
        Amount: params.amount,
        Destination: params.destination,
        Memos: params.memos ? toXRPLMemos(params.memos) : undefined,
        DestinationTag: params.destinationTag ?? undefined,
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
    client,
    estimateNetworkFees,
    getCurrentWallet,
    params.amount,
    params.destination,
    params.memos,
    params.destinationTag,
    params.fee,
    params.flags
  ]);

  useEffect(() => {
    const currentWallet = getCurrentWallet();
    if (currentWallet && params.amount) {
      const amount =
        typeof params.amount === 'string' ? dropsToXrp(params.amount) : params.amount.value;
      client
        ?.getXrpBalance(currentWallet!.publicAddress)
        .then((currentBalance) => {
          const difference =
            Number(currentBalance) -
            Number(serverInfo?.info.validated_ledger?.reserve_base_xrp || DEFAULT_RESERVE) -
            Number(amount);
          setDifference(difference);
        })
        .catch((e) => {
          setErrorDifference(e.message);
        });
    }
  }, [
    params.amount,
    client,
    getCurrentWallet,
    serverInfo?.info.validated_ledger?.reserve_base_xrp
  ]);

  const isValidDestination = useMemo(() => {
    if (params.destination && isValidAddress(params.destination)) {
      return true;
    }
    return false;
  }, [params.destination]);

  const createMessage = useCallback(
    (transactionHash: string | null | undefined): ReceivePaymentHashBackgroundMessage => {
      return {
        app: GEM_WALLET,
        type: 'RECEIVE_PAYMENT_HASH',
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
    chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // Amount and Destination will be present because if not,
    // we won't be able to go to the confirm transaction state
    sendPayment({
      amount: params.amount as Amount,
      destination: params.destination as string,
      memos: params.memos ?? undefined,
      destinationTag: params.destinationTag ?? undefined,
      fee: params.fee ?? undefined,
      flags: params.flags ?? undefined
    })
      .then((transactionHash) => {
        setTransaction(TransactionStatus.Success);
        const message = createMessage(transactionHash);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage(undefined);
        chrome.runtime.sendMessage<ReceivePaymentHashBackgroundMessage>(message);
      });
  }, [
    createMessage,
    params.amount,
    params.destination,
    params.memos,
    params.destinationTag,
    params.fee,
    params.flags,
    sendPayment
  ]);

  const hasEnoughFunds = useMemo(() => {
    return Number(difference) > 0;
  }, [difference]);

  const checkFee = (fee: string | null) => {
    if (fee) {
      try {
        if (Number(fee) && dropsToXrp(fee)) {
          return fee;
        }
      } catch (e) {}
    }
    return null;
  };

  const parseAmountFromString = (amountString: string | null) => {
    if (!amountString) {
      return null;
    }

    try {
      const parsedAmount = JSON.parse(amountString);

      if (
        typeof parsedAmount === 'object' &&
        parsedAmount !== null &&
        'value' in parsedAmount &&
        'issuer' in parsedAmount &&
        'currency' in parsedAmount
      ) {
        return parsedAmount as { value: string; issuer: string; currency: string };
      }

      if (typeof parsedAmount === 'number') {
        return parsedAmount.toString();
      }
    } catch (error) {}

    return amountString;
  };

  const parseFlagsFromString = (flagsString: string | null) => {
    if (!flagsString) {
      return null;
    }

    if (Number(flagsString)) {
      return Number(flagsString);
    }

    try {
      const parsedFlags = JSON.parse(flagsString);

      if (
        typeof parsedFlags === 'object' &&
        parsedFlags !== null &&
        ('tfNoDirectRipple' in parsedFlags ||
          'tfPartialPayment' in parsedFlags ||
          'tfLimitQuality' in parsedFlags)
      ) {
        return parsedFlags as {
          tfNoDirectRipple?: boolean;
          tfPartialPayment?: boolean;
          tfLimitQuality?: boolean;
        };
      }
    } catch (error) {}

    return null;
  };

  if (isParamsMissing) {
    return (
      <AsyncTransaction
        title="Transaction rejected"
        subtitle={
          <>
            Your transaction failed, please try again.
            <br />
            An amount and a destination have not been provided to the extension.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (!isValidDestination) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The destination address of the transaction is invalid.
          </>
        }
        transaction={TransactionStatus.Rejected}
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
        />
      );
    }
    Sentry.captureException('Transaction failed - errorDifference: ' + errorDifference);
    return (
      <AsyncTransaction
        title="Error"
        subtitle={errorDifference}
        transaction={TransactionStatus.Rejected}
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
      />
    );
  }

  const { amount, destination, memos, destinationTag, fee, flags } = params;
  const decodedMemos = fromHexMemos(memos || []);

  const formatFlags = (flags: PaymentFlags) => {
    if (typeof flags === 'object') {
      return Object.entries(flags)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } else {
      return flags;
    }
  };

  return (
    <PageWithTitle title="Confirm Transaction">
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ErrorIcon style={{ color: ERROR_RED }} />
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Destination:</Typography>
        <Typography variant="body2">{destination}</Typography>
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
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Destination Tag:</Typography>
          <Typography variant="body2">{destinationTag}</Typography>
        </Paper>
      ) : null}
      {flags ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Flags:</Typography>
          <Typography variant="body2">
            <pre style={{ margin: 0 }}>{formatFlags(flags)}</pre>
          </Typography>
        </Paper>
      ) : null}
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
        <Typography variant="body1">Amount:</Typography>
        <Typography variant="h6" component="h1" align="right">
          {amount ? formatAmount(amount) : 'Not found'}
        </Typography>
      </Paper>
      <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
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
          ) : fee ? (
            formatToken(Number(fee), 'XRP (manual)', true)
          ) : (
            formatAmount(estimatedFees)
          )}
        </Typography>
      </Paper>
      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
          Confirm
        </Button>
      </Container>
    </PageWithTitle>
  );
};
