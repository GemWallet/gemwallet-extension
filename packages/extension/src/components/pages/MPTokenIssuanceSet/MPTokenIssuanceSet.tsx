import { FC, useCallback, useMemo, useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material';
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
import { truncateMPTIssuanceId } from '../../../utils/fetchMPTokenData';
import { toUIError } from '../../../utils/errors';
import { InformationMessage } from '../../molecules';
import { Fee } from '../../organisms';
import { AsyncTransaction, PageWithReturn } from '../../templates';

const DEFAULT_FEES = '12';

// MPTokenIssuanceSet flags
const tfMPTLock = 0x0001; // Lock the MPToken for a holder
const tfMPTUnlock = 0x0002; // Unlock the MPToken for a holder

interface MPTokenIssuanceSetParams {
  mptIssuanceId: string;
  tokenName?: string;
  holder?: string;
}

export const MPTokenIssuanceSet: FC = () => {
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const [errorRequestRejection, setErrorRequestRejection] = useState<Error | null>(null);
  const [params, setParams] = useState<MPTokenIssuanceSetParams | null>(null);

  // Form fields
  const [holder, setHolder] = useState<string>('');
  const [lockToken, setLockToken] = useState(false);
  const [unlockToken, setUnlockToken] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setMPTokenIssuance } = useLedger();
  const { networkName } = useNetwork();
  const { setTransactionProgress } = useTransactionProgress();

  // Load params from session storage
  useMemo(() => {
    const storageKey = searchParams.get(STORAGE_MESSAGING_KEY);
    if (storageKey) {
      loadFromChromeSessionStorage(storageKey).then((data) => {
        if (data) {
          const loadedParams = data as MPTokenIssuanceSetParams;
          setParams(loadedParams);
          if (loadedParams.holder) {
            setHolder(loadedParams.holder);
          }
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

  const calculateFlags = useCallback(() => {
    let flags = 0;
    if (lockToken) flags |= tfMPTLock;
    if (unlockToken) flags |= tfMPTUnlock;
    return flags;
  }, [lockToken, unlockToken]);

  const handleSet = useCallback(() => {
    if (!params?.mptIssuanceId) return;

    setTransaction(TransactionStatus.Pending);
    setTransactionProgress(TransactionProgressStatus.IN_PROGRESS);

    const setParams_: {
      mptIssuanceId: string;
      holder?: string;
      flags?: number;
    } = {
      mptIssuanceId: params.mptIssuanceId
    };

    if (holder) {
      setParams_.holder = holder;
    }

    const flags = calculateFlags();
    if (flags > 0) {
      setParams_.flags = flags;
    }

    setMPTokenIssuance(setParams_)
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
  }, [params, holder, calculateFlags, setMPTokenIssuance, setTransactionProgress]);

  const handleReject = useCallback(() => {
    navigate(HOME_PATH);
  }, [navigate]);

  // Lock and unlock are mutually exclusive
  const handleLockChange = useCallback((checked: boolean) => {
    setLockToken(checked);
    if (checked) setUnlockToken(false);
  }, []);

  const handleUnlockChange = useCallback((checked: boolean) => {
    setUnlockToken(checked);
    if (checked) setLockToken(false);
  }, []);

  if (transaction === TransactionStatus.Success || transaction === TransactionStatus.Rejected) {
    return (
      <AsyncTransaction
        title={
          transaction === TransactionStatus.Success
            ? 'MPToken issuance updated'
            : 'MPToken update failed'
        }
        subtitle={
          transaction === TransactionStatus.Success
            ? `You have successfully updated the MPToken issuance on the ${networkName}`
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
      <PageWithReturn title="Update MPToken Issuance" onBackClick={handleReject}>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </PageWithReturn>
    );
  }

  const displayName = params.tokenName || truncateMPTIssuanceId(params.mptIssuanceId);

  // Require either a holder with lock/unlock action, or some other valid configuration
  const isValidConfig = holder && (lockToken || unlockToken);

  return (
    <PageWithReturn title="Update MPToken Issuance" onBackClick={handleReject}>
      <Container
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <SettingsIcon />
          </Avatar>
          <div>
            <Typography variant="h6">Update MPToken Issuance</Typography>
            <Typography variant="caption" style={{ color: SECONDARY_GRAY }}>
              Modify issuance settings or lock/unlock holders
            </Typography>
          </div>
        </div>

        <Typography variant="body2" style={{ marginTop: '10px' }}>
          <strong>Token:</strong> {displayName}
        </Typography>

        <Typography variant="body2">
          <strong>Issuance ID:</strong> {truncateMPTIssuanceId(params.mptIssuanceId, 16, 16)}
        </Typography>

        <InformationMessage title="Information">
          <Typography variant="body2">
            Use MPTokenIssuanceSet to lock or unlock tokens for a specific holder. Locking prevents
            the holder from transferring their tokens until unlocked. This requires the issuance to
            have been created with the &quot;Can Lock&quot; capability.
          </Typography>
        </InformationMessage>

        <TextField
          label="Holder Address"
          placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          value={holder}
          onChange={(e) => setHolder(e.target.value)}
          fullWidth
          helperText="The account address of the token holder to lock/unlock"
        />

        <Typography variant="subtitle2" style={{ marginTop: '10px', color: SECONDARY_GRAY }}>
          Actions
        </Typography>

        <FormControlLabel
          control={
            <Checkbox checked={lockToken} onChange={(e) => handleLockChange(e.target.checked)} />
          }
          label="Lock tokens (prevent holder from transferring)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={unlockToken}
              onChange={(e) => handleUnlockChange(e.target.checked)}
            />
          }
          label="Unlock tokens (allow holder to transfer again)"
        />

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
            onClick={handleSet}
            disabled={!isValidConfig || transaction === TransactionStatus.Pending}
            fullWidth
          >
            {transaction === TransactionStatus.Pending ? 'Updating...' : 'Update Issuance'}
          </Button>
        </div>
      </Container>
    </PageWithReturn>
  );
};
