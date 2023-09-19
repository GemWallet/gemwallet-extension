import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isValidAddress } from 'xrpl';

import {
  GEM_WALLET,
  Memo,
  ReceiveSetRegularKeyBackgroundMessage,
  ResponseType
} from '@gemwallet/constants';

import { ERROR_RED, HOME_PATH, SETTINGS_PATH } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { fromHexMemos } from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { AsyncTransaction, PageWithReturn, PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // SetRegularKey fields
  regularKey: string | null;
  // UI specific fields
  inAppCall: boolean;
}

export const SetRegularKey: FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const inAppCall = urlParams.get('inAppCall') === 'true' || false;

  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // SetRegularKey fields
    regularKey: null,
    // UI specific fields
    inAppCall
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error>();
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [inputRegularKey, setInputRegularKey] = useState<string | null>(null);
  const [inputRegularKeyError, setInputRegularKeyError] = useState<string>('');
  const [removeKeyChecked, setRemoveKeyChecked] = useState(false);
  const { setRegularKey, getAccountInfo } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'SetRegularKey',
      Account: '',
      ...(params.regularKey ? { RegularKey: params.regularKey } : {})
    },
    params.fee
  );
  const navigate = useNavigate();
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing: false,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection,
    onClick: params.inAppCall ? () => navigate(HOME_PATH) : undefined
  });

  const sendMessageToBackground = useCallback(
    (message: ReceiveSetRegularKeyBackgroundMessage) => {
      if (!params.inAppCall) {
        chrome.runtime.sendMessage(message);
        setTransactionProgress(TransactionProgressStatus.IDLE);
      }
    },

    [params.inAppCall, setTransactionProgress]
  );

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetRegularKeyBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_REGULAR_KEY/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: hash
            ? {
                hash: hash
              }
            : undefined,
          error: error ? serializeError(error) : undefined
        }
      };
    },
    [params.id]
  );

  const isValidRegularKey = useMemo(() => {
    // RegularKey is optional
    if (!params.regularKey) {
      return true;
    }

    return isValidAddress(params.regularKey);
  }, [params.regularKey]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputRegularKey(e.target.value);

    if (e.target.value !== '' && !isValidAddress(e.target.value)) {
      // We only accept valid addresses and empty strings (for removing the regular key)
      setInputRegularKeyError('The regular key is not a valid address');
    } else {
      setInputRegularKeyError('');
    }
  };

  // Modify this to handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemoveKeyChecked(e.target.checked);
    if (e.target.checked) {
      setInputRegularKey(null);
      setInputRegularKeyError('');
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    getAccountInfo().then((accountInfo) => {
      const currentRegularKey = accountInfo.result.account_data.RegularKey;
      if (currentRegularKey) {
        setInputRegularKey(currentRegularKey);
      }
    });

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

    // SetRegularKey fields
    const regularKey = urlParams.get('regularKey');

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
      // SetRegularKey fields
      regularKey,
      // UI specific fields
      inAppCall
    });
  }, [getAccountInfo, inAppCall]);

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    sendMessageToBackground(message);
  }, [createMessage, sendMessageToBackground]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    const finalRegularKey =
      inAppCall && removeKeyChecked ? undefined : inAppCall ? inputRegularKey : params.regularKey;

    setRegularKey({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // SetRegularKey fields
      regularKey: finalRegularKey || undefined
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        sendMessageToBackground(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        sendMessageToBackground(message);
      });
  }, [
    inAppCall,
    removeKeyChecked,
    inputRegularKey,
    params,
    setRegularKey,
    sendMessageToBackground,
    createMessage
  ]);

  const {
    // Base transaction params
    fee,
    memos,
    // SetRegularKey params
    regularKey
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  if (!isValidRegularKey) {
    return (
      <AsyncTransaction
        title="Incorrect transaction"
        subtitle={
          <>
            Your transaction is incorrect.
            <br />
            The regular key is not a valid address.
          </>
        }
        transaction={TransactionStatus.Rejected}
      />
    );
  }

  if (transactionStatusComponent) {
    return <div>{transactionStatusComponent}</div>;
  }

  if (params.inAppCall) {
    return (
      <PageWithReturn title="Set Regular Key" onBackClick={handleBack}>
        <SetRegularKeyForm
          regularKey={regularKey}
          decodedMemos={decodedMemos}
          fee={fee}
          inAppCall={inAppCall}
          hasEnoughFunds={hasEnoughFunds}
          inputRegularKey={inputRegularKey}
          inputRegularKeyError={inputRegularKeyError}
          removeKeyChecked={removeKeyChecked}
          estimatedFees={estimatedFees}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          handleReject={handleReject}
          handleConfirm={handleConfirm}
          errorFees={errorFees}
        />
      </PageWithReturn>
    );
  }

  return (
    <PageWithTitle title="Set Regular Key" styles={{ container: { justifyContent: 'initial' } }}>
      <SetRegularKeyForm
        regularKey={regularKey}
        decodedMemos={decodedMemos}
        fee={fee}
        inAppCall={inAppCall}
        hasEnoughFunds={hasEnoughFunds}
        inputRegularKey={inputRegularKey}
        inputRegularKeyError={inputRegularKeyError}
        removeKeyChecked={removeKeyChecked}
        estimatedFees={estimatedFees}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleReject={handleReject}
        handleConfirm={handleConfirm}
        errorFees={errorFees}
      />
    </PageWithTitle>
  );
};

interface SetRegularKeyFormProps {
  // API params
  regularKey: string | null;
  decodedMemos: Memo[];
  fee: string | null;
  // UI specific params
  inAppCall: boolean;
  hasEnoughFunds: boolean;
  inputRegularKey: string | null;
  inputRegularKeyError: string;
  removeKeyChecked: boolean;
  estimatedFees: string;
  // UI functions
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleReject: () => void;
  handleConfirm: () => void;
  // Error handling
  errorFees: string | undefined;
}

const SetRegularKeyForm: FC<SetRegularKeyFormProps> = ({
  regularKey,
  decodedMemos,
  fee,
  inAppCall,
  hasEnoughFunds,
  inputRegularKey,
  inputRegularKeyError,
  handleInputChange,
  removeKeyChecked,
  handleCheckboxChange,
  estimatedFees,
  handleReject,
  handleConfirm,
  errorFees
}) => {
  return (
    <>
      <Typography align="center" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        You can protect your account by assigning a regular key pair to it and using it instead of
        the master key pair to sign transactions whenever possible.
      </Typography>
      <Typography align="center" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        If your regular key pair is compromised, but your master key pair is not, you can use a
        SetRegularKey transaction to regain control of your account.
      </Typography>
      <Typography
        align="center"
        style={{ marginTop: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}
      >
        <Link
          href="https://xrpl.org/assign-a-regular-key-pair.html?utm_source=gemwallet.app"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about regular keys
        </Link>
      </Typography>
      {!hasEnoughFunds ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ErrorIcon style={{ color: ERROR_RED }} />
          <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
            Insufficient funds.
          </Typography>
        </div>
      ) : null}
      {inAppCall ? (
        <>
          <TextField
            fullWidth
            style={{ marginBottom: '15px' }}
            id="regularKey"
            name="regularKey"
            label="Regular Key"
            variant="outlined"
            value={inputRegularKey || ''}
            onChange={handleInputChange}
            disabled={removeKeyChecked}
            error={!!inputRegularKeyError}
            helperText={inputRegularKeyError}
          />
          <Typography style={{ marginBottom: '15px', fontSize: '0.9rem !important' }}>
            <FormControlLabel
              control={
                <Checkbox
                  id="deleteRegularKey"
                  name="deleteRegularKey"
                  checked={removeKeyChecked}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Check this box to remove the current regular key"
            />
          </Typography>
        </>
      ) : regularKey ? (
        <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
          <Typography variant="body1">Regular Key:</Typography>
          <Typography variant="body2">{regularKey}</Typography>
        </Paper>
      ) : null}
      <div style={{ marginBottom: '40px' }}>
        <BaseTransaction
          fee={fee ? Number(fee) : null}
          memos={decodedMemos}
          flags={null}
          errorFees={errorFees}
          estimatedFees={estimatedFees}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1d1d1d'
        }}
      >
        <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
          <Button variant="contained" color="secondary" onClick={handleReject}>
            Reject
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!hasEnoughFunds || inputRegularKeyError !== ''}
          >
            Confirm
          </Button>
        </Container>
      </div>
    </>
  );
};
