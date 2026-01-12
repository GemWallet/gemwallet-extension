import { FC, useCallback, useMemo, useState } from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Avatar, Button, Container, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ERROR_RED, HOME_PATH, SECONDARY_GRAY, STORAGE_MESSAGING_KEY } from '../../../constants';
import {
  TransactionProgressStatus,
  useLedger,
  useNetwork,
  useTransactionProgress
} from '../../../contexts';
import { useFees } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { loadFromChromeSessionStorage } from '../../../utils';
import { truncateMPTIssuanceId } from '../../../utils/fetchMPTokenData';
import { toUIError } from '../../../utils/errors';
import { InformationMessage } from '../../molecules';
import { Fee } from '../../organisms';
import { AsyncTransaction, PageWithReturn } from '../../templates';

const DEFAULT_FEES = '12';

interface MPTokenRemoveParams {
  mptIssuanceId: string;
  tokenName?: string;
  issuer?: string;
  issuerName?: string;
}

export const MPTokenRemove: FC = () => {
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error | null>(null);
  const [params, setParams] = useState<MPTokenRemoveParams | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { removeMPTokenAuthorization } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();

  // Load params from session storage
  useMemo(() => {
    const storageKey = searchParams.get(STORAGE_MESSAGING_KEY);
    if (storageKey) {
      loadFromChromeSessionStorage(storageKey).then((data) => {
        if (data) {
          setParams(data as MPTokenRemoveParams);
        }
      });
    }
  }, [searchParams]);

  const { estimatedFees, errorFees } = useFees(
    [
      {
        TransactionType: 'AccountSet', // Use AccountSet as placeholder for fee estimation
        Account: ''
      }
    ],
    DEFAULT_FEES
  );

  const handleRemoveMPToken = useCallback(() => {
    if (!params?.mptIssuanceId) return;

    setTransaction(TransactionStatus.Pending);
    setTransactionProgress(TransactionProgressStatus.IN_PROGRESS);

    removeMPTokenAuthorization(params.mptIssuanceId)
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
  }, [params, removeMPTokenAuthorization, setTransactionProgress]);

  const handleReject = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'MPToken authorization removed'
            : 'MPToken removal failed'
        }
        subtitle={
          transaction === TransactionStatus.Success
            ? `You have successfully removed the MPToken authorization on the ${networkName}`
            : undefined
        }
        transaction={transaction}
        {...(errorRequestRejection && {
          errorMessage: toUIError(errorRequestRejection).message
        })}
      />
    );
  }

  if (!params) {
    return (
      <PageWithReturn title="Remove MPToken" onBackClick={handleReject}>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </PageWithReturn>
    );
  }

  const displayName = params.tokenName || truncateMPTIssuanceId(params.mptIssuanceId);

  return (
    <PageWithReturn title="Remove MPToken" onBackClick={handleReject}>
      <Container style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <Avatar sx={{ bgcolor: ERROR_RED }}>
            <DeleteOutlineIcon />
          </Avatar>
          <div>
            <Typography variant="h6">Remove MPToken Authorization</Typography>
            <Typography variant="caption" style={{ color: SECONDARY_GRAY }}>
              You will no longer be able to hold this token
            </Typography>
          </div>
        </div>

        <InformationMessage title="Warning" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
          <Typography variant="body2">
            Removing authorization means you cannot receive this token anymore. You can only remove
            authorization when your balance is 0. You can re-authorize this token later if needed.
          </Typography>
        </InformationMessage>

        <Typography variant="body2" style={{ marginTop: '10px' }}>
          <strong>Token:</strong> {displayName}
        </Typography>

        <Typography variant="body2">
          <strong>Issuance ID:</strong> {truncateMPTIssuanceId(params.mptIssuanceId, 16, 16)}
        </Typography>

        {(params.issuerName || params.issuer) && (
          <Typography variant="body2">
            <strong>Issuer:</strong> {params.issuerName || params.issuer}
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
            color="error"
            onClick={handleRemoveMPToken}
            disabled={transaction === TransactionStatus.Pending}
            fullWidth
          >
            {transaction === TransactionStatus.Pending ? 'Removing...' : 'Remove Authorization'}
          </Button>
        </div>
      </Container>
    </PageWithReturn>
  );
};
