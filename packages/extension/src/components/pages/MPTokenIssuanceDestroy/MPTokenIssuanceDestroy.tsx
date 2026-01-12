import { FC, useCallback, useMemo, useState } from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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

interface MPTokenIssuanceDestroyParams {
  mptIssuanceId: string;
  tokenName?: string;
}

export const MPTokenIssuanceDestroy: FC = () => {
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error | null>(null);
  const [params, setParams] = useState<MPTokenIssuanceDestroyParams | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { destroyMPTokenIssuance } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();

  // Load params from session storage
  useMemo(() => {
    const storageKey = searchParams.get(STORAGE_MESSAGING_KEY);
    if (storageKey) {
      loadFromChromeSessionStorage(storageKey).then((data) => {
        if (data) {
          setParams(data as MPTokenIssuanceDestroyParams);
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

  const handleDestroy = useCallback(() => {
    if (!params?.mptIssuanceId) return;

    setTransaction(TransactionStatus.Pending);
    setTransactionProgress(TransactionProgressStatus.IN_PROGRESS);

    destroyMPTokenIssuance(params.mptIssuanceId)
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
  }, [params, destroyMPTokenIssuance, setTransactionProgress]);

  const handleReject = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'MPToken issuance destroyed'
            : 'MPToken destruction failed'
        }
        subtitle={
          transaction === TransactionStatus.Success
            ? `You have successfully destroyed the MPToken issuance on the ${networkName}`
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
      <PageWithReturn title="Destroy MPToken Issuance" onBackClick={handleReject}>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </PageWithReturn>
    );
  }

  const displayName = params.tokenName || truncateMPTIssuanceId(params.mptIssuanceId);

  return (
    <PageWithReturn title="Destroy MPToken Issuance" onBackClick={handleReject}>
      <Container style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <Avatar sx={{ bgcolor: ERROR_RED }}>
            <DeleteForeverIcon />
          </Avatar>
          <div>
            <Typography variant="h6">Destroy MPToken Issuance</Typography>
            <Typography variant="caption" style={{ color: SECONDARY_GRAY }}>
              Permanently remove this token issuance
            </Typography>
          </div>
        </div>

        <InformationMessage title="Warning" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
          <Typography variant="body2">
            Destroying an MPToken issuance is irreversible. You can only destroy an issuance when
            there are no outstanding tokens (all tokens have been clawed back or the total supply is
            zero). This action cannot be undone.
          </Typography>
        </InformationMessage>

        <Typography variant="body2" style={{ marginTop: '10px' }}>
          <strong>Token:</strong> {displayName}
        </Typography>

        <Typography variant="body2">
          <strong>Issuance ID:</strong> {truncateMPTIssuanceId(params.mptIssuanceId, 16, 16)}
        </Typography>

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
            onClick={handleDestroy}
            disabled={transaction === TransactionStatus.Pending}
            fullWidth
          >
            {transaction === TransactionStatus.Pending ? 'Destroying...' : 'Destroy Issuance'}
          </Button>
        </div>
      </Container>
    </PageWithReturn>
  );
};
