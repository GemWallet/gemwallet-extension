import { FC, useCallback, useMemo, useState } from 'react';

import TokenIcon from '@mui/icons-material/Token';
import { Avatar, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { HOME_PATH, SECONDARY_GRAY, STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { loadFromChromeSessionStorage } from '../../../utils';
import { toUIError } from '../../../utils/errors';
import { InformationMessage } from '../../molecules';
import { Fee } from '../../organisms';
import { AsyncTransaction, PageWithReturn } from '../../templates';

const DEFAULT_FEES = '12';

interface AddMPTokenParams {
  mptIssuanceId?: string;
  issuer?: string;
}

export const AddMPToken: FC = () => {
  const [mptIssuanceId, setMPTIssuanceId] = useState('');
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error | null>(null);
  const [params, setParams] = useState<AddMPTokenParams>({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addMPTokenAuthorization } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();

  // Load params from session storage if inAppCall
  useMemo(() => {
    const storageKey = searchParams.get(STORAGE_MESSAGING_KEY);
    if (storageKey) {
      loadFromChromeSessionStorage(storageKey).then((data) => {
        if (data) {
          const parsed = data as AddMPTokenParams;
          setParams(parsed);
          if (parsed.mptIssuanceId) {
            setMPTIssuanceId(parsed.mptIssuanceId);
          }
        }
      });
    }
  }, [searchParams]);

  // For MPToken authorization, we need a minimal transaction object for fee estimation
  const { estimatedFees, errorFees } = useFees(
    [
      {
        TransactionType: 'AccountSet', // Use AccountSet as placeholder for fee estimation
        Account: ''
      }
    ],
    DEFAULT_FEES
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMPTIssuanceId(e.target.value);
  }, []);

  const handleAddMPToken = useCallback(() => {
    if (!mptIssuanceId) return;

    setTransaction(TransactionStatus.Pending);
    setTransactionProgress(TransactionProgressStatus.IN_PROGRESS);

    addMPTokenAuthorization(mptIssuanceId)
      .then(() => {
        setTransaction(TransactionStatus.Success);
      })
      .catch((e) => {
        setErrorRequestRejection(e);
        setTransaction(TransactionStatus.Rejected);
      })
      .finally(() => {
        setTransactionProgress(TransactionProgressStatus.IDLE);
      });
  }, [mptIssuanceId, addMPTokenAuthorization, setTransactionProgress]);

  const handleReject = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'MPToken authorization added'
            : 'MPToken authorization failed'
        }
        subtitle={
          transaction === TransactionStatus.Success
            ? `You have successfully authorized the MPToken on the ${networkName}`
            : undefined
        }
        transaction={transaction}
        {...(errorRequestRejection && {
          errorMessage: toUIError(errorRequestRejection).message
        })}
      />
    );
  }

  const isValidIssuanceId = mptIssuanceId.length === 64;

  return (
    <PageWithReturn title="Add MPToken" onBackClick={handleReject}>
      <Container style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <TokenIcon />
          </Avatar>
          <div>
            <Typography variant="h6">Authorize MPToken</Typography>
            <Typography variant="caption" style={{ color: SECONDARY_GRAY }}>
              Hold a Multi-Purpose Token (MPT)
            </Typography>
          </div>
        </div>

        <InformationMessage title="Information">
          <Typography variant="body2">
            Authorizing an MPToken allows you to hold and receive this token. You will need the
            MPTokenIssuanceID from the token issuer.
          </Typography>
        </InformationMessage>

        <TextField
          label="MPTokenIssuanceID"
          placeholder="Enter the 64-character hex issuance ID"
          value={mptIssuanceId}
          onChange={handleInputChange}
          fullWidth
          helperText={
            mptIssuanceId && !isValidIssuanceId
              ? 'MPTokenIssuanceID must be exactly 64 hexadecimal characters'
              : ' '
          }
          error={Boolean(mptIssuanceId && !isValidIssuanceId)}
          inputProps={{ style: { fontFamily: 'monospace' } }}
        />

        {params.issuer && (
          <Typography variant="body2" style={{ marginTop: '10px' }}>
            <strong>Issuer:</strong> {params.issuer}
          </Typography>
        )}

        <Fee
          errorFees={errorFees}
          estimatedFees={estimatedFees}
          fee={estimatedFees ? Number(estimatedFees) : null}
          useLegacy
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button variant="outlined" onClick={handleReject} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddMPToken}
            disabled={!isValidIssuanceId || transaction === TransactionStatus.Pending}
            fullWidth
          >
            {transaction === TransactionStatus.Pending ? 'Adding...' : 'Add MPToken'}
          </Button>
        </div>
      </Container>
    </PageWithReturn>
  );
};
